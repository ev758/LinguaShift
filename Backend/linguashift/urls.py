from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    path('languages/', views.LanguageList.as_view()),
    path('translation/', views.Translation.as_view()),
    path('token/refresh/', TokenRefreshView.as_view()),
    path('signup/', views.SignUp.as_view()),
    path('authenticate/', views.Authenticate.as_view()),
    path('forgot-password/', views.PasswordResetEmail.as_view()),
    path('forgot-password/password-reset/', views.ResetPassword.as_view()),
    path('account/', views.Account.as_view()),
    path('account/<int:pk>/update/', views.Account.as_view()),
    path('account/<int:pk>/delete/', views.Account.as_view()),
    path('account/translation-history/', views.TranslationHistoryList.as_view()),
    path('account/<int:pk>/translation-history/save/', views.TranslationHistoryList.as_view()),
    path('account/<int:pk>/translation-history/delete/', views.DeleteTranslationHistory.as_view()),
]