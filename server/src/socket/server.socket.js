import {
  checkOrCreateConversation,
  getConversationOfAUser,
  saveMessage,
  searchConversation,
  searchingUser,
} from "../services/chatting.js";

export function socket_server(io) {
  io.on("connection", (socket) => {
    socket.on("userConnected", async ({ USER_ID, CON_ID, RECEIVER_ID }) => {
      try {
        // Check or create the conversation
        const conId = await checkOrCreateConversation(
          USER_ID,
          RECEIVER_ID,
          CON_ID
        );

        // Join the socket to the conversation room
        socket.join(conId);

        console.log(conId, "\n\n\n\n\n");
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

        // console.log(conId, "\n\n\n\n\n");
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
        const searchResults = await searchingUser(searchQuery, userId);
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
      console.log("A user disconnected:", socket.id);
    });
  });
}
