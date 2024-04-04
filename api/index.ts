import { Hono } from "hono";
import { auth } from "./auth/index.tsx";
import { hook } from "./hook/index.ts";

export const api = new Hono();

api.route("/hook", hook);
api.route("/auth", auth);
