import { LanguageServiceClient } from "@google-cloud/language";

const client = new LanguageServiceClient({
  keyFilename: `./propane-abbey-438806-k9-748055db088e.json`,
});

export const moderateContentController = async (req, res, next) => {
  try {
    const { POST_Content } = req.body;
    if (!POST_Content) {
      return res.json({
        status: false,
        message: "Content not empty!.",
      });
    }

    const document = {
      content: POST_Content,
      type: "PLAIN_TEXT",
    };
    const [result] = await client.analyzeSentiment({ document });
    const sentiment = result.documentSentiment;
    const [entitiesResult] = await client.analyzeEntities({ document });
    const entities = entitiesResult.entities.map((entity) => entity.name);
    // Kiểm tra các chỉ số cảm xúc
    if (sentiment.score < -0.5) {
      // Ví dụ về điều kiện kiểm duyệt
      return res.json({
        status: false,
        message: "This content may be prohibited.",
        score: sentiment.score,
        entities,
      });
    } else {
      next();
    }
  } catch (err) {
    return res.json({
      status: false,
      message: "A content moderation error has occurred.",
      err,
    });
  }
};
