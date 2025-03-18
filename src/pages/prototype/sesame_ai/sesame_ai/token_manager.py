# sesame_ai/token_manager.py

import os
import json
import time
import logging
from .api import SesameAI
from .exceptions import InvalidTokenError, NetworkError, APIError

logger = logging.getLogger('sesame.token_manager')

class TokenManager:
    """
    Manages authentication tokens for SesameAI API
    
    Handles:
    - Token storage and retrieval
    - Token validation
    - Automatic token refresh
    """
    
    def __init__(self, api_client=None, token_file=None):
        """
        Initialize the token manager
        
        Args:
            api_client (SesameAI, optional): API client instance. If None, creates a new one.
            token_file (str, optional): Path to token storage file.
        """
        self.api_client = api_client if api_client else SesameAI()
        self.token_file = token_file if token_file else None
        self.tokens = self._load_tokens()
    
    def _load_tokens(self):
        """
        Load tokens from storage file
        
        Returns:
            dict: Token data or empty dict if file doesn't exist
        """
        if self.token_file and os.path.exists(self.token_file):
            try:
                with open(self.token_file, 'r') as f:
                    logger.debug(f"Loading tokens from {self.token_file}")
                    return json.load(f)
            except (json.JSONDecodeError, IOError) as e:
                logger.warning(f"Failed to load tokens: {e}")
                return {}
        return {}
    
    def _save_tokens(self):
        """Save tokens to storage file"""
        try:
            # If no token file is specified, return early
            if self.token_file is None:
                return
                
            # Make sure the directory exists
            directory = os.path.dirname(self.token_file)
            if directory:  # Only try to create directory if there is one
                os.makedirs(directory, exist_ok=True)
            
            # Write the tokens to the file
            with open(self.token_file, 'w') as f:
                logger.debug(f"Saving tokens to {self.token_file}")
                json.dump(self.tokens, f)
                logger.debug(f"Tokens successfully saved to {self.token_file}")
        except Exception as e:
            logger.warning(f"Could not save tokens: {e}", exc_info=True)
    
    def _is_token_expired(self, id_token):
        """
        Check if an ID token is expired
        
        Args:
            id_token (str): Firebase ID token
            
        Returns:
            bool: True if token is expired or invalid
        """
        try:
            # Try to look up the token
            self.api_client.get_account_info(id_token)
            return False
        except InvalidTokenError:
            return True
        except (NetworkError, APIError) as e:
            # If lookup fails, raise the error
            raise e
    
    def get_valid_token(self, force_new=False):
        """
        Get a valid ID token, refreshing if necessary
        
        Args:
            force_new (bool): If True, creates a new account regardless of existing tokens
            
        Returns:
            str: Valid ID token
            
        Raises:
            InvalidTokenError: If token refresh fails
            NetworkError: If a network error occurs
            APIError: If the API returns an error
        """
        # If force_new is True, create a new account
        if force_new:
            logger.debug("Forcing creation of new account")
            return self._create_new_account()
            
        # Check if we have an existing ID token
        id_token = self.tokens.get('id_token')
        refresh_token = self.tokens.get('refresh_token')
        
        if id_token:
            # Check if the token is still valid
            try:
                logger.debug("Checking if existing token is valid")
                if not self._is_token_expired(id_token):
                    logger.info("Using existing valid token")
                    return id_token
            except (NetworkError, APIError) as e:
                logger.warning(f"Error checking token validity: {e}")
                # If we can't check, assume it's still valid
                return id_token
            
            # Token is expired, try to refresh
            if refresh_token:
                try:
                    logger.info("Refreshing expired token")
                    refresh_response = self.api_client.refresh_authentication_token(refresh_token)
                    
                    # Update tokens
                    self.tokens = {
                        'id_token': refresh_response.id_token,
                        'refresh_token': refresh_response.refresh_token,
                        'user_id': refresh_response.user_id,
                        'expires_in': refresh_response.expires_in,
                        'timestamp': int(time.time())
                    }
                    self._save_tokens()
                    
                    logger.info("Token refreshed successfully")
                    return refresh_response.id_token
                except (InvalidTokenError, NetworkError, APIError) as e:
                    logger.error(f"Token refresh failed: {e}")
                    raise InvalidTokenError("Token refresh failed")
            else:
                logger.warning("Token expired and no refresh token available")
                raise InvalidTokenError("Token expired and no refresh token available")
        else:
            # No existing token, create a new account
            logger.debug("No existing token, creating new account")
            return self._create_new_account()

    def _create_new_account(self):
        """
        Create a new anonymous account
        
        Returns:
            str: New ID token
            
        Raises:
            NetworkError: If a network error occurs
            APIError: If the API returns an error
        """
        logger.debug("Creating new anonymous account")
        signup_response = self.api_client.create_anonymous_account()
        
        # Save the new tokens
        self.tokens = {
            'id_token': signup_response.id_token,
            'refresh_token': signup_response.refresh_token,
            'user_id': signup_response.local_id,
            'expires_in': signup_response.expires_in,
            'timestamp': int(time.time())
        }
        self._save_tokens()
        
        logger.debug("New account created successfully")
        return signup_response.id_token

    def clear_tokens(self):
        """Clear stored tokens"""
        logger.info("Clearing stored tokens")
        self.tokens = {}
        self._save_tokens()