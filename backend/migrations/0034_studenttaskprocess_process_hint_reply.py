# Generated by Django 4.2.17 on 2025-04-22 09:36

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("backend", "0033_task_process_hint"),
    ]

    operations = [
        migrations.AddField(
            model_name="studenttaskprocess",
            name="process_hint_reply",
            field=models.JSONField(
                blank=True, default=list, null=True, verbose_name="實作提示回覆內容"
            ),
        ),
    ]
