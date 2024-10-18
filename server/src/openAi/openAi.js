import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Thay 'YOUR_API_KEY' bằng API key của bạn
});
