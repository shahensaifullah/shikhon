from django.contrib.auth.base_user import BaseUserManager
from rest_framework.exceptions import ValidationError

from .utils import normalize_bd_phone


class UserManager(BaseUserManager):
    use_in_migrations = True

    def get_by_natural_key(self, phone_number):
        """Allow Django authentication forms to accept local or E.164 BD numbers."""
        try:
            normalized = normalize_bd_phone(phone_number)
        except ValidationError as error:
            raise self.model.DoesNotExist from error
        return self.get(**{self.model.USERNAME_FIELD: normalized})

    def create_user(self, phone_number, password=None, **extra_fields):
        if not phone_number:
            raise ValueError('A phone number is required.')
        user = self.model(phone_number=normalize_bd_phone(phone_number), **extra_fields)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save(using=self._db)
        return user

    def create_superuser(self, phone_number, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('is_phone_verified', True)
        extra_fields.setdefault('role', 'admin')
        if not extra_fields.get('is_staff') or not extra_fields.get('is_superuser'):
            raise ValueError('A superuser must have is_staff and is_superuser enabled.')
        return self.create_user(phone_number, password=password, **extra_fields)
