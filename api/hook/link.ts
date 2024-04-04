import ky from "https://esm.sh/ky";
type url = string;
type linkTokenObject = {
  "linkToken": string;
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

export const createLinkButton = (baseUrl: string, linkToken: string) => {
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
        "uri": `${domain}/link?linkToken=${linkToken}`,
      }],
    },
  };
};
