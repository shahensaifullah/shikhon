import uuid

from django.conf import settings
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.utils import timezone

from .managers import UserManager


class User(AbstractBaseUser, PermissionsMixin):
    class Role(models.TextChoices):
        STUDENT = 'student', 'Student'
        PARENT = 'parent', 'Parent'
        TEACHER = 'teacher', 'Teacher'
        ADMIN = 'admin', 'Admin'

    class SubscriptionTier(models.TextChoices):
        FREE = 'free', 'Free'
        PREMIUM = 'premium', 'Premium'
        INSTITUTION = 'institution', 'Institution'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    phone_number = models.CharField(max_length=14, unique=True, db_index=True)
    full_name = models.CharField(max_length=150)
    address = models.TextField(blank=True)
    role = models.CharField(max_length=16, choices=Role.choices, default=Role.STUDENT, db_index=True)
    registration_details = models.JSONField(default=dict, blank=True)
    is_phone_verified = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    subscription_tier = models.CharField(max_length=20, choices=SubscriptionTier.choices, default=SubscriptionTier.FREE)
    subscription_expires_at = models.DateTimeField(null=True, blank=True)

    objects = UserManager()

    USERNAME_FIELD = 'phone_number'
    REQUIRED_FIELDS = ['full_name']

    class Meta:
        ordering = ('-date_joined',)

    def __str__(self):
        return f'{self.full_name or "User"} ({self.phone_number})'

    @property
    def has_active_subscription(self):
        return self.subscription_tier != self.SubscriptionTier.FREE and (
            self.subscription_expires_at is None or self.subscription_expires_at > timezone.now()
        )


class PhoneOTP(models.Model):
    class Purpose(models.TextChoices):
        LOGIN = 'login', 'Login'
        REGISTER = 'register', 'Register'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    phone_number = models.CharField(max_length=14, db_index=True)
    code_hash = models.CharField(max_length=128)
    purpose = models.CharField(max_length=12, choices=Purpose.choices)
    expires_at = models.DateTimeField(db_index=True)
    attempts = models.PositiveSmallIntegerField(default=0)
    consumed_at = models.DateTimeField(null=True, blank=True)
    requested_ip = models.GenericIPAddressField(null=True, blank=True)
    registration_data = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ('-created_at',)
        indexes = [models.Index(fields=('phone_number', 'purpose', 'created_at'))]

    @property
    def is_valid(self):
        return self.consumed_at is None and self.expires_at > timezone.now() and self.attempts < settings.OTP_MAX_ATTEMPTS

    def __str__(self):
        return f'{self.phone_number} · {self.purpose}'
