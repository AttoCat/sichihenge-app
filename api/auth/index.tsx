import { Hono } from "hono";
import { supabase } from "../supabaseClient.ts";
import { generateNonce } from "./nonce.ts";

export const auth = new Hono();

auth.post("/login", async (c) => {
  const domain = new URL(c.req.url).origin;
  const { email, password, linkToken } = await c.req.json();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });
  if (error) {
    return c.html(
      <div class="mt-10">
        <div role="alert" class="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>
            ログインに失敗しました。メールアドレスまたはパスワードが間違っています。
          </span>
        </div>
        <br />
        <button
          class="btn btn-outline btn-error"
          onclick={
            "location.href=" +
            "'" +
            domain +
            "/login?linkToken=" +
            linkToken +
            "'"
          }
        >
          クリックして再試行
        </button>
      </div>
    );
  }
  const nonce = generateNonce();
  const kv = await Deno.openKv();
  await kv.set([nonce], data.user.id);
  await kv.close();
  return c.html(
    <div class="mt-10">
      <div role="alert" class="alert alert-success">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="stroke-current shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>
          ログインに成功しました。続いて下のボタンから連携を行ってください。
        </span>
      </div>
      <br />
      <button
        class="btn btn-outline btn-success"
        onclick={
          "location.href=" +
          "'" +
          "https://access.line.me/dialog/bot/accountLink?linkToken=" +
          linkToken +
          "&nonce=" +
          nonce +
          "'"
        }
      >
        連携する
      </button>
    </div>
  );
});

auth.post("/signup", async (c) => {
  const { email, password, fullName, fullNameKana, handleName, privacy } =
    await c.req.json<{
      email: string;
      password: string;
      fullName: string;
      fullNameKana: string;
      handleName: string;
      privacy: string;
    }>();
  const { error: signUpError } = await supabase.auth.signUp({
    email: email,
    password: password,
  });
  if (signUpError) {
    return c.text("Failed to signup", 401);
  }
  const entryId = await getNextEntryId();
  if (!entryId) {
    return c.text("Can't get the entry_id", 401);
  }
  const { error: registerInfoError } = await supabase
    .from("profiles")
    .update({
      entry_id: entryId,
      full_name: fullName,
      full_name_kana: fullNameKana,
      handle_name: handleName,
      privacy: privacy,
    })
    .eq("email", email);
  if (registerInfoError) {
    console.log(registerInfoError);
  }
  return c.text("Success to signup", 201);
});

const getNextEntryId = async () => {
  const { data: lastUser } = await supabase
    .from("profiles")
    .select("entry_number")
    .order("entry_number", { ascending: false })
    .limit(1)
    .single<{ entry_number: number }>();
  if (!lastUser) {
    return null;
  }
  return lastUser.entry_number + 1;
};
