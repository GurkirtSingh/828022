import { sortMessages } from "./storeUtils";

export const addMessageToStore = (state, payload) => {
  const { message, sender } = payload;
  // if sender isn't null, that means the message needs to be put in a brand new convo
  if (sender !== null) {
    const newConvo = {
      id: message.conversationId,
      otherUser: sender,
      messages: [message],
      latestMessageText: message.text,
      latestMessageSenderId: sender.id,
      unreadCount: 1
    };
    return [newConvo, ...state];
  }
  return state.map((convo) => {
    if (convo.id === message.conversationId) {
      const convoCopy = { ...convo }
      convoCopy.messages = [ ...convoCopy.messages, message]
      convoCopy.latestMessageText = message.text;
      convoCopy.latestMessageSenderId = message.senderId
      convoCopy.unreadCount += 1
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addOnlineUserToStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser = { ...convoCopy.otherUser, online: true };
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const removeOfflineUserFromStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser = { ...convoCopy.otherUser, online: false };
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addSearchedUsersToStore = (state, users) => {
  const currentUsers = {};

  // make table of current users so we can lookup faster
  state.forEach((convo) => {
    currentUsers[convo.otherUser.id] = true;
  });

  const newState = [...state];
  users.forEach((user) => {
    // only create a fake convo if we don't already have a convo with this user
    if (!currentUsers[user.id]) {
      let fakeConvo = { otherUser: user, messages: [] };
      newState.push(fakeConvo);
    }
  });

  return newState;
};

export const addNewConvoToStore = (state, recipientId, message) => {
  return state.map((convo) => {
    if (convo.otherUser.id === recipientId) {
      const convoCopy = { ...convo }
      convoCopy.id = message.conversationId;
      convoCopy.messages = [...convoCopy.messages, message];
      convoCopy.latestMessageText = message.text;
      convoCopy.latestMessageSenderId = message.senderId
      convoCopy.unreadCount = 1
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addExistingConvoToStore = (state, conversations) => {
    return conversations.map((convo)=>{
      const convoCopy = { ...convo }
      convoCopy.messages = sortMessages([...convoCopy.messages])
      return convoCopy;
    })
}

export const setLastReadMessageToStore = (state, payload) => {
  
  return state.map((convo) => {
    if( convo.id === payload.conversationId){
      const convoCopy = { ...convo }

      if (convoCopy.otherUser.id !== convoCopy.latestMessageSenderId){
        // lastReadMessageId is to inform other user that message is read by this user
        convoCopy.lastReadMessageId = payload.lastReadMessageId
      }
      return convoCopy
    } else{
      return convo;
    }
  })
}

export const resetUnreadCountToStore = (state, conversationId) =>{
  return state.map((convo) => {
    if( convo.id === conversationId){
      const convoCopy = { ...convo }
      convoCopy.unreadCount = 0
      return convoCopy
    } else{
      return convo;
    }
  })
}