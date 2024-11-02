import { LanguageServiceClient } from "@google-cloud/language";

const client = new LanguageServiceClient({
  keyFilename: `./propane-abbey-438806-k9-748055db088e.json`,
});

// Hàm kiểm duyệt nội dung
// export const moderateContentController = async (req, res) => {
//   try {
//     const { POST_Content } = req.body; // Nhận nội dung văn bản từ request body

//     if (!POST_Content) {
//       return res.status(400).json({ message: "Nội dung không được để trống." });
//     }

//     const document = {
//       content: POST_Content,
//       type: "PLAIN_TEXT",
//     };
//     const [result] = await client.analyzeSentiment({ document });
//     const sentiment = result.documentSentiment;

//     // Kiểm tra các chỉ số cảm xúc
//     if (sentiment.score < -0.5) {
//       // Ví dụ về điều kiện kiểm duyệt
//       return res.status(400).json({
//         message: "Nội dung này có thể bị cấm.",
//         score: sentiment.score,
//       });
//     } else {
//       return res.status(200).json({
//         message: "Nội dung này được chấp nhận.",
//         score: sentiment.score,
//       });
//     }
//   } catch (err) {
//     console.error("Lỗi trong khi phân tích nội dung:", err);
//     return res
//       .status(500)
//       .json({ message: "Đã xảy ra lỗi khi kiểm duyệt nội dung.", err });
//   }
// };

export const moderateContentController = async (req, res) => {
  try {
    const text = req.body.POST_Content;

    if (!text) {
      return res.status(400).json({ message: "Content cannot be empty." });
    }

    const document = {
      content: text,
      type: "PLAIN_TEXT",
    };

    // Analyze sentiment
    const [sentimentResult] = await client.analyzeSentiment({ document });
    const sentiment = sentimentResult.documentSentiment;

    // Analyze entities
    const [entitiesResult] = await client.analyzeEntities({ document });
    const entities = entitiesResult.entities.map((entity) => entity.name); // Get entity names as tags

    // Check sentiment score
    if (sentiment.score < -0.5) {
      return res.status(400).json({
        message: "This content may be prohibited.",
        score: sentiment.score,
        tags: entities, // Return the tags as well
      });
    } else {
      res.status(200).json({
        message: "This content is acceptable.",
        score: sentiment.score,
        tags: entities, // Return the tags
      });
    }
  } catch (err) {
    console.error("Error analyzing content:", err);
    return res
      .status(500)
      .json({ message: "An error occurred during content moderation.", err });
  }
};
