import React from "react";
import { Box } from "@material-ui/core";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import moment from "moment";
import { useSelector } from "react-redux";

const Messages = (props) => {
  const { conversationId, otherUser, userId} = props;
  const allConversations = useSelector((state) => state.conversations)
  const activeChat = allConversations.find(
    (convo) => convo.id === conversationId
    )

  return (
    <Box>
      {activeChat.messages.sort().map((message) => {
        const time = moment(message.createdAt).format("h:mm");

        return message.senderId === userId ? (
          <SenderBubble key={message.id} text={message.text} time={time} />
        ) : (
          <OtherUserBubble key={message.id} text={message.text} time={time} otherUser={otherUser} />
        );
      })}
    </Box>
  );
};

export default Messages;
