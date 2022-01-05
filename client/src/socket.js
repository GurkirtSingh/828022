import io from "socket.io-client";
import store from "./store";
import {
  setNewMessage,
  removeOfflineUser,
  addOnlineUser,
  setLastReadMessage,
  resetUnreadCount,
} from "./store/conversations";

const socket = io(window.location.origin);

socket.on("connect", () => {
  console.log("connected to server");

  socket.on("add-online-user", (id) => {
    store.dispatch(addOnlineUser(id));
  });

  socket.on("remove-offline-user", (id) => {
    store.dispatch(removeOfflineUser(id));
  });
  socket.on("new-message", (data) => {
    store.dispatch(setNewMessage(data.message, data.sender));
  });
  socket.on("read-messages", (data) => {
    store.dispatch(setLastReadMessage(data.conversationId, data.lastReadMessageId))
  })
  socket.on("reset-unread-count", (conversationId) => {
    store.dispatch(resetUnreadCount(conversationId))
  })
});

export default socket;
