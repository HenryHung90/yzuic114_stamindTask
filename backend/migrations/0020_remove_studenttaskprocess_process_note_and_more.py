# Generated by Django 4.2.17 on 2025-03-17 03:19

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("backend", "0019_alter_chathistory_chat_history_and_more"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="studenttaskprocess",
            name="process_note",
        ),
        migrations.DeleteModel(
            name="StudentTaskProcessNote",
        ),
    ]
