from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    path('languages/', views.LanguageList.as_view()),
    path('translation/', views.Translation.as_view()),
    path('token/refresh/', TokenRefreshView.as_view()),
    path('signup/', views.SignUp.as_view()),
    path('authenticate/', views.Authenticate.as_view()),
    path('account/', views.Account.as_view()),
    path('account/update/<int:pk>/', views.Account.as_view()),
    path('account/delete/<int:pk>/', views.Account.as_view()),
]