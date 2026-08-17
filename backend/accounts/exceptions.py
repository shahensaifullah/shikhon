class OTPServiceError(RuntimeError):
    def __init__(self, message_key):
        self.message_key = message_key
        super().__init__(message_key)
