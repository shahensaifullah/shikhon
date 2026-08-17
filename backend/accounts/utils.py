import re

from rest_framework.exceptions import ValidationError
from shared.i18n import translate


BD_PHONE_PATTERN = re.compile(r'^\+8801[3-9]\d{8}$')


def normalize_bd_phone(value: str, request=None) -> str:
    digits = re.sub(r'\D', '', value or '')
    if digits.startswith('880'):
        normalized = f'+{digits}'
    elif digits.startswith('01'):
        normalized = f'+88{digits}'
    elif digits.startswith('1') and len(digits) == 10:
        normalized = f'+880{digits}'
    else:
        normalized = f'+{digits}'
    if not BD_PHONE_PATTERN.fullmatch(normalized):
        raise ValidationError(translate(request, 'accounts.invalid_phone'))
    return normalized
