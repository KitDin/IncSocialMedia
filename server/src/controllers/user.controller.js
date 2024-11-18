import {
  getUsers,
  getUser,
  getUserById,
  createUser,
  getAccountName_Email,
  checkAccout_Password,
  setInforUser,
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

// export async function login(req, res) {
//   try {
//     const { email, password } = req.body;
//     if (await checkAccout_Password(email, email, password)) {
//       const getid = await getUser(email, email);
//       return res.json({
//         status: "successful",
//         mess: `/home/`,
//         user: getid,
//       });
//     } else {
//       return res.json({
//         status: "error",
//         error: "Your username or password is not correct",
//       });
//     }
//   } catch (error) {
//     return res.json({
//       status: error,
//     });
//   }
// }

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (await checkAccout_Password(email, email, password)) {
      const [getid] = await getUser(email, email);
      const token = jwt.sign(getid, process.env.JSON_WEB_TOKEN_KEY, {
        expiresIn: "1d",
      });
      console.error("error");

      return res.json({
        status: "successful",
        mess: `/home/`,
        user: getid,
        assetToken: token,
      });
    } else {
      console.error("error");

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
