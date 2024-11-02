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
} from "../services/post.js";

import { getUserById } from "../services/user.js";
export async function postStatus(req, res) {
  const files = req.files.map((file) => file.filename);
  const { POST_Id, USER_Id, POST_Content, POST_AccessModifies } = req.body;

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

    res.json({
      status: "sucessfull",
      mess: "Thành công",
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
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
    const post = await getPosts();
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
        status: "successful",
        req: req.body,
      });
    } else {
      return res.json({
        status: "fall",
        req: req.body,
        check: check,
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
    if (check) {
      return res.json({
        status: "successful unlike",
        req: req.body,
      });
    } else {
      return res.json({
        status: "failure unliek",
        req: req.body,
        check: check,
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

export async function getComments(req, res) {
  try {
    const POST_id = req.params.idpost;
    const comments = await getCommentInAPost(POST_id);
    const fullComment = [];

    for (let commentIndex = 0; commentIndex < comments.length; commentIndex++) {
      const comment = comments[commentIndex];
      const reply = await getReplyComment(comment.POST_id, comment.comment_id);
      const reply_to_full = [];

      for (let replyIndex = 0; replyIndex < reply.length; replyIndex++) {
        const reply_to = reply[replyIndex];
        const reply_to_user = await getUserById(reply_to.USER_id_reply_to);
        const reply_to_InforUser = {
          ...reply_to,
          reply_to: reply_to_user,
        };
        reply_to_full.push(reply_to_InforUser);
      }

      const commentWithReply = {
        comment: comment,
        reply: reply_to_full,
      };
      fullComment.push(commentWithReply);
    }
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
