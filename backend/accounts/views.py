from django.conf import settings
from rest_framework import generics, permissions, status
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.serializers import TokenRefreshSerializer

from .serializers import LogoutSerializer, RegisterSerializer, RequestOTPSerializer, UserSerializer, VerifyOTPSerializer
from shared.i18n import translate


def set_refresh_cookie(response, refresh_token):
    response.set_cookie(
        key=settings.REFRESH_COOKIE_NAME,
        value=refresh_token,
        max_age=int(settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds()),
        httponly=True,
        secure=settings.REFRESH_COOKIE_SECURE,
        samesite=settings.REFRESH_COOKIE_SAMESITE,
        path=settings.REFRESH_COOKIE_PATH,
        domain=settings.REFRESH_COOKIE_DOMAIN,
    )


def clear_refresh_cookie(response):
    response.delete_cookie(
        key=settings.REFRESH_COOKIE_NAME,
        path=settings.REFRESH_COOKIE_PATH,
        domain=settings.REFRESH_COOKIE_DOMAIN,
        samesite=settings.REFRESH_COOKIE_SAMESITE,
    )


class RequestOTPView(generics.CreateAPIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = RequestOTPSerializer
    throttle_scope = 'otp_request'

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        otp = serializer.save()
        payload = {'detail': translate(request, 'accounts.otp_sent'), 'expires_in': settings.OTP_EXPIRY_SECONDS}
        if getattr(otp, 'development_code', None):
            payload['development_code'] = otp.development_code
        return Response(payload, status=status.HTTP_201_CREATED)


class RegisterView(generics.CreateAPIView):
    """Validate registration details and send a registration OTP."""
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer
    throttle_scope = 'otp_request'

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        otp = serializer.save()
        response_payload = {'detail': translate(request, 'accounts.otp_sent'), 'expires_in': settings.OTP_EXPIRY_SECONDS}
        if getattr(otp, 'development_code', None):
            response_payload['development_code'] = otp.development_code
        return Response(response_payload, status=status.HTTP_201_CREATED)


class VerifyOTPView(generics.CreateAPIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = VerifyOTPSerializer
    throttle_scope = 'otp_verify'

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        result = serializer.save()
        response = Response({
            'access': result['access'],
            'access_expires_in': int(settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds()),
            'user': UserSerializer(result['user']).data,
        })
        set_refresh_cookie(response, result['refresh'])
        return response


class RefreshAccessTokenView(generics.GenericAPIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def post(self, request):
        refresh_token = request.COOKIES.get(settings.REFRESH_COOKIE_NAME)
        if not refresh_token:
            return Response(
                {'detail': translate(request, 'accounts.refresh_missing'), 'code': 'token_not_valid'},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        serializer = TokenRefreshSerializer(data={'refresh': refresh_token})
        try:
            serializer.is_valid(raise_exception=True)
        except TokenError:
            response = Response(
                {'detail': translate(request, 'accounts.refresh_invalid'), 'code': 'token_not_valid'},
                status=status.HTTP_401_UNAUTHORIZED,
            )
            clear_refresh_cookie(response)
            return response
        response = Response({
            'access': serializer.validated_data['access'],
            'access_expires_in': int(settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds()),
        })
        if 'refresh' in serializer.validated_data:
            set_refresh_cookie(response, serializer.validated_data['refresh'])
        return response


class CurrentUserView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class LogoutView(generics.GenericAPIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def post(self, request):
        refresh_token = request.COOKIES.get(settings.REFRESH_COOKIE_NAME)
        if refresh_token:
            serializer = LogoutSerializer(data={'refresh': refresh_token}, context={'request': request})
            serializer.is_valid(raise_exception=True)
            try:
                serializer.save()
            except ValidationError:
                pass
        response = Response(status=status.HTTP_204_NO_CONTENT)
        clear_refresh_cookie(response)
        return response
