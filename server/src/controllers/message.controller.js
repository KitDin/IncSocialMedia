import {
  getConversationOfAUser,
  getMessages,
  checkOrCreateConversation,
} from "../services/chatting.js";
import { decodeBase64 } from "./polices/police.uid.js";

// export async function getConversationsOffAUser(req, res) {
//   const userId = req.params.id; // Lấy ID người dùng từ URL (params)
//   const encodedConversationID = req.query.cid; // Lấy conversation ID đã mã hóa từ query string

//   const page = parseInt(req.query.page, 10) || 1;
//   const limit = parseInt(req.query.limit, 10) || 10;

//   try {
//     if (encodedConversationID) {
//       const conversationId = decodeBase64(encodedConversationID);
//       const messages = await getMessages(conversationId);
//       messages.reverse();
//       // Phân trang cho tin nhắn
//       const conversationCreatedTime = messages[0].CON_TIMECREATE;
//       const totalMessages = messages.length;
//       const startIndex = (page - 1) * limit;
//       const endIndex = Math.min(startIndex + limit, totalMessages);
//       const paginatedMessages = messages.slice(startIndex, endIndex);

//       paginatedMessages.forEach((element) => {
//         element.chenh = 0;
//       });

//       res.json({
//         conversationCreatedTime,
//         totalMessages, // Tổng số tin nhắn
//         page,
//         limit,
//         messages: paginatedMessages.reverse(),
//       });
//     } else {
//       const [conversations] = await getConversationOfAUser(userId);
//       res.json(conversations);
//     }
//   } catch (error) {
//     res.status(500).json({ error: "An error occurred" });
//   }
// }

export async function getConversationsOffAUser(req, res) {
  const userId = req.params.id; // Lấy ID người dùng từ URL (params)
  const encodedConversationID = req.query.cid; // Lấy conversation ID đã mã hóa từ query string

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;

  try {
    if (encodedConversationID) {
      const conversationId = decodeBase64(encodedConversationID);
      const messages = await getMessages(conversationId);
      if (messages) {
        messages.reverse();
        // Phân trang cho tin nhắn
        const conversationCreatedTime = messages[0].CON_TIMECREATE;
        const totalMessages = messages.length;
        const startIndex = (page - 1) * limit;
        const endIndex = Math.min(startIndex + limit, totalMessages);
        const paginatedMessages = messages.slice(startIndex, endIndex);

        paginatedMessages.forEach((element) => {
          element.chenh = 0;
        });

        res.json({
          conversationCreatedTime,
          totalMessages, // Tổng số tin nhắn
          page,
          limit,
          messages: paginatedMessages.reverse(),
        });
      } else {
        res.json({
          conversationCreatedTime: "null",
          totalMessages: 0, // Tổng số tin nhắn
          page,
          limit,
          messages: [],
        });
      }
    } else {
      const [conversations] = await getConversationOfAUser(userId);
      res.json(conversations);
    }
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
}

export async function createComversation(req, res) {
  try {
    const { id } = req.params;
    const users = req.body;
    let conversationId = "";

    for (const user of users) {
      conversationId = await checkOrCreateConversation(
        id,
        user.USER_ID,
        "null"
      );
    }

    res.json({ status: true, conversationId });
  } catch (error) {
    res.json({ status: false, error: error });
  }
}

export async function deleteConversation(req, res) {
  try {
    const { conversationId } = req.body;
    res.json({ conversationId });
  } catch (error) {
    res.json({ status: true, error });
  }
}