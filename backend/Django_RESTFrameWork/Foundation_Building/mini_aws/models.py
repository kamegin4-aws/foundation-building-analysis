from django.db import models


class User(models.Model):
    user_id = models.CharField(max_length=255, primary_key=True)


class InMemoryData(models.Model):
    id = models.CharField(max_length=255, primary_key=True)
    key = models.CharField(max_length=255)
    value = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('user', 'key')
