# Generated by Django 5.2.1 on 2025-06-08 11:20

import datetime
import django.core.validators
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='professor',
            options={'ordering': ['name'], 'verbose_name': 'Professeur', 'verbose_name_plural': 'Professeurs'},
        ),
        migrations.AlterModelOptions(
            name='vote',
            options={'ordering': ['-timestamp'], 'verbose_name': 'Vote', 'verbose_name_plural': 'Votes'},
        ),
        migrations.AddField(
            model_name='professor',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, default=datetime.datetime(2025, 6, 8, 11, 18, 56, 824767, tzinfo=datetime.timezone.utc)),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='professor',
            name='photo',
            field=models.URLField(blank=True, null=True, verbose_name='Photo URL'),
        ),
        migrations.AddField(
            model_name='professor',
            name='subject',
            field=models.CharField(default='Non spécifiée', max_length=100, verbose_name='Matière'),
        ),
        migrations.AddField(
            model_name='vote',
            name='score',
            field=models.IntegerField(choices=[(1, '⭐'), (2, '⭐⭐'), (3, '⭐⭐⭐'), (4, '⭐⭐⭐⭐'), (5, '⭐⭐⭐⭐⭐')], default=0, validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(5)], verbose_name='Score'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='professor',
            name='description',
            field=models.TextField(verbose_name='Description'),
        ),
        migrations.AlterField(
            model_name='professor',
            name='name',
            field=models.CharField(max_length=100, verbose_name='Nom du professeur'),
        ),
        migrations.AlterField(
            model_name='vote',
            name='comment',
            field=models.TextField(blank=True, max_length=500, null=True, verbose_name='Commentaire'),
        ),
        migrations.AlterField(
            model_name='vote',
            name='ip_address',
            field=models.GenericIPAddressField(verbose_name='Adresse IP'),
        ),
        migrations.AlterField(
            model_name='vote',
            name='professor',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='votes', to='core.professor', verbose_name='Professeur'),
        ),
        migrations.AlterField(
            model_name='vote',
            name='timestamp',
            field=models.DateTimeField(auto_now_add=True, verbose_name='Date du vote'),
        ),
        migrations.AlterUniqueTogether(
            name='vote',
            unique_together={('professor', 'ip_address')},
        ),
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.TextField(max_length=1000, verbose_name='Commentaire détaillé')),
                ('is_anonymous', models.BooleanField(default=True, verbose_name='Anonyme')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('vote', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='detailed_comment', to='core.vote')),
            ],
            options={
                'verbose_name': 'Commentaire détaillé',
                'verbose_name_plural': 'Commentaires détaillés',
                'ordering': ['-created_at'],
            },
        ),
    ]
