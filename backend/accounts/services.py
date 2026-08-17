import json
import secrets
from urllib.error import URLError
from urllib.request import Request, urlopen

from django.conf import settings
from django.contrib.auth.hashers import make_password
from django.utils import timezone

from .models import PhoneOTP
from .exceptions import OTPServiceError


def generate_otp() -> str:
    return f'{secrets.randbelow(1_000_000):06d}'


def issue_phone_otp(*, phone_number: str, purpose: str, requested_ip: str | None, registration_data=None):
    """Create one active OTP and deliver it through the configured provider."""
    code = generate_otp() if settings.OTP_PROVIDER_ENABLED else settings.DEVELOPMENT_OTP
    PhoneOTP.objects.filter(
        phone_number=phone_number,
        purpose=purpose,
        consumed_at__isnull=True,
    ).update(consumed_at=timezone.now())
    otp = PhoneOTP.objects.create(
        phone_number=phone_number,
        purpose=purpose,
        code_hash=make_password(code),
        expires_at=timezone.now() + timezone.timedelta(seconds=settings.OTP_EXPIRY_SECONDS),
        requested_ip=requested_ip,
        registration_data=registration_data or {},
    )
    try:
        send_otp(phone_number, code)
    except RuntimeError:
        otp.delete()
        raise
    otp.development_code = code if settings.DEBUG and settings.ALLOW_DEVELOPMENT_OTP else None
    return otp


def send_otp(phone_number: str, code: str) -> None:
    if not settings.OTP_PROVIDER_ENABLED:
        if not settings.ALLOW_DEVELOPMENT_OTP:
            raise OTPServiceError('provider_disabled')
        return
    if not settings.OTP_PROVIDER_URL or not settings.OTP_PROVIDER_API_KEY:
        raise OTPServiceError('provider_config')
    payload = json.dumps({'phone_number': phone_number, 'code': code, 'expires_in': settings.OTP_EXPIRY_SECONDS}).encode()
    request = Request(
        settings.OTP_PROVIDER_URL,
        data=payload,
        headers={'Authorization': f'Bearer {settings.OTP_PROVIDER_API_KEY}', 'Content-Type': 'application/json'},
        method='POST',
    )
    try:
        with urlopen(request, timeout=8) as response:
            if response.status >= 300:
                raise OTPServiceError('provider_rejected')
    except URLError as error:
        raise OTPServiceError('provider_unavailable') from error
