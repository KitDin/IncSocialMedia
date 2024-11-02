import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Thay 'YOUR_API_KEY' bằng API key của bạn
});

export async function moderateContent(text) {
  try {
    const moderation = await openai.moderations.create({
      model: "omni-moderation-latest",
      input: text,
    });
    return moderation;
  } catch (error) {
    throw error; // Ném lỗi để controller xử lý
  }
}
