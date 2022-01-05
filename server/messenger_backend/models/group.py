from django.db import models
from messenger_backend.models import utils

class Group(utils.CustomModel):
    title = models.CharField(max_length=100, blank=False)
    discription = models.TextField(blank=True)
    photoUrl = models.TextField()
    createdAt = models.DateTimeField(auto_now_add=True, db_index=True)
    updatedAt = models.DateTimeField(auto_now=True)