from .i18n import DEFAULT_LANGUAGE, normalize_language


class ApiLanguageMiddleware:
    """Expose a normalized ``request.lang`` on every Django/DRF request."""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        request.lang = normalize_language(request.GET.get('lang', DEFAULT_LANGUAGE))
        return self.get_response(request)
