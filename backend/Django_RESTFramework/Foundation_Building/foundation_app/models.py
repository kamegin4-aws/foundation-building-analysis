import uuid

from django.db import models


# User Model (Cognito)
class User(models.Model):
    user_id = models.CharField(
        primary_key=True,
        default=uuid.uuid4,
        editable=True,
        max_length=255)
    user_name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    plan = models.CharField(max_length=255)
    access_token = models.TextField()
    id_token = models.TextField()
    refresh_token = models.TextField()
    expires = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.user_name

# RelationalData Model (RDS)


class RelationalData(models.Model):
    relational_id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False)
    meta_key = models.CharField(max_length=255)
    meta_value = models.CharField(max_length=255)
    comment = models.CharField(max_length=255, blank=True, null=True)
    version_id = models.UUIDField(default=uuid.uuid4, editable=False)
    key = models.CharField(max_length=255)
    value = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        unique_together = (
            'user',
            'meta_key',
            'meta_value',
            'version_id',
            'key')

    def __str__(self):
        return f"{self.key}: {self.value}"
