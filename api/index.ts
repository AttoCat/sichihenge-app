import { Hono } from "hono";
import { auth } from "./auth/index.ts";
import { hook } from "./hook/index.ts";

const app = new Hono();

app.get("*", (c) => c.text("Hello!"));
app.route("/api/hook", hook);
app.route("/api/auth", auth);

export default app;

Deno.serve(app.fetch);
