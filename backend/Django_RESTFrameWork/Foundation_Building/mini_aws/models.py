from django.db import models


class ElastiCache(models.Model):
    id = models.AutoField(primary_key=True, auto_created=True, blank=True)
    user_name = models.CharField(max_length=256, blank=False, null=False)
    result = models.BooleanField(blank=False, null=False)
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

    def getUserName(self):
        return self.user_name

    def getResult(self):
        return self.result

    def getCreate_at(self):
        return self.create_at

    def getUpdated_at(self):
        return self.updated_at

    def getOwner(self):
        return self.owner

    class Meta:
        ordering = ['updated_at', 'create_at']
