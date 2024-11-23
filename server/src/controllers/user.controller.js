import {
  getUsers,
  getUser,
  getUserById,
  createUser,
  getAccountName_Email,
  checkAccout_Password,
  setInforUser,
  updateInfoUser,
  getUserByIdShortInfo,
} from "../services/user.js";

import {
  getFullInforUserAllUser,
  insertRequestToShip,
  deleteRequestAccepted,
  isSenderRequest,
  ListFriend,
} from "../services/frient-ship.js";

import dotenv from "dotenv";
dotenv.config();

import jwt from "jsonwebtoken";
import {
  getConversationOfAUser,
  getConversationUnread,
  getMessagesUnreadByConversationId,
} from "../services/chatting.js";
import { getNotificationsByUserId } from "../services/notification.js";
import {
  getImgOfPostById,
  getInfoCommentById,
  getInforOfReplyCommentById,
} from "../services/post.js";

export async function getUsersController(req, res) {
  const users = await getUsers();
  res.send(users);
}

export async function getUserController(req, res) {
  const id = req.params.id;
  // const id = req.user.USER_Id;
  const user = await getUserById(id);
  const friendRequests = await getFullInforUserAllUser(user?.USER_Id);
  const isSender = await isSenderRequest(user?.USER_Id);
  const listFriend = await ListFriend(user?.USER_Id);
  const response = {
    ...user,
    friendRequests: friendRequests.map((friend) => friend.USER_Id),
    isSenderRequest: isSender.map((friend) => friend.USER_RECID),
    listFriend: listFriend.map((friend) => friend.friend_user_id),
  };
  res.json(response);
}

function isUsernameValid(username) {
  if (username.length < 8 || username.length > 16) {
    return false;
  }

  if (!/[A-Z]/.test(username)) {
    return false;
  }

  if (!/[!@#$%^&*()_+{}\[\]:;<>,.?~\\]/.test(username)) {
    return false;
  }

  if (!/\d/.test(username)) {
    return false;
  }

  return true;
}

export async function register(req, res) {
  try {
    const {
      USER_Id,
      USER_AccountName,
      USER_Email,
      USER_Password,
      repassword,
      USER_UpdateAt,
    } = req.body;

    var regex = /^[a-zA-Z0-9._%+-]+@gmail.com/;

    if (!regex.test(USER_Email)) {
      return res.json({
        status: "error",
        error: `
          Email have to @gmail.com,Pls!`,
      });
    }
    if (!isUsernameValid(USER_AccountName)) {
      return res.json({
        status: "error",
        error: `
          Username is invalid`,
      });
    } else {
      if (USER_Password.length < 8) {
        return res.json({
          status: "error",
          error: "Password is soo low",
        });
      } else {
        const samePassword = USER_Password === repassword;
        if (!samePassword) {
          return res.json({
            status: "error",
            error: "Lets enter to same password!",
          });
        } else {
          const getUser = await getAccountName_Email(
            USER_AccountName,
            USER_Email
          );
          if (getUser) {
            return res.json({
              status: "error",
              error: "User or email existed",
            });
          } else {
            const create = await createUser(
              USER_Id,
              USER_AccountName,
              USER_Email,
              USER_Password,
              USER_UpdateAt
            );
            if (create) {
              return res.json({
                status: "successful",
                mess: "/home",
              });
            }
          }
        }
      }
    }
  } catch (error) {
    res.status(400).send({ error: "Pls, " });
  }
}

export async function registerInfor(req, res) {
  const file = req.files.map((file) => file.filename);
  const {
    USER_Id,
    USER_NickName,
    USER_FirstName,
    USER_SubName,
    USER_NumberPhone,
    USER_BirthDay,
    USER_Bio,
    USER_Sex,
  } = req.body;
  try {
    await setInforUser(
      file,
      USER_Id,
      USER_NickName,
      USER_FirstName,
      USER_SubName,
      USER_NumberPhone,
      USER_BirthDay,
      USER_Bio,
      USER_Sex
    );
    return res.json({
      status: "successful",
    });
  } catch (error) {
    console.log(error);
  }
  console.log(req.body, file);
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (await checkAccout_Password(email, email, password)) {
      const [getid] = await getUser(email, email);
      const token = jwt.sign(getid, process.env.JSON_WEB_TOKEN_KEY, {
        expiresIn: "100d",
      });

      return res.json({
        status: "successful",
        mess: `/home/`,
        user: getid,
        assetToken: token,
      });
    } else {
      return res.json({
        status: "error",
        error: "Your username or password is not correct",
      });
    }
  } catch (error) {
    console.error(error);
    return res.json({
      status: error,
    });
  }
}

export const updateAvatar = async (req, res) => {
  try {
    const { userId } = req.params;
    // const { avatarURL } = req.body;
    const files = req.files.map((file) => file.filename);
    const rsUpdate = await updateInfoUser.updateAvatar(userId, files);
    if (rsUpdate)
      return res.json({
        status: true,
        message:
          "Avatar updated! Looking good-thanks for refreshing your profile!",
      });

    return res.json({
      status: false,
      message: `Oops! The update didn't go through. Please wait a moment and try again!`,
    });
  } catch (error) {
    return res.json(error);
  }
};

export const updateAllInforUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      USER_NickName,
      USER_FirstName,
      USER_SubName,
      USER_Bio,
      USER_Gender,
    } = req.body;

    const result = await updateInfoUser.updateAll(
      userId,
      USER_NickName,
      USER_FirstName,
      USER_SubName,
      USER_Bio,
      USER_Gender
    );

    console.log({
      USER_NickName,
      USER_FirstName,
      USER_SubName,
      USER_Bio,
      USER_Gender,
      userId,
    });
    if (result.status) {
      return res.status(200).json({
        status: true,
        message: result.message,
      });
    } else {
      return res.status(400).json({
        status: false,
        message: result.message,
      });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: false, message: "Server error.", error });
  }
};

export const getConversationUnreadController = async (req, res) => {
  try {
    const { id } = req.params;

    // Kiểm tra giá trị trả về của getConversationOfAUser
    const conversationsData = await getConversationOfAUser(id);

    // Đảm bảo rằng conversationsData là một mảng và có phần tử đầu tiên là mảng
    const conversations = Array.isArray(conversationsData)
      ? conversationsData[0]
      : [];

    let numNotifi = 0;
    for (const conversation of conversations) {
      if (await getMessagesUnreadByConversationId(conversation.CON_ID, id))
        numNotifi++;
    }

    res.json(numNotifi);
  } catch (error) {
    console.error("Error fetching unread conversations:", error);
    res.status(500).json({ error: "Error fetching unread conversations" });
  }
};

export const getNotificationsOfUser = async (req, res) => {
  try {
    const { id } = req.params;
    const notifications = await getNotificationsByUserId(id);

    // Nhóm thông báo
    const groupedNotifications = {
      new: [],
      thisMonth: [],
      earlier: [],
    };

    // Lưu các `like` cần lấy bài viết
    const postsToFetch = new Map();
    const replyCommentToFetch = new Map();
    const commentToFetch = new Map();
    const userToFetch = new Map();

    for (const noti of notifications) {
      const { TYPE, REF_ID, CONTENT, CREATED_AT, STATUS, notification_group } =
        noti;

      // Xác định nhóm của thông báo
      const group = groupedNotifications[notification_group];

      if (TYPE === "like") {
        // Đánh dấu cần lấy thông tin bài đăng
        if (!postsToFetch.has(REF_ID)) {
          postsToFetch.set(REF_ID, null);
        }

        const existingLike = group.find(
          (item) => item.type === "like" && item.ref_id === REF_ID
        );

        if (existingLike) {
          const user = await getUserByIdShortInfo(CONTENT);
          existingLike.users.push(user[0]);
        } else {
          const user = await getUserByIdShortInfo(CONTENT);
          group.push({
            type: "like",
            ref_id: REF_ID,
            users: [user[0]],
            created_at: CREATED_AT,
            status: STATUS,
          });
        }
      } else if (TYPE === "comment" || TYPE === "reply_comment") {
        if (TYPE === "comment") {
          commentToFetch.set(REF_ID, null);
        } else {
          replyCommentToFetch.set(REF_ID, null);
        }

        group.push({
          type: TYPE,
          ref_id: REF_ID,
          content: CONTENT,
          created_at: CREATED_AT,
          status: STATUS,
        });
      } else {
        group.push({
          type: TYPE,
          ref_id: REF_ID,
          content: CONTENT,
          created_at: CREATED_AT,
          status: STATUS,
        });
      }
    }

    // Lấy thông tin bài viết từ REF_ID
    const postDetails = await Promise.all(
      Array.from(postsToFetch.keys()).map(async (postId) => {
        const post = await getImgOfPostById(postId);
        postsToFetch.set(postId, post.length > 0 ? post[0] : null);
      })
    );

    const replyDetails = await Promise.all(
      Array.from(replyCommentToFetch.keys()).map(async (replyId) => {
        const reply = await getInforOfReplyCommentById(replyId);
        replyCommentToFetch.set(replyId, reply.length > 0 ? reply[0] : null);
      })
    );

    const commentDetails = await Promise.all(
      Array.from(commentToFetch.keys()).map(async (commentId) => {
        const comment = await getInfoCommentById(commentId);
        commentToFetch.set(commentId, comment.length > 0 ? comment[0] : null);
      })
    );
    // Cập nhật thông tin bài viết vào `like`
    Object.values(groupedNotifications).forEach((group) => {
      group.forEach(async (noti) => {
        if (noti.type === "like" && postsToFetch.has(noti.ref_id)) {
          noti.post = postsToFetch.get(noti.ref_id); // Gắn thông tin bài viết
          if (noti.users.length > 3) {
            noti.stillUser = noti.users.length - 3;
            noti.users = noti.users.slice(0, 3);
          }
        }
        if (
          noti.type === "reply_comment" &&
          replyCommentToFetch.has(noti.ref_id)
        ) {
          noti.post = replyCommentToFetch.get(noti.ref_id);
        }

        if (noti.type === "comment" && commentToFetch.has(noti.ref_id)) {
          noti.post = commentToFetch.get(noti.ref_id);
        }
      });
    });
    // console.log(replyCommentToFetch);
    return res.json({ status: true, notifications: groupedNotifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ status: false });
  }
};
