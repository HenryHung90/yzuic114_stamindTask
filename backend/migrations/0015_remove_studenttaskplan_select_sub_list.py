# Generated by Django 4.2.17 on 2025-03-03 11:41

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("backend", "0014_remove_studenttaskplan_content_and_more"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="studenttaskplan",
            name="select_sub_list",
        ),
    ]
