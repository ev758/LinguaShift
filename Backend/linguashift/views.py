import deepl
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.shortcuts import render
from django.views import View
import os
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import AuthenticationFailed
from .serializers import UserSerializer

API_KEY = os.getenv("API_KEY")
deepl_client = deepl.DeepLClient(API_KEY)

class LanguageList(generics.ListAPIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        language_dict = {}

        #loops through each language object, and stores their name and language code in a dictionary as key-value pairs
        for language in deepl_client.get_source_languages():
            language_dict[language.name] = language.code
        
        return JsonResponse(language_dict)

class Translation(generics.CreateAPIView):
    permission_classes = [AllowAny]

    def post(self, request):
        #translates text with the source and target language codes
        translated_text = deepl_client.translate_text(request.data["languageText"], source_lang=request.data["inputLanguageCode"], target_lang=request.data["outputLanguageCode"])

        return JsonResponse({"translatedText": translated_text.text})

class SignUp(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class Authenticate(generics.CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        #verifies username and password to get user object
        user = authenticate(username=request.data["emailUsername"], password=request.data["password"])

        #if user is none, check if email was entered
        if user is None:
            #gets user object by email
            user = User.objects.get(email=request.data["emailUsername"])

            #if user is still none, then an access and refresh token are not given as email/username is invalid
            if user is None:
                raise AuthenticationFailed("Invalid email, cannot authenticate user")
            #if user's password is correct, then an access and refresh token are given as credentials are valid
            elif (user.check_password(request.data["password"])):
                refresh = RefreshToken.for_user(user)
                return JsonResponse({"refresh": str(refresh), "access": str(refresh.access_token)})
            
            raise AuthenticationFailed("Invalid password, cannot authenticate user")
        #if username and password are valid, then an access and refresh token are given
        elif user is not None:
            refresh = RefreshToken.for_user(user)
            return JsonResponse({"refresh": str(refresh), "access": str(refresh.access_token)})
        
        raise AuthenticationFailed("Invalid credentials, cannot authenticate user")

class Account(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
    
    def put(self, request, pk):
        user = self.request.user
        data = {"message": "Account updated successfully"}

        user.first_name = request.data["first_name"]
        user.last_name = request.data["last_name"]
        user.email = request.data["email"]
        user.username = request.data["username"]
        user.set_password(request.data["password"])

        user.save()

        return JsonResponse(data, status=200)
    
    def patch(self, request, pk):
        user = self.request.user
        data = {"message": "Account updated successfully"}

        for field in request.data:
            if (field == "first_name" and request.data[field] != user.first_name):
                user.first_name = request.data[field]
            elif (field == "last_name" and request.data[field] != user.last_name):
                user.last_name = request.data[field]
            elif (field == "email" and request.data[field] != user.email):
                user.email = request.data[field]
            elif (field =="username" and request.data[field] != user.username):
                user.username = request.data[field]
            elif (field == "password" and not user.check_password(request.data[field])):
                user.set_password(request.data[field])
        
        user.save()

        return JsonResponse(data, status=200)