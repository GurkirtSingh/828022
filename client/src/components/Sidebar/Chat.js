import React from "react";
import { Box, Chip } from "@material-ui/core";
import { BadgeAvatar, ChatContent } from "../Sidebar";
import { makeStyles } from "@material-ui/core/styles";
import { setActiveChat } from "../../store/activeConversation";
import { postMessageSeen } from "../../store/utils/thunkCreators";
import { connect } from "react-redux";

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: 8,
    height: 80,
    boxShadow: "0 2px 10px 0 rgba(88,133,196,0.05)",
    marginBottom: 10,
    display: "flex",
    alignItems: "center",
    "&:hover": {
      cursor: "grab"
    }
  },
  chip: {
    height: 20,
    backgroundColor: "#3F92FF",
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: -0.5,
    lineHeight: 14,
  }
}));

const Chat = (props) => {
  const classes = useStyles();
  const { user, conversation } = props;
  const { otherUser } = conversation;

  const isThereUnseenMessages = () => {
    return (user.id !== conversation.latestMessageSenderId && 
      conversation.unreadCount > 0)
  }

  const handleClick = async (conversation) => {
    await props.setActiveChat(conversation.otherUser.username);
    // if this user did not sent last message 
    // and there are unread message in conversation
    if (isThereUnseenMessages()) {
        // mark message read by recepient
        const reqBody = {
          "conversationId" : conversation.id
        };
       await props.postMessageSeen(reqBody);
    }
  };

  return (
    <Box onClick={() => handleClick(conversation)} className={classes.root}>
      <BadgeAvatar
        photoUrl={otherUser.photoUrl}
        username={otherUser.username}
        online={otherUser.online}
        sidebar={true}
      />
      <ChatContent conversation={conversation} user={user} />
      { isThereUnseenMessages() ? <Chip label={conversation.unreadCount} className={classes.chip} /> : ""}
      
    </Box>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setActiveChat: (id) => {
      dispatch(setActiveChat(id));
    },
    postMessageSeen: (message) => {
      dispatch(postMessageSeen(message));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
