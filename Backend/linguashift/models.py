from django.contrib.auth.models import User
from django.db import models

class TranslationHistory(models.Model):
    translation_id = models.BigAutoField(primary_key=True)
    date = models.DateField(auto_now_add=True)
    language = models.CharField(max_length=50)
    text = models.TextField()
    translated_language = models.CharField(max_length=50)
    translated_text = models.TextField()
    account = models.ForeignKey(User, on_delete=models.CASCADE, related_name="translations")

    class Meta:
        db_table = "translation_history"