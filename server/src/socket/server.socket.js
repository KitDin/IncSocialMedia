import {
  checkOrCreateConversation,
  getConversationOfAUser,
  saveMessage,
  searchConversation,
  searchingUser,
  updateUnreadMessagesInConversation,
} from "../services/chatting.js";
import {
  createComment,
  getCommentPostById,
  postReplyComments,
} from "../services/post.js";

export function socket_server(io) {
  const userConversations = {};
  io.on("connection", (socket) => {
    socket.on("userConnected", async ({ USER_ID, CON_ID, RECEIVER_ID }) => {
      try {
        // Check or create the conversation
        const conId = await checkOrCreateConversation(
          USER_ID,
          RECEIVER_ID,
          CON_ID
        );

        await updateUnreadMessagesInConversation(conId, USER_ID);
        // Join the socket to the conversation room
        socket.join(conId);
        userConversations[USER_ID] = conId;
      } catch (error) {
        console.error("Error in sending message:", error);
      }
    });
    // Listen for client messages
    socket.on("sendMessage", async (message) => {
      const { MESSAGE, SENDER_ID, CON_ID, RECEIVER_ID, CREATED_AT, chenh } =
        message;

      try {
        const conId = await checkOrCreateConversation(
          SENDER_ID,
          RECEIVER_ID,
          CON_ID
        );

        await saveMessage(conId, SENDER_ID, MESSAGE);

        io.to(conId).emit("newMessage", message);
        if (userConversations[RECEIVER_ID] === conId) {
          // Nếu người nhận đang ở cuộc hội thoại đó, đánh dấu là "đã xem"
          await updateUnreadMessagesInConversation(conId, RECEIVER_ID);
        }
      } catch (error) {
        console.error("Error in sending message:", error);
      }
    });

    // socket.on("typing", async ({ CON_ID, SENDER_ID, RECEIVER_ID }) => {
    //   const conId = await checkOrCreateConversation(
    //     SENDER_ID,
    //     RECEIVER_ID,
    //     CON_ID
    //   );

    //   socket.to(conId).emit("userTyping", { typing: true });
    // });

    // // Listen for stop typing events
    // socket.on("stopTyping", async ({ CON_ID, SENDER_ID, RECEIVER_ID }) => {
    //   const conId = await checkOrCreateConversation(
    //     SENDER_ID,
    //     RECEIVER_ID,
    //     CON_ID
    //   );

    //   socket.to(conId).emit("userTyping", { typing: false });
    // });

    socket.on("searchUser", async ({ searchQuery, userId }) => {
      try {
        // Thực hiện tìm kiếm người dùng trong database với query
        console.log(searchQuery);
        const searchResults = (await searchingUser(searchQuery, userId)) || [];
        // Gửi kết quả tìm kiếm trở lại client
        socket.emit("searchResults", searchResults);
      } catch (error) {
        console.error("Error searching users:", error);
      }
    });

    socket.on("searchConversation", async ({ searchQuery, userId }) => {
      try {
        const conversationsOfAUser = await searchConversation(
          searchQuery,
          userId
        );
        socket.emit("searchConversationResults", conversationsOfAUser);
      } catch (error) {}
    });

    socket.on("disconnect", () => {
      for (const [userId, conversationId] of Object.entries(
        userConversations
      )) {
        if (socket.id === userId) {
          delete userConversations[userId];
        }
      }
    });

    socket.on("joinPostRoom", ({ POST_ID, USER_ID }) => {
      socket.join(POST_ID); // Join vào "room" bài đăng
      console.log(`User ${USER_ID} joined post ${POST_ID}`);
    });

    socket.on("submitComment", async (data) => {
      try {
        const {
          POST_id,
          comment_id,
          comment_Content,
          replyComment,
          USER_id,
          USER_id_reply_to,
          CommentReply_id,
          CommentReply_Content,
        } = data;

        let result;

        // Kiểm tra dữ liệu và thực hiện thêm mới comment/reply
        if (replyComment) {
          result = await postReplyComments(
            POST_id,
            replyComment,
            USER_id,
            USER_id_reply_to,
            CommentReply_id,
            CommentReply_Content
          );
        } else {
          result = await createComment(
            comment_id,
            POST_id,
            USER_id,
            comment_Content
          );
        }
        if (result) {
          const comments = await getCommentPostById(POST_id);
          io.to(POST_id).emit("updateComments", comments);
        }
      } catch (error) {
        console.error("Error handling submitComment:", error);
      }
    });

    socket.on("leavePostRoom", ({ POST_ID, USER_ID }) => {
      socket.leave(POST_ID); // Rời khỏi "room" bài đăng
      console.log(`User ${USER_ID} left post ${POST_ID}`);
    });
  });
}
