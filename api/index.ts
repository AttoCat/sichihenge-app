import { Hono } from "hono";
import { login } from "../src/Login.tsx";
import { auth } from "./auth/index.ts";
import { hook } from "./hook/index.ts";

const app = new Hono();

app.get("*", (c) => c.text("Hello!"));
app.route("/api/hook", hook);
app.route("/api/auth", auth);
app.route("/login", login);

export default app;

Deno.serve(app.fetch);
