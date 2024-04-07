import { Hono } from "hono";
import { hmac } from "../hmac.ts";
import { replyMessage } from "../reply.ts";
import { supabase } from "../supabaseClient.ts";
import {
  AccountLinkEvent,
  MessageEvent,
  Webhook,
  WebhookEvent,
} from "../types.ts";
import { createLinkButton, issueLinkToken } from "./link.ts";

export const hook = new Hono();
const CHANNEL_SECRET = Deno.env.get("CHANNEL_SECRET");
const CHANNEL_ACCESS_TOKEN = Deno.env.get("CHANNEL_ACCESS_TOKEN");

const isMessageEvent = (event: WebhookEvent): event is MessageEvent =>
  event.type === "message";

const isAccountLinkEvent = (event: WebhookEvent): event is AccountLinkEvent =>
  event.type === "accountLink";

hook.post("*", async (c) => {
  const body = await c.req.json<Webhook>();
  const digest = await hmac(CHANNEL_SECRET!, JSON.stringify(body));
  const signature = c.req.header("x-line-signature");
  if (digest !== signature) {
    return c.text("Bad Request", 400);
  }
  const events = body.events;
  const messageEvents = events.filter(isMessageEvent);
  const accountLinkEvents = events.filter(isAccountLinkEvent);
  for (const messageEvent of messageEvents) {
    if (messageEvent.message.type !== "text") continue;
    const message = messageEvent.message.text;
    if (message == "#アカウント連携") {
      console.log("Success");
      const linkToken = await issueLinkToken(
        CHANNEL_ACCESS_TOKEN!,
        messageEvent.source!.userId!,
      );
      const buttonMessage = createLinkButton(c.req.url, linkToken);
      console.log(buttonMessage);
      await replyMessage(
        CHANNEL_ACCESS_TOKEN!,
        messageEvent.replyToken,
        [buttonMessage],
      );
    }
  }
  for (const accountLinkEvent of accountLinkEvents) {
    if (accountLinkEvent.link.result !== "ok") continue;
    const nonce = accountLinkEvent.link.nonce;
    const lineId = accountLinkEvent.source?.userId;
    console.log(lineId);
    const kv = await Deno.openKv();
    const userId = await kv.get([nonce]);
    console.log(userId);
    await kv.close();
    const { data, error } = await supabase.from("profiles").update({
      line_id: lineId,
    }).eq("id", userId);
    console.log(error);
  }
});
