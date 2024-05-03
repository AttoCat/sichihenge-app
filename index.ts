import { Hono } from "hono";
import { api } from "./api/index.ts";
import { link } from "./src/Link.tsx";

const app = new Hono();

app.route("/link", link);
app.route("/api", api);

export default app;

Deno.serve(app.fetch);
