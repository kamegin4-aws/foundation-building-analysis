# Generated by Django 5.0.2 on 2024-02-23 07:00

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('mini_aws', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='elasticache',
            options={'ordering': ['updated_at', 'create_at']},
        ),
    ]
