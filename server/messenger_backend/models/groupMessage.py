from django.db import models
from messenger_backend.models import utils, Group

class GroupMessage(utils.CustomModel):
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    senderId = models.IntegerField(null=False)
    text = models.TextField(null=False)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)