from django.contrib.auth.models import User
from rest_framework import serializers
from .models import TranslationHistory, PasswordReset

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "first_name", "last_name", "email", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}
    
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class TranslationHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = TranslationHistory
        fields = "__all__"
        extra_kwargs = {"account": {"read_only": True}}

class PasswordResetSerializer(serializers.ModelSerializer):
    class Meta:
        model = PasswordReset
        fields = "__all__"
        extra_kwargs = {"account": {"read_only": True}}