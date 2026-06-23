from django.urls import path
from . import views

urlpatterns = [
    path('languages/', views.LanguageList.as_view()),
    path('translation/', views.Translation.as_view()),
]