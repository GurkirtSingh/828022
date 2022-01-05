import {React, useEffect} from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import { Input, Header, Messages } from "./index";
import { connect } from "react-redux";
import { postMessageRead, sendResetUnreadCount } from "../../store/utils/thunkCreators";
import { resetUnreadCount } from "../../store/conversations";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexGrow: 8,
    flexDirection: "column"
  },
  chatContainer: {
    marginLeft: 41,
    marginRight: 41,
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    justifyContent: "space-between"
  }
}));

const ActiveChat = (props) => {
  const classes = useStyles();
  const { user } = props;
  const conversation = props.conversation || {};

  const isThereUnseenMessages = () => {
    return (user.id !== conversation.latestMessageSenderId && 
      conversation.unreadCount > 0)
  }

  useEffect(() => {
    async function messageIsRead(){
      // if this user did not sent last message 
      // and there are unread message in conversation
      if (isThereUnseenMessages()) {
        // mark message read by recepient
        const reqBody = {
          "conversationId" : conversation.id
        };
      await props.postMessageRead(reqBody);
      await props.resetUnreadCount(reqBody.conversationId)
      sendResetUnreadCount(reqBody.conversationId)
      }
    }
    messageIsRead()
  })

  return (
    <Box className={classes.root}>
      {conversation.otherUser && (
        <>
          <Header
            username={conversation.otherUser.username}
            online={conversation.otherUser.online || false}
          />
          <Box className={classes.chatContainer}>
            <Messages
              messages={conversation.messages}
              otherUser={conversation.otherUser}
              userId={user.id}
              lastSeenId={conversation.lastReadMessageId}
            />
            <Input
              otherUser={conversation.otherUser}
              conversationId={conversation.id}
              user={user}
            />
          </Box>
        </>
      )}
    </Box>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    conversation:
      state.conversations &&
      state.conversations.find(
        (conversation) => conversation.otherUser.username === state.activeConversation
      )
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    postMessageRead: (message) => {
      dispatch(postMessageRead(message));
    },
    resetUnreadCount: (conversationId) => {
      dispatch(resetUnreadCount(conversationId))
    }
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ActiveChat);