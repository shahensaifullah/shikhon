"""Project-wide, request-aware translation registry."""

from importlib import import_module

from django.apps import apps

DEFAULT_LANGUAGE = 'ban'
SUPPORTED_LANGUAGES = ('ban', 'en')
LANGUAGE_ALIASES = {
    'ban': 'ban',
    'bn': 'ban',
    'en': 'en',
    'eng': 'en',
}

_catalogs = {}


def normalize_language(value):
    """Normalize frontend/query language codes to ``ban`` or ``en``."""
    return LANGUAGE_ALIASES.get(str(value or '').lower(), DEFAULT_LANGUAGE)


def register_translations(namespace, translations):
    """Validate and register one Django app's translation catalogue."""
    languages = set(translations)
    expected_languages = set(SUPPORTED_LANGUAGES)
    if languages != expected_languages:
        raise RuntimeError(
            f'{namespace!r} translations must define {expected_languages}; got {languages}.'
        )

    bangla_keys = set(translations['ban'])
    english_keys = set(translations['en'])
    if bangla_keys != english_keys:
        raise RuntimeError(
            f'{namespace!r} translation keys do not match. '
            f'Missing in en: {bangla_keys - english_keys}; '
            f'missing in ban: {english_keys - bangla_keys}.'
        )
    _catalogs[namespace] = translations


def autodiscover_translations():
    """Register ``<installed_app>.translations.TRANSLATIONS`` automatically."""
    for app_config in apps.get_app_configs():
        module_name = f'{app_config.name}.translations'
        try:
            module = import_module(module_name)
        except ModuleNotFoundError as error:
            if error.name != module_name:
                raise
            continue
        translations = getattr(module, 'TRANSLATIONS', None)
        if translations is not None:
            register_translations(app_config.label, translations)


def translate(request, variable_name, **values):
    """Return a translated variable such as ``accounts.otp_sent``."""
    namespace, separator, key = variable_name.partition('.')
    if not separator:
        matches = [name for name, catalog in _catalogs.items() if variable_name in catalog['ban']]
        if len(matches) != 1:
            reason = 'not found' if not matches else f'ambiguous across {matches}'
            raise KeyError(f'Translation variable {variable_name!r} is {reason}. Use app_name.variable_name.')
        namespace, key = matches[0], variable_name

    try:
        template = _catalogs[namespace][normalize_language(getattr(request, 'lang', None))][key]
    except KeyError as error:
        raise KeyError(f'Unknown translation variable: {variable_name!r}') from error
    return template.format(**values)


t = translate
