# Generated by Django 4.2.17 on 2025-03-03 08:01

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("backend", "0012_alter_studenttaskplan_content_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="studenttaskplan",
            name="content",
            field=models.JSONField(
                blank=True, default=list, null=True, verbose_name="任務計畫設定內容"
            ),
        ),
    ]
