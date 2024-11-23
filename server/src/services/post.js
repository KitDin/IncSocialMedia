import { pool } from "../db/db.js";
import {
  getCombinedRecommendations,
  recommendPostsForUser,
} from "../services/recomment.js";

export async function getImgOfPostById(id) {
  try {
    const [images] = await pool.query(
      `SELECT POST_ImgURL FROM __IMGs_POST WHERE POST_Id = ?`,
      [id]
    );

    return images.length > 0 ? images : "";
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function getInforOfReplyCommentById(replyId) {
  try {
    const get = `select CommentReply_Content, p.POST_Id,POST_ImgURL, rc.USER_Id, USER_NickName ,
                USER_AvatarURL from __replycomment rc join __IMGs_POST p on rc.post_id = p.post_id 
								join __user_infor ui on rc.user_id = ui.user_id where commentreply_id = ?;`;
    const [query] = await pool.query(get, [replyId]);
    return query.length > 0 ? query : "";
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function getInfoCommentById(commentId) {
  try {
    const get = `select c.COMMENT_Content, c.POST_Id , ui.USER_NickName,
    ui.USER_AvatarURL,UI.USER_Id from __comments c join __user_infor ui on 
    c.user_id = ui.user_id where comment_id =? ;`;
    const [query] = await pool.query(get, commentId);
    return query.length > 0 ? query : "";
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function APost(id) {
  const [rows] = await pool.query(
    "SELECT * FROM __POSTs p join __USER_Infor u on p.USER_Id = u.USER_Id WHERE POST_Id=?",
    [id]
  );
  const postFull = [];
  const [images] = await pool.query(
    `SELECT POST_ImgURL FROM __IMGs_POST WHERE POST_Id = ?`,
    [id]
  );
  const hashtag = await getHashTagsOfPost(id);
  const [likes] = await pool.query("select * from __likes where POST_Id = ?", [
    id,
  ]);

  const [countComment] = await pool.query(
    `SELECT SUM(comment_count) AS total_count
FROM (
    SELECT COUNT(*) AS comment_count
    FROM __comments
    WHERE post_id = ?
    UNION ALL
    SELECT COUNT(*) AS comment_count
    FROM __replyComment
    WHERE post_id = ?
) AS combined_counts;`,
    [id, id]
  );
  const postWithImages = {
    content: {
      POST_Id: rows[0].POST_Id,
      POST_Content: rows[0].POST_Content,
      POST_AccessModifies: rows[0].POST_AccessModifies,
      POST_Time: rows[0].POST_Time,
      USER_Id: rows[0].USER_Id,
      USER_FirstName: rows[0].USER_FirstName,
      USER_SubName: rows[0].USER_SubName,
      USER_NickName: rows[0].USER_NickName,
      USER_AvatarURL: rows[0].USER_AvatarURL,
    },
    images: images.map((image) => image.POST_ImgURL),
    likes: likes.map((like) => like.USER_id),
    countLike: likes.length,
    countComment: countComment[0].total_count,
    hashtag,
  };

  postFull.push(postWithImages);
  return postFull;
}

export async function postStatusImg(postId, img) {
  const [row] = await pool.query(
    `
  insert into  __IMGs_POST ( POST_Id , POST_ImgURL ) value (?,?);
  `,
    [postId, img]
  );
}

export async function postHashtag(postId, hashtag) {
  const [row] = await pool.query(
    `
  insert into  __POST_TOPICS (POST_ID , hashtag_id) value (?,?);
  `,
    [postId, hashtag]
  );
}

export async function postStatusContent(postId, userId, content, modifie) {
  await pool.query(
    `insert into __POSTs(POST_Id,USER_id,POST_Content,POST_AccessModifies, POST_Time) 
values (?,?,?,?,now());`,
    [postId, userId, content, modifie]
  );
}

export async function getPost(id) {
  const [rows] = await pool.query(
    `SELECT POST_Id,POST_Content,POST_AccessModifies,POST_Time,p.USER_Id,USER_FirstName,USER_SubName,USER_NickName,USER_AvatarURL
      FROM __POSTs p join __USER_Infor ui 
      on p.user_id = ui.user_id where ui.user_id= ? order by post_time desc;`,
    [id]
  );
  const postFull = [];
  for (let index = 0; index < rows.length; index++) {
    const post = rows[index];
    const [images] = await pool.query(
      `SELECT POST_ImgURL FROM __IMGs_POST WHERE POST_Id = ?`,
      [post.POST_Id]
    );
    const [countComment] = await pool.query(
      `SELECT SUM(comment_count) AS total_count
FROM (
    SELECT COUNT(*) AS comment_count
    FROM __comments
    WHERE post_id = ?
    UNION ALL
    SELECT COUNT(*) AS comment_count
    FROM __replyComment
    WHERE post_id = ?
) AS combined_counts;`,
      [post.POST_Id, post.POST_Id]
    );
    const [likes] = await pool.query(
      "select * from __likes where POST_id = ?",
      [post.POST_Id]
    );

    const hashtag = await getHashTagsOfPost(post.POST_Id);

    const postWithImages = {
      content: post,
      images: images.map((image) => image.POST_ImgURL),
      hashtag,
      likes: likes.map((like) => like.USER_id),
      countLike: likes.length,
      countComment: countComment[0].total_count,
    };
    postFull.push(postWithImages);
  }

  return postFull;
}

// export async function getPosts(userId, page = 1, limit = 5) {
//   // Bước 1: Gọi recommendPostsForUser để lấy danh sách các bài đăng gợi ý cho userId
//   const recommendedPostIds = await recommendPostsForUser(userId);

//   // Nếu không có bài đăng gợi ý, trả về danh sách trống
//   if (recommendedPostIds.length === 0) {
//     return [];
//   }
//   const offset = (page - 1) * limit;
//   // Bước 2: Lấy thông tin chi tiết cho các bài đăng được gợi ý
//   const [rows] = await pool.query(
//     `SELECT POST_Id, POST_Content, POST_AccessModifies, POST_Time, p.USER_Id, USER_FirstName, USER_SubName, USER_NickName, USER_AvatarURL
//       FROM __POSTs p
//       JOIN __USER_Infor ui ON p.USER_Id = ui.USER_Id
//       WHERE p.POST_Id IN (?)
//       ORDER BY POST_Time DESC
//       LIMIT ? OFFSET ?;`,
//     [recommendedPostIds, limit, offset]
//   );

//   const postFull = [];
//   for (let index = 0; index < rows.length; index++) {
//     const post = rows[index];

//     // Đếm tổng số bình luận và trả lời cho bài đăng
//     const [countComment] = await pool.query(
//       `SELECT SUM(comment_count) AS total_count
//       FROM (
//           SELECT COUNT(*) AS comment_count
//           FROM __COMMENTS
//           WHERE POST_ID = ?
//           UNION ALL
//           SELECT COUNT(*) AS comment_count
//           FROM __REPLYCOMMENT
//           WHERE POST_ID = ?
//       ) AS combined_counts;`,
//       [post.POST_Id, post.POST_Id]
//     );

//     // Lấy ảnh cho bài đăng
//     const [images] = await pool.query(
//       `SELECT POST_ImgURL FROM __IMGS_POST WHERE POST_ID = ?`,
//       [post.POST_Id]
//     );

//     // Lấy lượt thích cho bài đăng
//     const [likes] = await pool.query(
//       "SELECT USER_ID FROM __LIKES WHERE POST_ID = ?",
//       [post.POST_Id]
//     );

//     // Lấy hashtag cho bài đăng
//     const hashtag = await getHashTagsOfPost(post.POST_Id);

//     // Đưa tất cả thông tin vào đối tượng post
//     const postWithImages = {
//       content: post,
//       images: images.map((image) => image.POST_ImgURL),
//       hashtag,
//       likes: likes.map((like) => like.USER_ID),
//       countLike: likes.length,
//       countComment: countComment[0].total_count,
//     };
//     postFull.push(postWithImages);
//   }

//   return postFull;
// }

export async function getPosts(
  userId,
  page = 1,
  limit = 5,
  displayedPostIds = []
) {
  //  Lấy danh sách bài đăng gợi ý
  const recommendedPostIds = await getCombinedRecommendations(userId);
  const offset = (page - 1) * limit;

  // Danh sách bài đầy đủ sẽ trả về
  const postFull = [];

  // Lấy bài gợi ý (nếu có)
  if (offset < recommendedPostIds.length) {
    const suggestedEnd = Math.min(offset + limit, recommendedPostIds.length);
    const suggestedPosts = await fetchPostDetails(
      recommendedPostIds.slice(offset, suggestedEnd)
    );
    postFull.push(...suggestedPosts);

    // Nếu đã lấy đủ bài từ gợi ý, trả về luôn
    if (postFull.length === limit) {
      return postFull;
    }
  }

  // Lấy bài ngẫu nhiên nếu bài gợi ý không đủ
  const remainingLimit = limit - postFull.length;
  const randomOffset = Math.max(0, offset - recommendedPostIds.length); // Offset ngẫu nhiên

  const randomPosts = await fetchRandomPosts(
    userId,
    remainingLimit,
    randomOffset,
    displayedPostIds
  );

  // Loại trừ bài trùng lặp và ghép vào danh sách
  const uniquePosts = randomPosts.filter(
    (post) => !postFull.some((p) => p.content.POST_Id === post.content.POST_Id)
  );

  postFull.push(...uniquePosts);

  return postFull;
}

// Hàm lấy chi tiết bài đăng (từ danh sách ID)
async function fetchPostDetails(postIds) {
  if (!postIds || postIds.length === 0) {
    return [];
  }
  const [rows] = await pool.query(
    `SELECT POST_Id, POST_Content, POST_AccessModifies, POST_Time, p.USER_Id, USER_FirstName, USER_SubName, USER_NickName, USER_AvatarURL
     FROM __POSTs p
     JOIN __USER_Infor ui ON p.USER_Id = ui.USER_Id
     WHERE p.POST_Id IN (?)
     ORDER BY POST_Time DESC`,
    [postIds]
  );

  return Promise.all(
    rows.map(async (post) => {
      // Đếm bình luận
      const [countComment] = await pool.query(
        `SELECT SUM(comment_count) AS total_count
         FROM (
             SELECT COUNT(*) AS comment_count
             FROM __COMMENTS WHERE POST_ID = ?
             UNION ALL
             SELECT COUNT(*) AS comment_count
             FROM __REPLYCOMMENT WHERE POST_ID = ?
         ) AS combined_counts;`,
        [post.POST_Id, post.POST_Id]
      );

      // Lấy ảnh
      const [images] = await pool.query(
        `SELECT POST_ImgURL FROM __IMGS_POST WHERE POST_ID = ?`,
        [post.POST_Id]
      );

      // Lấy lượt thích
      const [likes] = await pool.query(
        "SELECT USER_ID FROM __LIKES WHERE POST_ID = ?",
        [post.POST_Id]
      );

      // Lấy hashtag
      const hashtag = await getHashTagsOfPost(post.POST_Id);

      // Kết hợp tất cả dữ liệu
      return {
        content: post,
        images: images.map((image) => image.POST_ImgURL),
        hashtag,
        likes: likes.map((like) => like.USER_ID),
        countLike: likes.length,
        countComment: countComment[0]?.total_count || 0,
      };
    })
  );
}

async function fetchRandomPosts(userId, limit, offset, excludePostIds = []) {
  // Xây dựng câu điều kiện loại trừ bài viết
  const excludeClause = excludePostIds.length
    ? `AND p.POST_Id NOT IN (${excludePostIds.map(() => "?").join(",")})`
    : "";

  // Thêm điều kiện loại trừ bài đăng của chính người dùng vào câu truy vấn
  const query = `
    SELECT POST_Id, POST_Content, POST_AccessModifies, POST_Time, p.USER_Id, USER_FirstName, USER_SubName, USER_NickName, USER_AvatarURL
    FROM __POSTs p
    JOIN __USER_Infor ui ON p.USER_Id = ui.USER_Id
    WHERE p.POST_Id NOT IN (
        SELECT POST_ID FROM __LIKES WHERE USER_ID = ? 
        UNION 
        SELECT POST_ID FROM __COMMENTS WHERE USER_ID = ?
    )
    AND p.USER_Id != ? 
    ${excludeClause}
    ORDER BY RAND()
    LIMIT ? OFFSET ?;
  `;

  // Tạo danh sách tham số cho câu truy vấn
  const params = [userId, userId, userId, ...excludePostIds, limit, offset];

  // Thực hiện truy vấn
  const [rows] = await pool.query(query, params);

  // Lấy thông tin chi tiết cho bài đăng
  return fetchPostDetails(rows.map((row) => row.POST_Id));
}
// export async function getPosts() {
//   const [rows] = await pool.query(
//     `SELECT POST_Id,POST_Content,POST_AccessModifies,POST_Time,p.USER_Id,USER_FirstName,USER_SubName,USER_NickName,USER_AvatarURL
//       FROM __POSTs p join __USER_Infor ui
//       on p.user_id = ui.user_id order by post_time desc;`
//   );
//   const postFull = [];
//   for (let index = 0; index < rows.length; index++) {
//     const post = rows[index];
//     const [countComment] = await pool.query(
//       `SELECT SUM(comment_count) AS total_count
// FROM (
//     SELECT COUNT(*) AS comment_count
//     FROM __comments
//     WHERE post_id = ?
//     UNION ALL
//     SELECT COUNT(*) AS comment_count
//     FROM __replyComment
//     WHERE post_id = ?
// ) AS combined_counts;`,
//       [post.POST_Id, post.POST_Id]
//     );
//     const [images] = await pool.query(
//       `SELECT POST_ImgURL FROM __IMGs_POST WHERE POST_Id = ?`,
//       [post.POST_Id]
//     );

//     const [likes] = await pool.query(
//       "select * from __likes where POST_id = ?",
//       [post.POST_Id]
//     );
//     const hashtag = await getHashTagsOfPost(post.POST_Id);

//     const postWithImages = {
//       content: post,
//       images: images.map((image) => image.POST_ImgURL),
//       hashtag,
//       likes: likes.map((like) => like.USER_id),
//       countLike: likes.length,
//       countComment: countComment[0].total_count,
//     };
//     postFull.push(postWithImages);
//   }
//   return postFull;
// }

export async function like(userId, postId) {
  try {
    const [check] = await pool.query(
      `insert into __likes(USER_id,POST_id) values (?,?)`,
      [userId, postId]
    );
    return check.affectedRows > 0;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function unlike(userId, postId) {
  try {
    const [check] = await pool.query(
      `
    delete from __likes 
    where user_id = ? 
    and post_id=?;
    `,
      [userId, postId]
    );
    return check.affectedRows > 0;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function createComment(
  comment_id,
  POST_id,
  USER_id,
  comment_Content
) {
  try {
    await pool.query(
      `insert into __comments (comment_id,POST_id,USER_id,comment_Content,comment_Time) 
      values (?,?,?,?,now());`,
      [comment_id, POST_id, USER_id, comment_Content]
    );
    return true;
  } catch (error) {
    return false;
  }
}

export async function getCommentInAPost(POST_id) {
  try {
    const [row] = await pool.query(
      `
   select * from __comments cm join __user_infor ui on cm.user_id = ui.user_id where POST_id=? order by comment_Time desc;
    `,
      [POST_id]
    );
    return row;
  } catch (error) {
    console.error(error);
  }
}

export async function getReplyComment(POST_id, comment_id) {
  try {
    const [rows] = await pool.query(
      `select * from __replyComment rc left join  __user_infor ui on rc.user_id = ui.user_id where replyComment =? and post_id=? ORDER BY CommentReply_Time desc;`,
      [comment_id, POST_id]
    );
    return rows;
  } catch (error) {
    console.error(error);
  }
}

export async function postReplyComments(
  POST_id,
  replyComment,
  USER_id,
  USER_id_reply_to,
  CommentReply_id,
  CommentReply_Content
) {
  try {
    await pool.query(`insert into __replyComment values(?,?,?,?,?,?,now());`, [
      POST_id,
      replyComment,
      USER_id,
      USER_id_reply_to,
      CommentReply_id,
      CommentReply_Content,
    ]);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
async function countComment(post_id) {
  try {
    const [count] = await pool.query(
      `SELECT SUM(comment_count) AS total_count
FROM (
    SELECT COUNT(*) AS comment_count
    FROM __comments
    WHERE post_id = ?
    UNION ALL
    SELECT COUNT(*) AS comment_count
    FROM __replyComment
    WHERE post_id = ?
) AS combined_counts;`,
      [post_id, post_id]
    );
    return count;
  } catch (error) {
    console.error(error);
  }
}

export const getHashTagsOfPost = async (postId) => {
  const query = `SELECT 
                  ht.hashtag_id, 
                  ht.hashtag_name
                FROM __POST_TOPICS pt JOIN __HASHTAGS ht on pt.hashtag_id = ht.hashtag_id 
                where post_id = ? ;`;
  try {
    const [getHastTagByPost] = await pool.query(query, [postId]);
    return getHastTagByPost.length > 0 ? getHastTagByPost : [];
  } catch (error) {
    console.error(error);
  }
};
