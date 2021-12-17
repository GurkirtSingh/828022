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

            conversation = Conversation.objects.filter(id=conversation_id).first()
            if conversation:
                messages= Message.objects.filter(conversation=conversation)
                if messages.last().senderId != user_id:
                    for message in messages:
                        message.readByRecipient = True
                        message.save()

                return JsonResponse({"conversationId" : conversation.id})
            else:
                return HttpResponse(status=400, content={"error": "conversation does't exists!!"})
        except Exception as e:
            return HttpResponse(status=500)