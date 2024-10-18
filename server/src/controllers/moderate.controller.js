import { moderateContent } from "../openAi/text.moderate.js";

export async function moderateContentController(req, res) {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: "Nội dung không được để trống." });
  }

  try {
    const moderationResult = await moderateContent(text);
    res.json(moderationResult);
  } catch (error) {
    res.status(500).json({ error: "Có lỗi xảy ra khi kiểm duyệt nội dung." });
  }
}
