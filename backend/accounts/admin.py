from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin

from .models import PhoneOTP, User


@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    ordering = ('-date_joined',)
    list_display = ('phone_number', 'full_name', 'role', 'is_phone_verified', 'subscription_tier', 'is_active')
    list_filter = ('role', 'is_phone_verified', 'subscription_tier', 'is_active')
    search_fields = ('phone_number', 'full_name')
    readonly_fields = ('date_joined', 'updated_at', 'last_login')
    fieldsets = (
        (None, {'fields': ('phone_number', 'password')}),
        ('Profile', {'fields': ('full_name', 'address', 'role', 'registration_details')}),
        ('Subscription', {'fields': ('subscription_tier', 'subscription_expires_at')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined', 'updated_at')}),
    )
    add_fieldsets = ((None, {'classes': ('wide',), 'fields': ('phone_number', 'full_name', 'role', 'is_staff', 'is_superuser')}),)


@admin.register(PhoneOTP)
class PhoneOTPAdmin(admin.ModelAdmin):
    list_display = ('phone_number', 'purpose', 'created_at', 'expires_at', 'attempts', 'consumed_at')
    list_filter = ('purpose', 'created_at', 'consumed_at')
    search_fields = ('phone_number',)
    readonly_fields = ('code_hash', 'created_at')
