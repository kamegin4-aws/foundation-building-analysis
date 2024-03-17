from django.db import models
import uuid


class ElastiCache(models.Model):
    id = models.UUIDField(
        primary_key=True,
        auto_created=True,
        blank=True,
        default=uuid.uuid4)
    key = models.CharField(
        max_length=5120,
        unique=True,
        blank=False,
        null=False)
    value = models.CharField(max_length=51200, blank=False, null=False)
    create_at = models.DateTimeField(
        auto_now_add=True,
        blank=True,
        null=True)
    updated_at = models.DateTimeField(
        auto_now=True,
        blank=True,
        null=True)
    owner = models.ForeignKey(
        'auth.User',
        related_name='elasticache',
        on_delete=models.CASCADE)

    def getID(self):
        return self.id

    def getKey(self):
        return self.key

    def getValue(self):
        return self.value

    def getCreate_at(self):
        return self.create_at

    def getUpdated_at(self):
        return self.updated_at

    def getOwner(self):
        return self.owner

    class Meta:
        ordering = ['key', 'updated_at', 'create_at']


class ResultLog(models.Model):
    id = models.AutoField(primary_key=True, auto_created=True, blank=True)
    user_name = models.CharField(max_length=256, blank=False, null=False)
    elasticache = models.OneToOneField(
        ElastiCache,
        null=True,
        related_name='result_elasticache',
        on_delete=models.SET_NULL)
    result = models.BooleanField(blank=False, null=False)
    create_at = models.DateTimeField(
        auto_now_add=True,
        blank=True,
        null=True)

    def getID(self):
        return self.id

    def getUserName(self):
        return self.user_name

    def getElasticache(self):
        return self.elasticache

    def getResult(self):
        return self.result

    def getCreate_at(self):
        return self.create_at

    class Meta:
        ordering = ['user_name', 'create_at']
