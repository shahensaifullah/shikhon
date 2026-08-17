from django.conf import settings
from django.contrib.auth.hashers import check_password
from django.db import transaction
from django.utils import timezone
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from .models import PhoneOTP, User
from .services import issue_phone_otp
from .utils import normalize_bd_phone
from shared.serializers import LocalizedSerializerMixin
from .exceptions import OTPServiceError


class UserSerializer(serializers.ModelSerializer):
    has_active_subscription = serializers.BooleanField(read_only=True)
    can_access_admin = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'phone_number', 'full_name', 'address', 'role', 'registration_details', 'subscription_tier', 'subscription_expires_at', 'has_active_subscription', 'can_access_admin')
        read_only_fields = (
            'id',
            'phone_number',
            'role',
            'registration_details',
            'subscription_tier',
            'subscription_expires_at',
            'has_active_subscription',
            'can_access_admin',
        )

    def get_can_access_admin(self, obj) -> bool:
        return bool(obj.is_staff or obj.role == User.Role.ADMIN)


class RegisterSerializer(LocalizedSerializerMixin, serializers.Serializer):
    phone_number = serializers.CharField(max_length=20)
    full_name = serializers.CharField(max_length=150, trim_whitespace=True)
    address = serializers.CharField(required=False, allow_blank=True, trim_whitespace=True)

    def validate_phone_number(self, value):
        phone_number = normalize_bd_phone(value, self.request)
        if User.objects.filter(phone_number=phone_number).exists():
            raise serializers.ValidationError(self.msg('accounts.account_exists'))
        return phone_number

    def create(self, validated_data):
        try:
            return issue_phone_otp(
                phone_number=validated_data['phone_number'],
                purpose=PhoneOTP.Purpose.REGISTER,
                requested_ip=self.context['request'].META.get('REMOTE_ADDR'),
                registration_data={
                    'full_name': validated_data['full_name'],
                    'address': validated_data.get('address', ''),
                },
            )
        except OTPServiceError as error:
            raise serializers.ValidationError({'detail': self.msg(f'accounts.{error.message_key}')}) from error


class RequestOTPSerializer(LocalizedSerializerMixin, serializers.Serializer):
    phone_number = serializers.CharField(max_length=20)

    def validate_phone_number(self, value):
        phone_number = normalize_bd_phone(value, self.request)
        login_ready = User.objects.filter(
            phone_number=phone_number,
            is_active=True,
            is_phone_verified=True,
        ).exists()
        if not login_ready:
            raise serializers.ValidationError(self.msg('accounts.account_missing'))
        return phone_number

    def create(self, validated_data):
        try:
            return issue_phone_otp(
                phone_number=validated_data['phone_number'],
                purpose=PhoneOTP.Purpose.LOGIN,
                requested_ip=self.context['request'].META.get('REMOTE_ADDR'),
            )
        except OTPServiceError as error:
            raise serializers.ValidationError({'detail': self.msg(f'accounts.{error.message_key}')}) from error


class VerifyOTPSerializer(LocalizedSerializerMixin, serializers.Serializer):
    phone_number = serializers.CharField(max_length=20)
    code = serializers.RegexField(r'^\d{6}$')
    purpose = serializers.ChoiceField(choices=PhoneOTP.Purpose.choices)

    def validate_phone_number(self, value):
        return normalize_bd_phone(value, self.request)

    def validate(self, attrs):
        otp = PhoneOTP.objects.filter(
            phone_number=attrs['phone_number'], purpose=attrs['purpose'], consumed_at__isnull=True
        ).order_by('-created_at').first()
        if not otp or not otp.is_valid:
            raise serializers.ValidationError({'code': self.msg('accounts.otp_expired')})
        if not check_password(attrs['code'], otp.code_hash):
            otp.attempts += 1
            otp.save(update_fields=('attempts',))
            remaining = max(settings.OTP_MAX_ATTEMPTS - otp.attempts, 0)
            raise serializers.ValidationError({'code': self.msg('accounts.otp_wrong', remaining=remaining)})
        attrs['otp'] = otp
        return attrs

    @transaction.atomic
    def create(self, validated_data):
        submitted_otp = validated_data.pop('otp')
        otp = PhoneOTP.objects.select_for_update().get(pk=submitted_otp.pk)
        if not otp.is_valid:
            raise serializers.ValidationError({'code': self.msg('accounts.otp_consumed')})
        purpose = validated_data.pop('purpose')
        phone_number = validated_data.pop('phone_number')
        validated_data.pop('code')
        if purpose == PhoneOTP.Purpose.REGISTER:
            user = User.objects.create_user(
                phone_number=phone_number,
                is_phone_verified=True,
                **otp.registration_data,
            )
        else:
            user = User.objects.get(phone_number=phone_number, is_active=True, is_phone_verified=True)
        otp.consumed_at = timezone.now()
        otp.save(update_fields=('consumed_at',))
        user.last_login = timezone.now()
        user.save(update_fields=('last_login',))
        refresh = RefreshToken.for_user(user)
        return {'user': user, 'access': str(refresh.access_token), 'refresh': str(refresh)}


class LogoutSerializer(LocalizedSerializerMixin, serializers.Serializer):
    refresh = serializers.CharField()

    def save(self, **kwargs):
        try:
            RefreshToken(self.validated_data['refresh']).blacklist()
        except Exception as error:
            raise serializers.ValidationError({'refresh': self.msg('accounts.refresh_invalid')}) from error
