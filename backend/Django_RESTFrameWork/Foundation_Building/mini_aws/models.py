from django.db import models
import uuid


class UserResults(models.Model):
    # id = models.AutoField(primary_key=True, auto_created=True, blank=True)
    user_name = models.CharField(
        primary_key=True,
        max_length=256,
        blank=False,
        null=False)
    create_at = models.DateTimeField(
        auto_now_add=True,
        blank=True,
        null=True)
    updated_at = models.DateTimeField(
        auto_now=True,
        blank=True,
        null=True)

    class Meta:
        ordering = ['user_name', 'updated_at', 'create_at']


class ElastiCache(models.Model):
    id = models.UUIDField(
        primary_key=True,
        auto_created=True,
        blank=True,
        default=uuid.uuid4)
    key = models.CharField(
        max_length=5120,
        blank=False,
        null=False)
    value = models.CharField(max_length=51200, blank=False, null=False)
    user_results = models.ForeignKey(
        UserResults,
        related_name='elasticache',  # UserResultsインスタンスからElastiCacheのセットにアクセスするための名前
        on_delete=models.CASCADE  # UserResultsインスタンスが削除された場合、関連するElastiCacheインスタンスも削除される
    )
    create_at = models.DateTimeField(
        auto_now_add=True,
        blank=True,
        null=True)
    updated_at = models.DateTimeField(
        auto_now=True,
        blank=True,
        null=True)

    class Meta:
        ordering = ['key', 'updated_at', 'create_at']
        unique_together = ['user_results', 'key']
