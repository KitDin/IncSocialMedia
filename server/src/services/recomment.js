import { pool } from "../db/db.js";

async function getUserHashtagInteractions() {
  // Lấy tất cả các tương tác "like" của người dùng với bài đăng có hashtag
  const [likes] = await pool.query(`
        SELECT l.USER_ID, pt.HASHTAG_ID
        FROM __LIKES l
        JOIN __POST_TOPICS pt ON l.POST_ID = pt.POST_ID
    `);

  // Lấy tất cả các bình luận của người dùng với bài đăng có hashtag
  const [comments] = await pool.query(`
        SELECT c.USER_ID, pt.HASHTAG_ID
        FROM __COMMENTS c
        JOIN __POST_TOPICS pt ON c.POST_ID = pt.POST_ID
    `);

  // Gom dữ liệu vào một đối tượng chứa số lần tương tác của mỗi người dùng với mỗi hashtag
  const userHashtagInteractions = {};

  // Đếm lượt thích cho mỗi hashtag
  likes.forEach(({ USER_ID, HASHTAG_ID }) => {
    if (!userHashtagInteractions[USER_ID]) {
      userHashtagInteractions[USER_ID] = {};
    }
    userHashtagInteractions[USER_ID][HASHTAG_ID] =
      (userHashtagInteractions[USER_ID][HASHTAG_ID] || 0) + 1;
  });

  // Đếm lượt bình luận cho mỗi hashtag
  comments.forEach(({ USER_ID, HASHTAG_ID }) => {
    if (!userHashtagInteractions[USER_ID]) {
      userHashtagInteractions[USER_ID] = {};
    }
    userHashtagInteractions[USER_ID][HASHTAG_ID] =
      (userHashtagInteractions[USER_ID][HASHTAG_ID] || 0) + 1;
  });

  return userHashtagInteractions;
}

function buildUserHashtagMatrix(interactions) {
  const users = Object.keys(interactions);
  const hashtags = new Set();

  users.forEach((userId) => {
    Object.keys(interactions[userId]).forEach((hashtagId) =>
      hashtags.add(hashtagId)
    );
  });

  const hashtagList = Array.from(hashtags);
  const userHashtagMatrix = {};

  users.forEach((userId) => {
    userHashtagMatrix[userId] = hashtagList.map(
      (hashtagId) => interactions[userId][hashtagId] || 0
    );
  });

  return { userHashtagMatrix, users, hashtagList };
}

function cosineSimilarity(vecA, vecB) {
  const dotProduct = vecA.reduce((sum, val, idx) => sum + val * vecB[idx], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0));
  return magnitudeA && magnitudeB ? dotProduct / (magnitudeA * magnitudeB) : 0;
}

function calculateUserSimilarities(userMatrix, users) {
  const similarities = {};

  users.forEach((userA, i) => {
    similarities[userA] = {};
    users.forEach((userB, j) => {
      if (i !== j) {
        similarities[userA][userB] = cosineSimilarity(
          userMatrix[userA],
          userMatrix[userB]
        );
      }
    });
  });

  return similarities;
}

function recommendHashtagsForUser(
  targetUser,
  interactions,
  similarities,
  topN = 5
) {
  const recommendedHashtags = {};
  const similarUsers = Object.keys(similarities[targetUser]);

  similarUsers.forEach((similarUser) => {
    const similarityScore = similarities[targetUser][similarUser];

    Object.keys(interactions[similarUser] || {}).forEach((hashtag) => {
      if (!interactions[targetUser][hashtag]) {
        recommendedHashtags[hashtag] =
          (recommendedHashtags[hashtag] || 0) + similarityScore;
      }
    });
  });

  return Object.entries(recommendedHashtags)
    .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
    .slice(0, topN)
    .map(([hashtag]) => hashtag);
}

export async function generateHashtagRecommendationsForUser(userId) {
  const interactions = await getUserHashtagInteractions();
  const { userHashtagMatrix, users } = buildUserHashtagMatrix(interactions);
  const similarities = calculateUserSimilarities(userHashtagMatrix, users);
  return recommendHashtagsForUser(userId, interactions, similarities);
}

// Tìm bài đăng gợi ý dựa trên hashtag
async function getPostsByHashtags(hashtags, userId) {
  // Lấy các bài đăng chứa hashtag gợi ý nhưng người dùng chưa tương tác
  const [posts] = await pool.query(
    `
    SELECT DISTINCT pt.POST_ID
    FROM __POST_TOPICS pt
    LEFT JOIN __LIKES l ON pt.POST_ID = l.POST_ID AND l.USER_ID = ?
    LEFT JOIN __COMMENTS c ON pt.POST_ID = c.POST_ID AND c.USER_ID = ?
    WHERE pt.HASHTAG_ID IN (?) AND l.POST_ID IS NULL AND c.POST_ID IS NULL
    ORDER BY pt.POST_ID DESC
    LIMIT 10
  `,
    [userId, userId, hashtags]
  );

  return posts.map((post) => post.POST_ID);
}

// Gợi ý bài đăng dựa trên hashtag
export async function recommendPostsForUser(userId) {
  // Bước 1: Lấy các hashtag gợi ý từ recommendHashtagsForUser
  const interactions = await getUserHashtagInteractions();
  const { userHashtagMatrix, users } = buildUserHashtagMatrix(interactions);
  const similarities = calculateUserSimilarities(userHashtagMatrix, users);
  const recommendedHashtags = recommendHashtagsForUser(
    userId,
    interactions,
    similarities
  );

  // Bước 2: Lấy danh sách bài đăng từ các hashtag gợi ý
  const recommendedPosts = await getPostsByHashtags(
    recommendedHashtags,
    userId
  );

  return recommendedPosts;
}
