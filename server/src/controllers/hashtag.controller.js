import { getHashtagById, getHashtags } from "../services/hashtag.js";
import { generateHashtagRecommendationsForUser } from "../services/recomment.js";

export const getHashtagByNameController = async (req, res) => {
  try {
    // const { id } = req.params || -1;
    const page = parseInt(req.query.page) || 1; // Current page, default is 1
    const limit = parseInt(req.query.limit) || 4; // Number of friends per page
    const offset = (page - 1) * limit;
    const searchQuery = req.query.search || "";
    const result = await getHashtags(searchQuery, limit, offset);
    res.status(200).json({ status: true, hashtag: result });
  } catch (error) {
    res.status(500).json({ status: false, hashtag: result });
    console.error(error);
  }
};

export const getHashtagRecommendForAUser = async (req, res) => {
  try {
    const { id } = req.params;
    const getRecommendHashtags = await generateHashtagRecommendationsForUser(
      id
    );
    const fullTag = [];
    for (let i = 0; i < 4; i++) {
      const hashtag = await getHashtagById(getRecommendHashtags[i]);
      fullTag.push(hashtag);
    }
    res.json(fullTag);
  } catch (error) {}
};
