# Generated by Django 4.1.1 on 2023-06-06 07:44

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('Main_pages', '0005_delete_category'),
    ]

    operations = [
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255, null=True)),
            ],
        ),
        migrations.AlterField(
            model_name='sound',
            name='author',
            field=models.CharField(max_length=30, null=True),
        ),
        migrations.AlterField(
            model_name='sound',
            name='file',
            field=models.FileField(null=True, upload_to='audio'),
        ),
        migrations.AlterField(
            model_name='sound',
            name='image',
            field=models.ImageField(null=True, upload_to='media'),
        ),
        migrations.AlterField(
            model_name='sound',
            name='music_lyrics',
            field=models.TextField(null=True),
        ),
        migrations.AlterField(
            model_name='sound',
            name='name',
            field=models.CharField(max_length=30, null=True),
        ),
        migrations.AlterField(
            model_name='sound',
            name='price',
            field=models.IntegerField(null=True),
        ),
        migrations.AddField(
            model_name='sound',
            name='category',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='Main_pages.category'),
        ),
    ]