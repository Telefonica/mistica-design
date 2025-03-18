from sesame_ai import SesameAI, TokenManager

# Create API client
client = SesameAI()

# Create an anonymous account
signup_response = client.create_anonymous_account()
print(f"ID Token: {signup_response.id_token}")

# Look up account information
lookup_response = client.get_account_info(signup_response.id_token)
print(f"User ID: {lookup_response.local_id}")

# For easier token management, use TokenManager
token_manager = TokenManager(client, token_file="token.json")
id_token = token_manager.get_valid_token()