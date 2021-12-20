from django.contrib.auth.middleware import get_user
from django.http import HttpResponse, JsonResponse
from rest_framework.views import APIView
from rest_framework.request import Request

from messenger_backend.models import Conversation
from messenger_backend.models import Message

class MessageRead(APIView):
    """mark all the unread messages as read for a conversation
    and return a conversation id on success"""
    def post(self, request: Request):
        try:
            user = get_user(request)

            if user.is_anonymous:
                return HttpResponse(status=401)
            user_id = user.id
            body = request.data
            conversation_id = body.get("conversationId")
            lastReadMessageId = self.markAllRead(conversation_id, user_id)
            return JsonResponse({
                "conversationId": conversation_id,
                "lastReadMessageId": lastReadMessageId})
        except Exception as e:
            return HttpResponse(status=500)
    @staticmethod
    def markAllRead(convoId, userId):
        conversation = Conversation.objects.filter(id=convoId).first()
        if conversation:
            messages= Message.objects.filter(conversation=conversation)
            if messages.last().senderId != userId:
                for message in messages:
                    message.readByRecipient = True
                    message.save()
                # if there is last message sent by this user is also mark as seen
                # this will tell the other user that message was read
                lastMessageSent = messages.exclude(senderId=userId).last()
                if lastMessageSent != None:
                    return lastMessageSent.id
                else:
                # this mean that there is no message was sent by this user before
                    return 0