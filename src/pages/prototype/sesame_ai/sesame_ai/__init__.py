# sesame_ai/__init__.py

from .api import SesameAI
from .websocket import SesameWebSocket
from .exceptions import SesameAIError, AuthenticationError, APIError, InvalidTokenError, NetworkError
from .models import SignupResponse, LookupResponse, RefreshTokenResponse
from .token_manager import TokenManager


__version__ = "0.1.0"
__author__ = "ijub"
__license__ = "MIT"

# Export public classes and functions
__all__ = [
    'SesameAI',
    'SesameWebSocket',
    'TokenManager',
    'SesameAIError',
    'AuthenticationError',
    'APIError',
    'InvalidTokenError',
    'NetworkError',
    'SignupResponse',
    'LookupResponse',
    'RefreshTokenResponse',
]