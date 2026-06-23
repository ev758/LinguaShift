from django.http import JsonResponse
from django.shortcuts import render
from django.views import View
from rest_framework import generics
from rest_framework.permissions import AllowAny
import torch
from transformers import MBartForConditionalGeneration, MBart50TokenizerFast

language_dict = {"Arabic": "ar_AR", "Czech": "cs_CZ", "German": "de_DE", "English": "en_XX", "Spanish": "es_XX",
                 "Estonian": "et_EE", "Finnish": "fi_FI", "French": "fr_XX", "Gujarati": "gu_IN", "Hindi": "hi_IN",
                 "Italian": "it_IT", "Japanese": "ja_XX", "Kazakh": "kk_KZ", "Korean": "ko_KR", "Lithuanian": "lt_LT",
                 "Latvian": "lv_LV", "Burmese": "my_MM", "Nepali": "ne_NP", "Dutch": "nl_XX", "Romanian": "ro_RO",
                 "Russian": "ru_RU", "Sinhala": "si_LK", "Turkish": "tr_TR", "Vietnamese": "vi_VN", "Chinese": "zh_CN",
                 "Afrikaans": "af_ZA", "Azerbaijani": "az_AZ", "Bengali": "bn_IN", "Persian": "fa_IR", "Hebrew": "he_IL",
                 "Croatian": "hr_HR", "Indonesian": "id_ID", "Georgian": "ka_GE", "Khmer": "km_KH", "Macedonian": "mk_MK",
                 "Malayalam": "ml_IN", "Mongolian": "mn_MN", "Marathi": "mr_IN", "Polish": "pl_PL", "Pashto": "ps_AF",
                 "Portuguese": "pt_XX", "Swedish": "sv_SE", "Swahili": "sw_KE", "Tamil": "ta_IN", "Telugu": "te_IN",
                 "Thai": "th_TH", "Tagalog": "tl_XX", "Ukrainian": "uk_UA", "Urdu": "ur_PK", "Xhosa": "xh_ZA",
                 "Galician": "gl_ES", "Slovene": "sl_SI"}

#model for language translation
model_name = "facebook/mbart-large-50-many-to-many-mmt"

#loads tokenizer and model from Hugging Face's repository
tokenizer = MBart50TokenizerFast.from_pretrained(model_name)
model = MBartForConditionalGeneration.from_pretrained(model_name)

#moves the model and inputs to the GPU
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = model.to(device)

class LanguageList(generics.ListAPIView):
    def get(self, request):
        return JsonResponse(language_dict)

class Translation(generics.CreateAPIView):
    permission_classes = [AllowAny]

    def post(self, request):
        #sets input language code
        tokenizer.src_lang = request.data["inputLanguageCode"]

        #tokenizer converts input text into tensors for the model to process
        encoded_text = tokenizer(request.data["languageText"], return_tensors="pt").to(device)

        #generates translated text
        generated_tokens = model.generate(**encoded_text, forced_bos_token_id=tokenizer.lang_code_to_id[request.data["outputLanguageCode"]])

        #converts output tensors to human-readable text
        translated_text = tokenizer.decode(generated_tokens[0], skip_special_tokens=True)

        return JsonResponse({"translatedText": translated_text})