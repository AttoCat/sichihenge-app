import ky from "https://esm.sh/ky";
import { supabase } from "../supabaseClient.ts";
import { TemplateMessage } from "../types.ts";
type url = string;
type linkTokenObject = {
  "linkToken": string;
};

export const checkLinked = async (userId: string) => {
  const { data } = await supabase.from("profiles").select("line_id").eq(
    "line_id",
    userId,
  );
  console.log(data);
  return data != null;
};

export const issueLinkToken = async (
  channelAccessToken: string,
  userId: string,
) => {
  const body = {
    headers: {
      "Authorization": `Bearer ${channelAccessToken}`,
    },
  };
  const response = await ky.post(
    `https://api.line.me/v2/bot/user/${userId}/linkToken`,
    body,
  );
  const data = await response.json<linkTokenObject>();
  return data.linkToken;
};

export const createLinkButton = (
  baseUrl: string,
  linkToken: string,
): TemplateMessage => {
  const domain = new URL(baseUrl).origin;
  return {
    "type": "template",
    "altText": "Account Link",
    "template": {
      "type": "buttons",
      "text": "アカウントを連携する",
      "actions": [{
        "type": "uri",
        "label": "Account Link",
        "uri": `${domain}/login?linkToken=${linkToken}`,
      }],
    },
  };
};
