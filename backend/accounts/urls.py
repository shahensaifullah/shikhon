from django.urls import path

from .views import CurrentUserView, LogoutView, RefreshAccessTokenView, RegisterView, RequestOTPView, VerifyOTPView


app_name = 'accounts'

urlpatterns = [
    path('/auth/register', RegisterView.as_view(), name='register'),
    path('/auth/otp/request', RequestOTPView.as_view(), name='otp-request'),
    path('/auth/otp/verify', VerifyOTPView.as_view(), name='otp-verify'),
    path('/auth/refresh', RefreshAccessTokenView.as_view(), name='token-refresh'),
    path('/auth/logout', LogoutView.as_view(), name='logout'),
    path('/me', CurrentUserView.as_view(), name='me'),
]
