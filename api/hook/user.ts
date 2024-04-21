import { Tables } from "../supabase.ts";
import { supabase } from "../supabaseClient.ts";
import { TextMessage } from "../types.ts";

export const getUserInfo = async (
  userId: string,
): Promise<Tables<"profiles"> | null> => {
  const { data } = await supabase.from("profiles").select("*").eq(
    "line_id",
    userId,
  ).single();
  return data;
};

export const composeUserInfo = (user: Tables<"profiles">): TextMessage => {
  const text = `あなたのエントリー情報は以下の通りです。

エントリーナンバー: ${user.entry_number}
名前: ${user.full_name}
ふりがな: ${user.full_name_kana}
ハンドルネーム: ${user.handle_name}
所属教育機関: ${user.school}
本名を使用しない場所: ${user.privacy}

変更を希望する場合、公式Twitter(X)または sichihenge.cup@gmail.com までご連絡ください。

エントリーのキャンセルは以下のフォームからお願いします:
https://forms.gle/SrDiCZchXhxhRGdV9`;
  const message: TextMessage = { "type": "text", text: text };
  return message;
};
