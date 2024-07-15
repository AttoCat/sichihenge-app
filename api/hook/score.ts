import { supabase } from "../supabaseClient.ts";
import { TextMessage } from "../types.ts";

export const getPaperResult = async (entryNumber: number) => {
  const { data } = await supabase.from("paper_results").select("*").match({
    entry_number: entryNumber,
  }).single();
  return data!;
};

export const composePaperResult = (
  paperResult: Awaited<ReturnType<typeof getPaperResult>>,
) => {
  const text = `【成績照会】
No. ${paperResult.entry_number}

得点: ${paperResult.score}点
順位: ${paperResult.rank}位

ぜひ当日配布した「参加者カード」にご記入ください。
ご参加誠にありがとうございました！

※運営の不手際により誤った順位で大会を進行したことを深くお詫び申し上げます。こちらの順位が正しいものです。`;
  const message: TextMessage = { "type": "text", text: text };
  return message;
};
