# Generated by Django 4.2.17 on 2025-02-27 15:56

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("backend", "0007_rename_sub_targets_target_sub_target_list"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="target",
            name="targets",
        ),
        migrations.AddField(
            model_name="target",
            name="description",
            field=models.CharField(
                blank=True, max_length=500, null=True, verbose_name="目標描述"
            ),
        ),
        migrations.AddField(
            model_name="target",
            name="target",
            field=models.CharField(
                blank=True, max_length=120, null=True, verbose_name="目標名稱"
            ),
        ),
    ]
