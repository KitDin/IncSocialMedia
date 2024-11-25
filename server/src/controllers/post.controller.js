import {
  postStatusImg,
  postStatusContent,
  getPost,
  getPosts,
  like,
  unlike,
  APost,
  createComment,
  getCommentInAPost,
  getReplyComment,
  postReplyComments,
  postHashtag,
  getCommentPostById,
} from "../services/post.js";

import { getUserById } from "../services/user.js";

export async function postStatus(req, res) {
  const files = req.files.map((file) => file.filename);
  const { POST_Id, USER_Id, POST_Content, POST_AccessModifies, HashTags } =
    req.body;

  try {
    await postStatusContent(
      POST_Id,
      USER_Id,
      POST_Content,
      POST_AccessModifies
    );

    for (let index = 0; index < files.length; index++) {
      await postStatusImg(POST_Id, files[index]);
    }
    const HashTagsOb = JSON.parse(HashTags);

    if (HashTagsOb.length !== 0)
      for (let index = 0; index < HashTagsOb.length; index++) {
        await postHashtag(POST_Id, HashTagsOb[index].hashtag_id);
        console.log(HashTagsOb[index].hashtag_id);
      }

    res.json({
      status: true,
      message: "Thành công",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      error: "Internal Server Error",
    });
    console.error(error);
  }
}

export async function getPostOfUser(req, res) {
  const id = req.params.id;
  try {
    const post = await getPost(id);
    res.json(post);
  } catch (error) {
    console.error("Error getting comments:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function getPostsOfUsers(req, res) {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const displayedPostIds = req.query.displayedPostIds || [];
    const post = await getPosts(id, page, limit, displayedPostIds);
    res.json(post);
  } catch (error) {
    console.error("Error getting comments:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function likePost(req, res) {
  try {
    const id = req.user.USER_Id;
    const { POST_Id } = req.body;
    const check = await like(id, POST_Id);
    if (check) {
      return res.json({
        status: true,
      });
    } else {
      return res.json({
        status: false,
      });
    }
  } catch (error) {
    console.error("Error getting comments:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function unlikePost(req, res) {
  try {
    const id = req.user.USER_Id;
    const { POST_Id } = req.body;
    const check = await unlike(id, POST_Id);
    console.log(check);
    if (check) {
      return res.json({
        status: true,
      });
    } else {
      return res.json({
        status: false,
      });
    }
  } catch (error) {
    console.error("Error getting comments:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function getAPost(req, res) {
  try {
    const idpost = req.params.idpost;
    const post = await APost(idpost);
    return res.json(post);
  } catch (error) {}
}

export async function postComment(req, res) {
  try {
    const { comment_id, POST_id, USER_id, comment_Content } = req.body;
    const post = await createComment(
      comment_id,
      POST_id,
      USER_id,
      comment_Content
    );
    if (post) {
      res.json({
        status: "success",
      });
    } else {
      res.json({
        status: "failure",
      });
    }
  } catch (error) {
    console.error("Error getting comments:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// export async function getComments(req, res) {
//   try {
//     const POST_id = req.params.idpost;
//     const comments = await getCommentInAPost(POST_id);
//     const fullComment = [];

//     for (let commentIndex = 0; commentIndex < comments.length; commentIndex++) {
//       const comment = comments[commentIndex];
//       const reply = await getReplyComment(comment.POST_id, comment.comment_id);
//       const reply_to_full = [];

//       for (let replyIndex = 0; replyIndex < reply.length; replyIndex++) {
//         const reply_to = reply[replyIndex];
//         const reply_to_user = await getUserById(reply_to.USER_id_reply_to);
//         const reply_to_InforUser = {
//           ...reply_to,
//           reply_to: reply_to_user,
//         };
//         reply_to_full.push(reply_to_InforUser);
//       }

//       const commentWithReply = {
//         comment: comment,
//         reply: reply_to_full,
//         isShowView: false,
//       };
//       fullComment.push(commentWithReply);
//     }
//     res.json(fullComment);
//   } catch (error) {
//     console.error("Error getting comments:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// }

export async function getComments(req, res) {
  try {
    const POST_id = req.params.idpost;

    const fullComment = await getCommentPostById(POST_id);

    res.json(fullComment);
  } catch (error) {
    console.error("Error getting comments:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function postReplyComment(req, res) {
  try {
    const {
      POST_id,
      replyComment,
      USER_id,
      USER_id_reply_to,
      CommentReply_id,
      CommentReply_Content,
    } = req.body;
    const check = await postReplyComments(
      POST_id,
      replyComment,
      USER_id,
      USER_id_reply_to,
      CommentReply_id,
      CommentReply_Content
    );

    if (check) {
      res.json({
        status: "success",
      });
    } else {
      res.json({
        status: "failure",
      });
    }
  } catch (error) {
    console.error("Error getting comments:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
