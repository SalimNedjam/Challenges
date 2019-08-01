# Generated by Django 2.2.2 on 2019-08-01 15:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('application', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='challenges',
            name='enable_delete_submission',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='challenges',
            name='enable_edit_group',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='submission',
            name='score',
            field=models.FloatField(default=0),
        ),
    ]
