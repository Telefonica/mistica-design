# sesame_ai/api.py

import requests
from .config import get_headers, get_params, get_endpoint_url
from .models import SignupResponse, LookupResponse, RefreshTokenResponse
from .exceptions import APIError, InvalidTokenError, NetworkError

class SesameAI:
    """
    SesameAI API Client - Unofficial Python client for the SesameAI API
    
    Provides authentication and account management functionality for SesameAI services.
    """
    
    def __init__(self, api_key=None):
        """
        Initialize the SesameAI API client
        
        Args:
            api_key (str, optional): Firebase API key. If not provided, 
                                     will use the default key from config.
        """
        self.api_key = api_key
    
    def _make_auth_request(self, request_type, payload, is_form_data=False):
        """
        Make a request to the Firebase Authentication API
        
        Args:
            request_type (str): Type of request ('signup', 'lookup', etc.)
            payload (dict): Request payload
            is_form_data (bool): Whether payload should be sent as form data
            
        Returns:
            dict: API response as JSON
            
        Raises:
            NetworkError: If a network error occurs
            APIError: If the API returns an error response
            InvalidTokenError: If a token is invalid
        """
        headers = get_headers(request_type)
        params = get_params(request_type, self.api_key)
        url = get_endpoint_url(request_type)
        
        try:
            if is_form_data:
                response = requests.post(
                    url,
                    params=params,
                    headers=headers,
                    data=payload,
                )
            else:
                response = requests.post(
                    url,
                    params=params,
                    headers=headers,
                    json=payload,
                )
            
            # Check for HTTP errors
            response.raise_for_status()
            
            # Parse the response
            response_json = response.json()
            
            # Check for API errors
            if 'error' in response_json:
                self._handle_api_error(response_json['error'])
                
            return response_json
            
        except requests.exceptions.RequestException as e:
            raise NetworkError(f"Network error: {str(e)}")
    
    def _handle_api_error(self, error):
        """
        Handle API error responses
        
        Args:
            error (dict): Error information from API
            
        Raises:
            InvalidTokenError: If a token is invalid
            APIError: For other API errors
        """
        error_code = error.get('code', 400)
        error_message = error.get('message', 'Unknown error')
        error_details = error.get('errors', [])
        
        # Handle specific error types
        if error_message in ('INVALID_ID_TOKEN', 'INVALID_REFRESH_TOKEN'):
            raise InvalidTokenError()
        
        # Generic API error
        raise APIError(error_code, error_message, error_details)
    
    def create_anonymous_account(self):
        """
        Create an anonymous account
        
        Returns:
            SignupResponse: Object containing authentication tokens
            
        Raises:
            NetworkError: If a network error occurs
            APIError: If the API returns an error response
        """
        payload = {
            'returnSecureToken': True,
        }
        response_json = self._make_auth_request('signup', payload)
        return SignupResponse(response_json)
    
    def refresh_authentication_token(self, refresh_token):
        """
        Refresh an ID token using a refresh token
        
        Args:
            refresh_token (str): Firebase refresh token
            
        Returns:
            RefreshTokenResponse: Object containing new tokens
            
        Raises:
            NetworkError: If a network error occurs
            APIError: If the API returns an error response
            InvalidTokenError: If the refresh token is invalid
        """
        payload = {
            'grant_type': 'refresh_token',
            'refresh_token': refresh_token
        }
        
        response_json = self._make_auth_request('refresh', payload, is_form_data=True)
        return RefreshTokenResponse(response_json)
        
    def get_account_info(self, id_token):
        """
        Get account information using an ID token
        
        Args:
            id_token (str): Firebase ID token
            
        Returns:
            LookupResponse: Object containing account information
            
        Raises:
            NetworkError: If a network error occurs
            APIError: If the API returns an error response
            InvalidTokenError: If the ID token is invalid
        """
        payload = {
            'idToken': id_token
        }
        
        response_json = self._make_auth_request('lookup', payload)
        return LookupResponse(response_json)
    