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

    // Get the list of friend IDs
    const friends = await ListFriend(userId);
    const friendIds = friends.map((friend) => friend.friend_user_id);

    // Get the list of users the current user has chatted with
    const conversationsOfUser = await getConversationOfAUser(userId);
    const usersIdChatting = conversationsOfUser[0].map((conversation) => {
      return conversation.USER_ID;
    });

    // Filter out users who have already chatted with the current user
    const resultHadChatting = searchResults.filter((result) => {
      return !usersIdChatting.some(
        (userIdChatting) => result.USER_ID === userIdChatting
      );
    });

    // Create the final result array with an isFriend property
    const finalResults = resultHadChatting.map((result) => {
      const isFriend = friendIds.includes(result.USER_ID);
      return { ...result, isFriend };
    });

    // Sort the final results so friends come first
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
