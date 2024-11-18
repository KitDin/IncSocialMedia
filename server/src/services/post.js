import { pool } from "../db/db.js";

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

export async function getPosts() {
  const [rows] = await pool.query(
    `SELECT POST_Id,POST_Content,POST_AccessModifies,POST_Time,p.USER_Id,USER_FirstName,USER_SubName,USER_NickName,USER_AvatarURL
      FROM __POSTs p join __USER_Infor ui 
      on p.user_id = ui.user_id order by post_time desc;`
  );
  const postFull = [];
  for (let index = 0; index < rows.length; index++) {
    const post = rows[index];
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
    const [images] = await pool.query(
      `SELECT POST_ImgURL FROM __IMGs_POST WHERE POST_Id = ?`,
      [post.POST_Id]
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

export async function like(userId, postId) {
  try {
    await pool.query(`insert into __likes(USER_id,POST_id) values (?,?)`, [
      userId,
      postId,
    ]);
    return true;
  } catch (error) {
    return false;
  }
}

export async function unlike(userId, postId) {
  try {
    await pool.query(
      `
    delete from __likes 
    where user_id = ? 
    and post_id=?;
    `,
      [userId, postId]
    );
    return true;
  } catch (error) {
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
