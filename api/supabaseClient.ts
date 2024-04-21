import { createClient } from "supabase";
import { Database } from "./supabase.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") as string;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
