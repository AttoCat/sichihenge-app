import { Hono } from "hono";
import { Layout } from "./Layout.tsx";
export const link = new Hono();

link.get("/", (c) => {
  const domain = new URL(c.req.url).origin;
  const postUrl = domain+"/api/auth/link"
  const linkToken = c.req.query("linkToken");
  if (!linkToken) {
    return c.text("正しいURLでアクセスしてください", 401);
  }
  return c.html(
    <Layout title="ログイン">
      <div class="relative flex flex-col justify-center h-screen overflow-hidden">
        <div class="w-full p-6 m-auto bg-white rounded-md shadow-md lg:max-w-lg">
          <h1 class="text-3xl font-semibold text-center text-purple-700">
            ログイン
          </h1>
          <form
            class="space-y-4"
            id="login"
            hx-post={postUrl}
            hx-target="this"
            hx-swap="outerHTML"
            hx-trigger="submit"
            hx-ext='json-enc'
          >
            <div>
              <label class="label">
                <span class="text-base label-text">Email</span>
              </label>
              <fieldset>
                <input
                  type="email"
                  name="email"
                  placeholder="メールアドレス"
                  class="w-full input input-bordered input-primary"
                  required
                />
              </fieldset>
            </div>
            <div>
              <label class="label">
                <span class="text-base label-text">Password</span>
              </label>
              <fieldset>
                <input
                  type="password"
                  name="password"
                  placeholder="パスワード"
                  class="w-full input input-bordered input-primary"
                  required
                />
              </fieldset>
            </div>
            <input type="hidden" name="linkToken" value={linkToken}/>
            <div>
              <button class="btn btn-block" id="submit-button" type="submit">Login</button>
            </div>
            <div class="htmx-indicator loader"></div>
          </form>
        </div>
      </div>
    </Layout>
  );
});
