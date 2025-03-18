# Sesame AI Python Client

An unofficial Python client library for interacting with the [Sesame](https://www.sesame.com) voice conversation API. This package provides easy access to Sesame's voice-based AI characters, allowing developers to create applications with natural voice conversations.

## About Sesame

Sesame is developing conversational AI with "voice presence" - the quality that makes spoken interactions feel real, understood, and valued. Their technology enables voice conversations with AI characters like Miles and Maya that feature emotional intelligence, natural conversational dynamics, and contextual awareness.

## Support

If you find this project helpful, consider buying me a coffee!

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-Support-yellow.svg)](https://buymeacoffee.com/ijub)

## Installation

```bash
# From GitHub
pip install git+https://github.com/ijub/sesame_ai.git

# For development
git clone https://github.com/ijub/sesame_ai.git
cd sesame_ai
pip install -e .
```

## Features

- Authentication and account management
- WebSocket-based real-time voice conversations
- Token management and refresh
- Support for multiple AI characters (Miles, Maya)
- Voice activity detection
- Simple and intuitive API

## Available Characters

The API supports multiple AI characters:

- **Miles**: A male character (default)
- **Maya**: A female character

## Quick Start

### Authentication

```python
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
```

### Voice Chat Example

```python
from sesame_ai import SesameAI, SesameWebSocket, TokenManager
import pyaudio
import threading
import time
import numpy as np

# Get authentication token using TokenManager
api_client = SesameAI()
token_manager = TokenManager(api_client, token_file="token.json")
id_token = token_manager.get_valid_token()

# Connect to WebSocket (choose character: "Miles" or "Maya")
ws = SesameWebSocket(id_token=id_token, character="Maya")

# Set up connection callbacks
def on_connect():
    print("Connected to SesameAI!")

def on_disconnect():
    print("Disconnected from SesameAI")

ws.set_connect_callback(on_connect)
ws.set_disconnect_callback(on_disconnect)

# Connect to the server
ws.connect()

# Audio settings
CHUNK = 1024
FORMAT = pyaudio.paInt16
CHANNELS = 1
RATE = 16000

# Initialize PyAudio
p = pyaudio.PyAudio()

# Open microphone stream
mic_stream = p.open(format=FORMAT,
                    channels=CHANNELS,
                    rate=RATE,
                    input=True,
                    frames_per_buffer=CHUNK)

# Open speaker stream (using server's sample rate)
speaker_stream = p.open(format=FORMAT,
                        channels=CHANNELS,
                        rate=ws.server_sample_rate,
                        output=True)

# Function to capture and send microphone audio
def capture_microphone():
    print("Microphone capture started...")
    try:
        while True:
            if ws.is_connected():
                data = mic_stream.read(CHUNK, exception_on_overflow=False)
                ws.send_audio_data(data)
            else:
                time.sleep(0.1)
    except KeyboardInterrupt:
        print("Microphone capture stopped")

# Function to play received audio
def play_audio():
    print("Audio playback started...")
    try:
        while True:
            audio_chunk = ws.get_next_audio_chunk(timeout=0.01)
            if audio_chunk:
                speaker_stream.write(audio_chunk)
    except KeyboardInterrupt:
        print("Audio playback stopped")

# Start audio threads
mic_thread = threading.Thread(target=capture_microphone)
mic_thread.daemon = True
mic_thread.start()

playback_thread = threading.Thread(target=play_audio)
playback_thread.daemon = True
playback_thread.start()

# Keep the main thread alive
try:
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    print("Disconnecting...")
    ws.disconnect()
    mic_stream.stop_stream()
    mic_stream.close()
    speaker_stream.stop_stream()
    speaker_stream.close()
    p.terminate()
```

The package also includes a full-featured voice chat example that you can run:

```bash
# Chat with Miles (default)
python examples/voice_chat.py

# Chat with Maya
python examples/voice_chat.py --character Maya
```

Command-line options:
- `--character`: Character to chat with (default: Miles, options: Miles, Maya)
- `--input-device`: Input device index
- `--output-device`: Output device index
- `--list-devices`: List audio devices and exit
- `--token-file`: Path to token storage file
- `--debug`: Enable debug logging

## API Reference

### SesameAI

The main API client for authentication.

- `SesameAI(api_key=None)` - Create a new API client
- `create_anonymous_account()` - Create an anonymous account
- `get_account_info(id_token)` - Look up account information
- `refresh_authentication_token(refresh_token)` - Refresh an ID token

### TokenManager

Manages authentication tokens with automatic refresh and persistence.

- `TokenManager(api_client=None, token_file=None)` - Create a token manager
- `get_valid_token(force_new=False)` - Get a valid token, refreshing if needed
- `clear_tokens()` - Clear stored tokens

### SesameWebSocket

WebSocket client for real-time voice conversation.

- `SesameWebSocket(id_token, character="Miles", client_name="RP-Web")` - Create a new WebSocket client
- `connect(blocking=True)` - Connect to the server
- `send_audio_data(raw_audio_bytes)` - Send raw audio data
- `get_next_audio_chunk(timeout=None)` - Get the next audio chunk
- `disconnect()` - Disconnect from the server
- `is_connected()` - Check if connected

## Error Handling

The library provides several exception classes for error handling:

- `SesameAIError` - Base exception class
- `InvalidTokenError` - Invalid token errors
- `APIError` - API errors with code and message
- `NetworkError` - Network communication errors

Example:

```python
from sesame_ai import SesameAI, InvalidTokenError, APIError, NetworkError

client = SesameAI()

try:
    # Try to use an invalid token
    client.get_account_info("invalid_token")
except InvalidTokenError:
    print("The token is invalid or expired")
except APIError as e:
    print(f"API error: {e.code} - {e.message}")
except NetworkError as e:
    print(f"Network error: {e}")
```

## Troubleshooting

### Audio Device Problems

If you encounter audio device issues:

1. Use `--list-devices` to see available audio devices
2. Specify input/output devices with `--input-device` and `--output-device`
3. Ensure PyAudio is properly installed with all dependencies

### Audio Feedback Issues

Currently, the voice chat example doesn't block audio coming from the AI (through your speakers) from being picked up by your microphone, which can cause feedback loops. For the best experience:

1. Use headphones to prevent the AI from hearing itself
2. Keep speaker volume at a moderate level
3. Position your microphone away from speakers if not using headphones

**Note:** I'm working on updating the `voice_chat.py` example to implement echo cancellation and audio filtering to address this issue in a future update.

### Connection Issues

If you have trouble connecting:

1. Check your internet connection
2. Verify your authentication token is valid
3. Ensure the SesameAI service is available

## Legal Disclaimer

This is an unofficial API wrapper and is not affiliated with, maintained, authorized, endorsed, or sponsored by Sesame. or any of its affiliates. This wrapper is intended for personal, educational, and non-commercial use only.

Users of this library assume all legal responsibility for its use. The author(s) are not responsible for any violations of Sesame Terms of Service or applicable laws.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you find this project helpful, consider buying me a coffee!

<a href="https://buymeacoffee.com/ijub" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>