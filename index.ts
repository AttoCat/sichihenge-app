import { Hono } from "hono";
import { api } from "./api/index.ts";
import { login } from "./src/Login.tsx";

const app = new Hono();

app.route("/login", login);
app.route("/api", api);

export default app;

Deno.serve(app.fetch);
