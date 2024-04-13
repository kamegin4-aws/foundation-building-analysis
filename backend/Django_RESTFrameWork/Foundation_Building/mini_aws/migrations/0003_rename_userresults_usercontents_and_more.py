# Generated by Django 5.0.2 on 2024-04-10 22:58

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('mini_aws', '0002_alter_elasticache_key'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='UserResults',
            new_name='UserContents',
        ),
        migrations.RenameField(
            model_name='elasticache',
            old_name='user_results',
            new_name='user_contents',
        ),
        migrations.AlterUniqueTogether(
            name='elasticache',
            unique_together={('user_contents', 'key')},
        ),
    ]
