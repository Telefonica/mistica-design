# sesame_ai/models.py

class BaseResponse:
    """Base class for API responses"""
    
    def __init__(self, response_json):
        """
        Initialize with raw JSON response
        
        Args:
            response_json (dict): Raw JSON response from API
        """
        self.raw_response = response_json
    
    def __repr__(self):
        """String representation of the response object"""
        class_name = self.__class__.__name__
        attributes = ', '.join(f"{k}={v}" for k, v in self.__dict__.items() 
                              if k != 'raw_response' and not k.startswith('_'))
        return f"{class_name}({attributes})"



class SignupResponse(BaseResponse):
    """Response from the signup endpoint"""
    
    def __init__(self, response_json):
        """
        Initialize with signup response data
        
        Args:
            response_json (dict): Raw JSON response from API
        """
        super().__init__(response_json)
        self.kind = response_json.get('kind')
        self.id_token = response_json.get('idToken')
        self.refresh_token = response_json.get('refreshToken')
        self.expires_in = response_json.get('expiresIn')
        self.local_id = response_json.get('localId')

class RefreshTokenResponse(BaseResponse):
    """Response from the token refresh endpoint"""
    
    def __init__(self, response_json):
        """
        Initialize with refresh token response data
        
        Args:
            response_json (dict): Raw JSON response from API
        """
        super().__init__(response_json)
        self.access_token = response_json.get('access_token')
        self.expires_in = response_json.get('expires_in')
        self.token_type = response_json.get('token_type')
        self.refresh_token = response_json.get('refresh_token')
        self.id_token = response_json.get('id_token')
        self.user_id = response_json.get('user_id')
        self.project_id = response_json.get('project_id')

class LookupResponse(BaseResponse):
    """Response from the account lookup endpoint"""
    
    def __init__(self, response_json):
        """
        Initialize with lookup response data
        
        Args:
            response_json (dict): Raw JSON response from API
        """
        super().__init__(response_json)
        self.kind = response_json.get('kind')
        
        # Extract users data if available
        users = response_json.get('users', [])
        if users and len(users) > 0:
            user = users[0]
            self.local_id = user.get('localId')
            self.last_login_at = user.get('lastLoginAt')
            self.created_at = user.get('createdAt')
            self.last_refresh_at = user.get('lastRefreshAt')