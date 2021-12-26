from django.db import models
from messenger_backend.models import utils, GroupMessage, Participant

class ReadBy(utils.CustomModel):
    message = models.ForeignKey(GroupMessage, on_delete=models.CASCADE)
    participant = models.ForeignKey(Participant, on_delete=models.CASCADE)
    readAt = models.DateTimeField(auto_now_add=True)