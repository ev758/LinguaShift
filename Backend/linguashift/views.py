import deepl
from django.http import JsonResponse
from django.shortcuts import render
from django.views import View
import os
from rest_framework import generics
from rest_framework.permissions import AllowAny

API_KEY = os.getenv("API_KEY")
deepl_client = deepl.DeepLClient(API_KEY)

class LanguageList(generics.ListAPIView):
    def get(self, request):
        language_dict = {}

        #loops through each language object, and stores their name and language code in a dictionary as key-value pairs
        for language in deepl_client.get_source_languages():
            if (language.name == "English"):
                language_dict[language.name] = "EN-US"
                continue

            language_dict[language.name] = language.code
        
        return JsonResponse(language_dict)

class Translation(generics.CreateAPIView):
    permission_classes = [AllowAny]

    def post(self, request):
        #translates text with the source and target language codes
        translated_text = deepl_client.translate_text(request.data["languageText"], source_lang=request.data["inputLanguageCode"], target_lang=request.data["outputLanguageCode"])

        return JsonResponse({"translatedText": translated_text.text})