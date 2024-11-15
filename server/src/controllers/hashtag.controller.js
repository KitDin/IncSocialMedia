import { getHashtags } from "../services/hashtag.js";

export const getHashtagByNameController = async (req, res) => {
  try {
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
