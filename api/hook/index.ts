import { Hono } from "hono";
import { hmac } from "../hmac.ts";
import { replyMessage } from "../reply.ts";
import { supabase } from "../supabaseClient.ts";
import {
  AccountLinkEvent,
  MessageEvent,
  TemplateMessage,
  TextMessage,
  Webhook,
  WebhookEvent,
} from "../types.ts";
import { checkLinked, createLinkButton, issueLinkToken } from "./link.ts";
import { composeUserInfo, getUserInfo } from "./user.ts";

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
    if (messageEvent.source === undefined) continue;
    const userId = messageEvent.source.userId;
    if (userId === undefined) continue;
    const message = messageEvent.message.text;
    if (message == "#アカウント連携") {
      if (await checkLinked(userId)) {
        const data: TemplateMessage = {
          "type": "template",
          "altText": "Account Link",
          "template": {
            "type": "buttons",
            "text": "すでに連携済みです。連携を解除しますか？",
            "actions": [{
              "type": "message",
              "label": "解除する",
              "text": "#アカウント連携解除",
            }],
          },
        };
        await replyMessage(CHANNEL_ACCESS_TOKEN!, messageEvent.replyToken, [
          data,
        ]);
        continue;
      }
      const linkToken = await issueLinkToken(
        CHANNEL_ACCESS_TOKEN!,
        messageEvent.source!.userId!,
      );
      const buttonMessage = createLinkButton(c.req.url, linkToken);
      await replyMessage(
        CHANNEL_ACCESS_TOKEN!,
        messageEvent.replyToken,
        [buttonMessage],
      );
    }
    if (message == "#アカウント連携解除") {
      await supabase.from("profiles").update({ line_id: null }).eq(
        "line_id",
        userId,
      );
      const data: TextMessage = {
        type: "text",
        text:
          "連携を解除しました。再度連携する場合は画面下部のメニューをタップしてください。",
      };
      await replyMessage(CHANNEL_ACCESS_TOKEN!, messageEvent.replyToken, [
        data,
      ]);
    }
    if (message == "#エントリー情報") {
      if (!await checkLinked(userId)) {
        const data: TextMessage = {
          type: "text",
          text: "まずはアカウント連携を行ってください。",
        };
        await replyMessage(CHANNEL_ACCESS_TOKEN!, messageEvent.replyToken, [
          data,
        ]);
        continue;
      }
      const userInfo = await getUserInfo(userId);
      if (!userInfo) continue;
      await replyMessage(CHANNEL_ACCESS_TOKEN!, messageEvent.replyToken, [
        composeUserInfo(userInfo),
      ]);
    }
  }
  for (const accountLinkEvent of accountLinkEvents) {
    if (accountLinkEvent.link.result !== "ok") continue;
    const nonce = accountLinkEvent.link.nonce;
    const lineId = accountLinkEvent.source?.userId;
    const kv = await Deno.openKv();
    const result = await kv.get<string>([nonce]);
    const userId = result.value;
    if (!userId) continue;
    await kv.close();
    const { error } = await supabase.from("profiles").update({
      line_id: lineId,
    }).eq("id", userId);
    if (error) {
      console.log(error);
      continue;
    }
    const data: TextMessage = { type: "text", text: "連携が完了しました。" };
    await replyMessage(CHANNEL_ACCESS_TOKEN!, accountLinkEvent.replyToken, [
      data,
    ]);
  }
});
