import express from "express";
import {
  getUsersController,
  getUserController,
  register,
  login,
  registerInfor,
  getConversationUnreadController,
  updateAvatar,
  updateAllInforUser,
} from "../controllers/user.controller.js";

import {
  getAllIdUserRequestController,
  acceptRequest,
  getListFriend,
  sendRequest,
  cancelRequest,
  getFriend,
  cancelFriend,
  getFollowing,
} from "../controllers/friend-ship.controller.js";

import {
  postStatus,
  getPostOfUser,
  getAPost,
  getPostsOfUsers,
  likePost,
  unlikePost,
  postComment,
  getComments,
  postReplyComment,
} from "../controllers/post.controller.js";
// import { generateHashtagRecommendationsForUser } from "../services/recomment.js";

import {
  uploadAvatar,
  uploadStatus,
} from "../controllers/polices/polices.img.js";
import {
  getConversationsOffAUser,
  // getMessagesInAConversation,
  createComversation,
  deleteConversation,
} from "../controllers/message.controller.js";
import middlewareController from "../middleware/test.middleware.js";
import { moderateContentController } from "../controllers/moderate.controller.js";
import {
  getHashtagByNameController,
  getHashtagRecommendForAUser,
} from "../controllers/hashtag.controller.js";

export const router = express.Router();

router.all("*", middlewareController.verifyToken);

router.route("/").get(getUsersController);
router.route("/:id").get(getUserController);
router.route("/register").post(register);
router.route("/login").post(login);
router
  .route("/frients/:id")
  .get(getAllIdUserRequestController)
  .post(acceptRequest)
  .put(sendRequest)
  .delete(cancelRequest);

router.route("/frients/:id/havefriends").get(getListFriend);
router.route("/following/:id").get(getFollowing);
router.route("/frients/:id/friend").get(getFriend);
router.route("/frients/:id/:f_id").delete(cancelFriend);

router
  .route("/information/upload")
  .post(uploadAvatar.array("file"), registerInfor); // update the information (name, avatar) of user
router
  .route("/edit/profile/:userId")
  .post(uploadAvatar.array("file"), updateAvatar)
  .put(updateAllInforUser);

router
  .route("/status/img")
  .post(uploadStatus.array("file"), moderateContentController, postStatus);
// .get(getPostsOfUsers);

router
  .route("/status/img/:id")
  .get(getPostOfUser)
  .post(likePost)
  .put(unlikePost);
router.route("/status/img/recommend/:id").get(getPostsOfUsers);
router.route("/post/:idpost").get(getAPost);
router
  .route("/post/comments/comment/:idpost")
  .put(postReplyComment)
  .post(postComment)
  .get(getComments);

// router.route("/message/:id").get(getConversationsOffAUser);

router
  .route("/message/:id")
  .get(getConversationsOffAUser)
  .post(createComversation)
  .put(deleteConversation);
router.route("/notifications/message/:id").get(getConversationUnreadController);
router.route("/hashtag/search").get(getHashtagByNameController);
router.route("/hashtag/recommend/:id").get(getHashtagRecommendForAUser);
