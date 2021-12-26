from django.db import models
from messenger_backend.models import utils, User, Group

class Participant(utils.CustomModel):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    joinOn = models.DateTimeField(auto_now_add=True, db_index=True)
    leftOn = models.DateTimeField(null=True)
    isAdmin = models.BooleanField(default=False)

    class Meta:
        unique_together = ('user', 'group')