import { Hono } from "hono";
import { supabase } from "../supabaseClient.ts";

export const auth = new Hono();

auth.post("/login", async (c) => {
  const { email, password } = await c.req.json();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });
  if (error) {
    return c.json({ message: "Unauthorized" }, 401);
  }
  const response = {
    user: data.user,
  };
});
