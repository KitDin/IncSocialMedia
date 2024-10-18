import { openai } from "../openAi/openAi.js";
const openAi = openai;

export async function moderateContent(text) {
  try {
    const response = await openAi.moderations.create({
      input: text,
    });
    return response;
  } catch (error) {
    console.error("Error moderating content:", error);
    throw error;
  }
}
