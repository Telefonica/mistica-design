# sesame_ai/config.py

import json
import base64
from datetime import datetime

# Default Firebase API key
DEFAULT_API_KEY = "AIzaSyDtC7Uwb5pGAsdmrH2T4Gqdk5Mga07jYPM"

# API endpoints
FIREBASE_AUTH_BASE_URL = "https://identitytoolkit.googleapis.com/v1/accounts"
FIREBASE_TOKEN_URL = "https://securetoken.googleapis.com/v1/token"

def get_firebase_client_header():
    """
    Generate the x-firebase-client header value
    
    Returns:
        str: Base64 encoded Firebase client info
    """
    x_firebase_client = {
        "version": 2,
        "heartbeats": [
            {
                "agent": "fire-core/0.11.1 fire-core-esm2017/0.11.1 fire-js/ fire-js-all-app/11.3.1 fire-auth/1.9.0 fire-auth-esm2017/1.9.0",
                "dates": [f"{datetime.now().strftime('%Y-%m-%d')}"]
            }
        ]
    }
    x_firebase_client_json = json.dumps(x_firebase_client, separators=(",", ":"))
    return base64.b64encode(x_firebase_client_json.encode()).decode()

def get_user_agent():
    """
    Get the standard user agent string
    
    Returns:
        str: User agent string
    """
    return 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36'

def get_headers(request_type):
    """
    Get headers for API requests
    
    Args:
        request_type (str): Type of request ('signup', 'lookup', 'refresh', etc.)
        
    Returns:
        dict: Headers for the request
    """
    common_headers = {
        'accept': '*/*',
        'accept-language': 'en-US,en;q=0.9',
        'content-type': 'application/json',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
        'x-firebase-client': get_firebase_client_header(),
        'x-client-data': 'COKQywE=',
        'x-client-version': 'Chrome/JsCore/11.3.1/FirebaseCore-web',
        'x-firebase-gmpid': '1:1072000975600:web:75b0bf3a9bb8d92e767835',
    }

    # Add request-specific headers if needed
    if request_type == 'signup':
        return common_headers
    elif request_type == 'lookup':
        return common_headers
    elif request_type == 'refresh':
        return common_headers
    else:
        return common_headers

def get_params(request_type, api_key=None):
    """
    Get URL parameters for API requests
    
    Args:
        request_type (str): Type of request ('signup', 'lookup', 'refresh', etc.)
        api_key (str, optional): API key to use. If None, uses default key.
        
    Returns:
        dict: URL parameters for the request
    """
    # Use provided API key or fall back to default
    key = api_key if api_key else DEFAULT_API_KEY
    
    common_params = {
        'key': key,
    }
    
    # Add request-specific parameters if needed
    if request_type == 'signup':
        return common_params
    elif request_type == 'lookup':
        return common_params
    elif request_type == 'refresh':
        return common_params
    else:
        return common_params

def get_endpoint_url(request_type):
    """
    Get the full URL for a specific request type
    
    Args:
        request_type (str): Type of request ('signup', 'lookup', 'refresh', etc.)
        
    Returns:
        str: Full URL for the request
    """
    if request_type == 'refresh':
        return FIREBASE_TOKEN_URL
    else:
        endpoint = 'signUp' if request_type == 'signup' else request_type
        return f"{FIREBASE_AUTH_BASE_URL}:{endpoint}"