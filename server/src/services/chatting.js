import {
  decodeBase64,
  generateUniqueId,
} from "../controllers/polices/police.uid.js";
import { pool } from "../db/db.js";
import { ListFriend } from "./frient-ship.js";

export async function getConversationById(conId) {
  try {
    const [conversation] = await pool.query(
      "select * from __CONVERSATIONS where con_id=?",
      [conId]
    );
    return conversation.length > 0 ? conversation : null;
  } catch (error) {
    console.error("Error fetching conversation by ID:", error); // Log lỗi cụ thể
    throw new Error("Unable to fetch conversation");
  }
}

export const checkOrCreateConversation = async (
  userID1,
  userID2,
  conversationId
) => {
  try {
    const sqlCheckConversation = `SELECT cu1.CON_ID 
      FROM __CONVERSATION_USER cu1 
      JOIN __CONVERSATION_USER cu2 ON cu1.CON_ID = cu2.CON_ID
      WHERE cu2.USER_ID = ? AND cu1.USER_ID = ?;`;
    // const decodeBase64Conversation = decodeBase64(conversationId);
    const [result] = await pool.query(sqlCheckConversation, [userID1, userID2]);
    if (result.length > 0) {
      return result[0].CON_ID;
    } else {
      const conId = generateUniqueId();
      const cuId1 = generateUniqueId();
      const cuId2 = generateUniqueId();

      // Tạo cuộc hội thoại mới
      await pool.query(`INSERT INTO __CONVERSATIONS (CON_ID) VALUES (?)`, [
        conId,
      ]);

      // Thêm người dùng vào cuộc hội thoại
      await pool.query(
        `
      INSERT INTO __CONVERSATION_USER (CU_ID,CON_ID, USER_ID) VALUES (?, ?, ?), (?, ?, ?)`,
        [cuId1, conId, userID1, cuId2, conId, userID2]
      );
      return conId;
    }
  } catch (error) {
    console.error("Error during conversation creation:", error);
    throw error;
  }
};

export const saveMessage = async (conId, senderId, message) => {
  const messId = generateUniqueId();

  await pool.query(
    `INSERT INTO __MESSAGES (MESS_ID, CON_ID, SENDER_ID, MESSAGE) VALUES (?, ?, ?, ?)`,
    [messId, conId, senderId, message]
  );
};

export async function getConversationOfAUser(userID) {
  try {
    const sqlGetConversation = `SELECT 
    c.CON_ID, 
    c.CON_TIMECREATE, 
    cu2.USER_ID,
    UI.USER_AVATARURL,
    UI.USER_NICKNAME,
    UI.USER_SUBNAME,
    UI.USER_FIRSTNAME,
    m.MESSAGE,
    m.CREATED_AT
FROM 
    __CONVERSATION_USER cu1
    JOIN __CONVERSATION_USER cu2 ON cu1.CON_ID = cu2.CON_ID 
    JOIN __CONVERSATIONS c ON cu1.CON_ID = c.CON_ID
    LEFT JOIN __USER_INFOR UI ON cu2.USER_ID = UI.USER_ID
    LEFT JOIN __MESSAGES m ON cu2.CON_ID = m.CON_ID 
        AND m.CREATED_AT = (
            SELECT MAX(CREATED_AT) 
            FROM __MESSAGES 
            WHERE CON_ID = cu2.CON_ID
        )
WHERE 
    cu1.USER_ID = ?
    AND cu2.USER_ID != ?
ORDER BY 
    m.CREATED_AT DESC;`;

    const [result] = await pool.query(sqlGetConversation, [userID, userID]);
    if (result.length > 0) {
      return [result];
    } else {
      console.error;
      return [];
    }
  } catch (error) {
    console.error;
  }
}

export async function getMessages(conid) {
  try {
    const sqlGetMessage = `select * from __MESSAGES m join __Conversations con on m.con_id = con.con_id where m.con_id=? ORDER BY m.CREATED_AT;`;

    const [result] = await pool.query(sqlGetMessage, [conid]);
    if (result.length > 0) {
      return result;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}

// export async function searchingUser(searchQuery, userId) {
//   try {
//     const [searchResults] = await pool.query(
//       `
//         SELECT USER_ID, USER_FIRSTNAME, USER_SUBNAME, USER_NICKNAME, USER_AVATARURL
//         FROM __USER_INFOR
//         WHERE LOWER(USER_FIRSTNAME) LIKE LOWER(?)
//         OR LOWER(USER_SUBNAME) LIKE LOWER(?)
//         OR LOWER(USER_NICKNAME) LIKE LOWER(?)
//       `,
//       [`%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`]
//     );

//     // Lọc bỏ người dùng có ID trùng với userId
//     const filteredResults = searchResults.filter(
//       (result) => result.USER_ID !== userId
//     );

//     // Lấy danh sách ID bạn bè
//     const friends = await ListFriend(userId);
//     const friendIds = friends.map((friend) => friend.friend_user_id);

//     // Lấy danh sách người dùng mà userId đã trò chuyện
//     const conversationsOfUser = await getConversationOfAUser(userId);
//     const usersIdChatting = conversationsOfUser[0].map((conversation) => {
//       return conversation.USER_ID;
//     });

//     // Lọc bỏ những người dùng đã trò chuyện với userId
//     const resultHadChatting = filteredResults.filter((result) => {
//       return !usersIdChatting.some(
//         (userIdChatting) => result.USER_ID === userIdChatting
//       );
//     });

//     // Tạo mảng kết quả cuối cùng với thuộc tính isFriend
//     const finalResults = resultHadChatting.map((result) => {
//       const isFriend = friendIds.includes(result.USER_ID);
//       return { ...result, isFriend };
//     });

//     // Sắp xếp kết quả cuối cùng để bạn bè xuất hiện đầu tiên
//     finalResults.sort((a, b) => b.isFriend - a.isFriend);

//     return finalResults;
//   } catch (error) {
//     console.error(error);
//   }
// }

export async function searchingUser(searchQuery, userId) {
  try {
    const [searchResults] = await pool.query(
      `
        SELECT USER_ID, USER_FIRSTNAME, USER_SUBNAME, USER_NICKNAME, USER_AVATARURL
        FROM __USER_INFOR
        WHERE LOWER(USER_FIRSTNAME) LIKE LOWER(?)
        OR LOWER(USER_SUBNAME) LIKE LOWER(?)
        OR LOWER(USER_NICKNAME) LIKE LOWER(?)
      `,
      [`%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`]
    );

    // Lọc bỏ người dùng có ID trùng với userId
    const filteredResults = searchResults.filter(
      (result) => result.USER_ID !== userId
    );

    // Lấy danh sách ID bạn bè
    const friends = await ListFriend(userId);
    const friendIds = friends.map((friend) => friend.friend_user_id);

    // Lấy danh sách người dùng mà userId đã trò chuyện
    const conversationsOfUser = await getConversationOfAUser(userId);

    // Kiểm tra conversationsOfUser và conversationsOfUser[0] có phải là mảng không
    const usersIdChatting = Array.isArray(conversationsOfUser[0])
      ? conversationsOfUser[0].map((conversation) => conversation.USER_ID)
      : []; // Nếu không phải mảng, trả về mảng rỗng

    // Lọc bỏ những người dùng đã trò chuyện với userId
    const resultHadChatting = filteredResults.filter((result) => {
      return !usersIdChatting.some(
        (userIdChatting) => result.USER_ID === userIdChatting
      );
    });

    // Tạo mảng kết quả cuối cùng với thuộc tính isFriend
    const finalResults = resultHadChatting.map((result) => {
      const isFriend = friendIds.includes(result.USER_ID);
      return { ...result, isFriend };
    });

    // Sắp xếp kết quả cuối cùng để bạn bè xuất hiện đầu tiên
    finalResults.sort((a, b) => b.isFriend - a.isFriend);

    return finalResults;
  } catch (error) {
    console.error(error);
  }
}

export async function searchConversation(searchQuery, userId) {
  try {
    // Lấy danh sách các cuộc hội thoại của người dùng
    const conversationsOfAUser = await getConversationOfAUser(userId);

    // Lọc kết quả dựa trên chuỗi tìm kiếm
    const finalResults = conversationsOfAUser[0].filter((conversation) => {
      const nicknameMatch = conversation.USER_NICKNAME.toLowerCase().includes(
        searchQuery.toLowerCase()
      );
      const fullnameMatch = (
        conversation.USER_SUBNAME +
        " " +
        conversation.USER_FIRSTNAME
      )
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      // Trả về nếu nickname hoặc fullname khớp với chuỗi tìm kiếm
      return nicknameMatch || fullnameMatch;
    });

    return finalResults;
  } catch (error) {
    console.error("Error in searchConversation:", error);
    return [];
  }
}

export async function deleteConversationById(conId) {
  try {
    const deleteSql = "delete from __CONVERSATIONS where CON_ID =?;";
    const [isDelete] = await pool.query(deleteSql, [conId]);
    return isDelete.affectedRows > 0 ? true : false;
  } catch (error) {
    console.error("Error deleting conversation:", error);
    return false;
  }
}

export const getMessagesUnreadByConversationId = async (
  conversationId,
  userId
) => {
  const query = `SELECT CON_ID
          FROM __MESSAGES
          WHERE CON_ID = ? and IS_READ = FALSE AND SENDER_ID != ?
          GROUP BY CON_ID;`;

  try {
    const [isUnread] = await pool.query(query, [conversationId, userId]);
    return isUnread.length > 0 ? true : false;
  } catch (error) {
    console.error(error);
  }
};

export const updateUnreadMessagesInConversation = async (
  conversationId,
  userId
) => {
  const updateQuery = `UPDATE __MESSAGES
    SET IS_READ = true
    WHERE CON_ID = ? AND SENDER_ID != ?;`;
  try {
    const [isUnread] = await pool.query(updateQuery, [conversationId, userId]);
    return isUnread;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const getConversationUnread = async (userId) => {
  const query = `SELECT CON_ID
                    FROM __MESSAGES
                    WHERE IS_READ = FALSE AND SENDER_ID != ?
                    GROUP BY CON_ID;`;
  try {
    const conversationsUnread = await pool.query(query, [userId]);
    return conversationsUnread.length;
  } catch (error) {
    console.error(error);
    return false;
  }
};
