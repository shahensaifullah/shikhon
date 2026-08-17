from .i18n import translate


class LocalizedSerializerMixin:
    """Give DRF serializers the same request-aware translation API."""

    @property
    def request(self):
        return self.context.get('request')

    def msg(self, variable_name, **values):
        return translate(self.request, variable_name, **values)
