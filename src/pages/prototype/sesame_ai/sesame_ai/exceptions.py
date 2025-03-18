# sesame_ai/exceptions.py

class SesameAIError(Exception):
    """Base exception for SesameAI API errors"""
    pass


class AuthenticationError(SesameAIError):
    """Raised when authentication fails (invalid tokens, etc.)"""
    pass


class APIError(SesameAIError):
    """Raised when the API returns an error response"""
    
    def __init__(self, code, message, errors=None):
        """
        Initialize with error details
        
        Args:
            code (int): Error code
            message (str): Error message
            errors (list, optional): Detailed error information
        """
        self.code = code
        self.message = message
        self.errors = errors or []
        super().__init__(f"API Error {code}: {message}")


class InvalidTokenError(AuthenticationError):
    """Raised when an ID token is invalid or expired"""
    
    def __init__(self):
        super().__init__("Invalid or expired ID token")


class NetworkError(SesameAIError):
    """Raised when network communication fails"""
    pass