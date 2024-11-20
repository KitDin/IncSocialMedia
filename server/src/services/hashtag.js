import { pool } from "../db/db.js";

export async function getHashtagById(idHashtag) {
  const query = `SELECT
      hashtag_id, 
      hashtag_name, 
      created_at, 
      post_count, 
      is_trending
    FROM __HASHTAGS
    WHERE hashtag_id = ?`;

  try {
    const [rows] = await pool.query(query, [idHashtag]); // Await the query and use array destructuring
    return rows.length > 0 ? rows[0] : null; // Return the first row or null if no result found
  } catch (error) {
    console.error("Error fetching hashtag by ID:", error);
    return null; // Return null if there's an error
  }
}

export async function getHashtags(searchQuery, limit, offset) {
  try {
    // Câu truy vấn cơ bản để lấy thông tin hashtags
    let query = `
    SELECT 
      hashtag_id, 
      hashtag_name, 
      created_at, 
      post_count, 
      is_trending
    FROM __HASHTAGS
    WHERE 1 = 1`;

    // Mảng để lưu tham số truyền vào cho câu truy vấn
    const params = [];

    // Kiểm tra `searchQuery` và thêm vào điều kiện tìm kiếm nếu có
    if (searchQuery) {
      query += ` AND LOWER(TRIM(hashtag_name)) LIKE ?`;
      const searchPattern = `%${searchQuery.trim().toLowerCase()}%`;
      params.push(searchPattern);
    }

    // Thêm câu lệnh sắp xếp và phân trang
    query += ` ORDER BY post_count DESC, created_at DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    // Thực thi câu truy vấn và trả về danh sách hashtag
    const [hashtags] = await pool.query(query, params);
    return hashtags;
  } catch (error) {
    console.error(error);
  }
}
