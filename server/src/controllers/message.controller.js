import {
  getConversationOfAUser,
  getMessages,
  checkOrCreateConversation,
  deleteConversationById,
  getConversationById,
  getMessagesUnreadByConversationId,
  updateUnreadMessagesInConversation,
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
  const userId = req.user.USER_Id; // Lấy ID người dùng từ URL (params)
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
      // Duyệt qua từng hội thoại và kiểm tra trạng thái chưa đọc
      try {
        console.log({ userId });
        const [conversations] = (await getConversationOfAUser(userId)) || [];
        if (!Array.isArray(conversations)) {
          console.error("getConversationOfAUser did not return an array");
          return res.json({});
        }
        console.log(">>>>>", conversations);
        const conversationsWithUnreadStatus = [];

        for (const conversation of conversations) {
          try {
            const isUnread = await getMessagesUnreadByConversationId(
              conversation.CON_ID,
              userId
            );
            conversationsWithUnreadStatus.push({
              ...conversation,
              isUnread,
            });
          } catch (unreadError) {
            console.error(
              "Error fetching unread status for conversation:",
              conversation.CON_ID,
              unreadError
            );
            conversationsWithUnreadStatus.push({
              ...conversation,
              isUnread: false, // Giả định là không có tin nhắn chưa đọc nếu gặp lỗi
            });
          }
        }

        res.json(conversationsWithUnreadStatus);
      } catch (error) {
        res.status(500).json({ error: "conversations" });
      }
    }
  } catch (error) {
    res.status(500).json({ error: "conversations of get conversation" });
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
    const isDelete = await deleteConversationById(conversationId);
    if (isDelete) {
      return res.json({ status: true, message: "Đã xoá thành công!" });
    }
    return res.json({ status: false, message: "Thực hiên xoá thất bại!" });
  } catch (error) {
    res.json({ status: false, error });
  }
}

export async function updateUnreadMessagesInConversationController(req, res) {
  try {
    // const update = await updateUnreadMessagesInConversation()
  } catch (error) {}
}
