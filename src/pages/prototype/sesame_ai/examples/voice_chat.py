# examples/voice_chat.py


"""
SesameAI Voice Chat Example

This example demonstrates how to use the SesameAI API for real-time voice conversations.
It handles:
- Authentication
- WebSocket connection
- Microphone input
- Speaker output
- Voice activity detection
- Graceful disconnection

Available characters:
- Miles (default)
- Maya
"""

import sys
import os
import time
import threading
import argparse
import queue
import logging
import numpy as np
import pyaudio
from sesame_ai import SesameAI, SesameWebSocket, TokenManager, InvalidTokenError, NetworkError, APIError

logger = logging.getLogger('sesame.examples.voice_chat')

class VoiceChat:
    """Voice chat application using SesameAI"""
    
    # Available characters
    AVAILABLE_CHARACTERS = ["Miles", "Maya"]
    
    def __init__(self, character="Miles", input_device=None, output_device=None, 
                 token_file=None):
        """
        Initialize the voice chat application
        
        Args:
            character (str): Character to chat with ("Miles" or "Maya")
            input_device (int, optional): Input device index
            output_device (int, optional): Output device index
            use_saved_token (bool): Whether to use a saved token
            force_new_token (bool): Whether to force creation of a new token
            token_file (str, optional): Path to token storage file. If None, tokens won't be saved.
        """
        # Validate character
        if character not in self.AVAILABLE_CHARACTERS:
            print(f"Warning: '{character}' is not in the list of known characters. Using anyway.")
            print(f"Known characters: {', '.join(self.AVAILABLE_CHARACTERS)}")
            
        self.character = character
        self.input_device_index = input_device
        self.output_device_index = output_device
        self.token_file = token_file
        
        # Audio settings
        self.chunk_size = 1024
        self.sample_format = pyaudio.paInt16
        self.channels = 1
        self.input_rate = 16000
        self.output_rate = 24000  # Will be updated from server
        
        # Voice activity detection
        self.amplitude_threshold = 500
        self.silence_counter = 0
        self.silence_limit = 50  # Number of consecutive silent chunks before sending silence
        
        # PyAudio instance
        self.p = pyaudio.PyAudio()
        
        # Streams
        self.input_stream = None
        self.output_stream = None
        
        # SesameAI client
        self.api_client = SesameAI()
        
        # Initialize token manager with token_file (which may be None)
        self.token_manager = TokenManager(self.api_client, token_file=self.token_file)
        
        self.id_token = None
        self.ws = None
        
        # Thread control
        self.running = False
        self.threads = []

        # Logging
        logger.debug(f"VoiceChat initialized with character: {character}")
    
    def authenticate(self):
        """Authenticate with SesameAI and get a token"""
        logger.info("Authenticating with SesameAI...")
        try:
            # If no token file is specified, force a new token
            force_new = self.token_file is None
            
            # Get a valid token using the token manager
            self.id_token = self.token_manager.get_valid_token(force_new=force_new)
            logger.info("Authentication successful!")
            return True
        except InvalidTokenError:
            logger.error("Authentication failed: Token expired and couldn't be refreshed")
            return False
        except (NetworkError, APIError) as e:
            logger.error(f"Authentication failed: {e}")
            return False
        
    def list_audio_devices(self):
        """List available audio devices"""
        logger.info("Listing available audio devices")
        print("\nAvailable audio devices:")
        print("-" * 60)
        
        for i in range(self.p.get_device_count()):
            dev_info = self.p.get_device_info_by_index(i)
            name = dev_info.get('name', 'Unknown')
            inputs = dev_info.get('maxInputChannels', 0)
            outputs = dev_info.get('maxOutputChannels', 0)
            
            if inputs > 0:
                print(f"ID {i}: {name} (Input)")
            if outputs > 0:
                print(f"ID {i}: {name} (Output)")
        
        print("-" * 60)
    
    def select_devices(self):
        """Select input and output devices"""
        self.list_audio_devices()
        
        # If devices weren't specified in constructor, ask user
        if self.input_device_index is None:
            try:
                self.input_device_index = int(input("Select input device ID: "))
                logger.debug(f"Selected input device ID: {self.input_device_index}")
            except ValueError:
                logger.warning("Invalid input. Using default device.")
                self.input_device_index = None
        
        if self.output_device_index is None:
            try:
                self.output_device_index = int(input("Select output device ID: "))
                logger.debug(f"Selected output device ID: {self.output_device_index}")
            except ValueError:
                logger.warning("Invalid input. Using default device.")
                self.output_device_index = None
    
    def on_connect(self):
        """Callback when WebSocket connection is established"""
        logger.info(f"Connected to {self.character}!")
        # Update output rate from server
        self.output_rate = self.ws.server_sample_rate
        logger.debug(f"Server sample rate: {self.output_rate}")
        
        # Initialize audio streams after connection
        self.setup_audio_streams()
        
        # Start audio threads
        self.start_audio_threads()
    
    def on_disconnect(self):
        """Callback when WebSocket connection is disconnected"""
        logger.info(f"Disconnected from {self.character}")
        
        # Stop the application if it's still running
        if self.running:
            self.stop()
    
    def connect(self):
        """Connect to SesameAI WebSocket"""
        logger.info(f"Connecting to SesameAI as character '{self.character}'...")
        
        # Create WebSocket client
        self.ws = SesameWebSocket(
            id_token=self.id_token,
            character=self.character
        )
        
        # Set up callbacks
        self.ws.set_connect_callback(self.on_connect)
        self.ws.set_disconnect_callback(self.on_disconnect)
        
        # Connect to server
        if self.ws.connect():
            logger.debug("WebSocket connection established")
            return True
        else:
            logger.error("Failed to connect to SesameAI")
            return False
    
    def setup_audio_streams(self):
        """Set up audio input and output streams"""
        logger.debug("Setting up audio streams")
        
        # Input stream (microphone)
        self.input_stream = self.p.open(
            format=self.sample_format,
            channels=self.channels,
            rate=self.input_rate,
            input=True,
            frames_per_buffer=self.chunk_size,
            input_device_index=self.input_device_index
        )
        
        # Output stream (speaker)
        self.output_stream = self.p.open(
            format=self.sample_format,
            channels=self.channels,
            rate=self.output_rate,
            output=True,
            output_device_index=self.output_device_index
        )
        
        logger.debug("Audio streams initialized")
    
    def capture_microphone(self):
        """Capture audio from microphone and send to SesameAI"""
        logger.debug("Microphone capture started")
        
        while self.running:
            if not self.ws.is_connected():
                time.sleep(0.1)
                continue
            
            try:
                # Read audio data from microphone
                data = self.input_stream.read(self.chunk_size, exception_on_overflow=False)
                
                # Check audio level for voice activity detection
                audio_samples = np.frombuffer(data, dtype=np.int16)
                rms_val = np.sqrt(np.mean(audio_samples.astype(np.float32) ** 2))
                
                if rms_val > self.amplitude_threshold:
                    # Voice detected
                    self.silence_counter = 0
                    self.ws.send_audio_data(data)
                else:
                    # Silence detected
                    self.silence_counter += 1
                    if self.silence_counter >= self.silence_limit:
                        # Send completely silent audio after silence threshold
                        # This is more efficient than sending the actual low-level audio
                        silent_data = np.zeros(self.chunk_size, dtype=np.int16).tobytes()
                        self.ws.send_audio_data(silent_data)
                    else:
                        # Continue sending actual audio during brief pauses
                        self.ws.send_audio_data(data)
            except Exception as e:
                if self.running:
                    logger.error(f"Error capturing microphone: {e}", exc_info=True)
                    time.sleep(0.1)
    
    def play_audio(self):
        """Play audio received from SesameAI"""
        logger.debug("Audio playback started")
        
        while self.running:
            try:
                # Get audio chunk from WebSocket buffer with a short timeout
                audio_chunk = self.ws.get_next_audio_chunk(timeout=0.01)
                if audio_chunk:
                    # Play audio immediately when received
                    self.output_stream.write(audio_chunk)
            except Exception as e:
                if self.running:
                    logger.error(f"Error playing audio: {e}", exc_info=True)
    
    def start_audio_threads(self):
        """Start audio capture and playback threads"""
        # Microphone capture thread
        mic_thread = threading.Thread(target=self.capture_microphone)
        mic_thread.daemon = True
        mic_thread.start()
        self.threads.append(mic_thread)
        
        # Audio playback thread
        playback_thread = threading.Thread(target=self.play_audio)
        playback_thread.daemon = True
        playback_thread.start()
        self.threads.append(playback_thread)
        
        logger.debug("Audio threads started")
    
    def start(self):
        """Start the voice chat"""
        # Authenticate
        if not self.authenticate():
            return False
        
        # Select audio devices
        self.select_devices()
        
        # Set running flag
        self.running = True
        
        # Connect to WebSocket (will trigger on_connect callback)
        if not self.connect():
            self.running = False
            return False
        
        logger.info(f"Voice chat with {self.character} started! Press Ctrl+C to exit.")
        return True
    
    def stop(self):
        """Stop the voice chat"""
        if not self.running:
            return
        
        self.running = False
        logger.info("Stopping voice chat...")
        
        # Disconnect from WebSocket
        if self.ws and self.ws.is_connected():
            self.ws.disconnect()
        
        # Close audio streams
        if self.input_stream:
            self.input_stream.stop_stream()
            self.input_stream.close()
        
        if self.output_stream:
            self.output_stream.stop_stream()
            self.output_stream.close()
        
        # Terminate PyAudio
        self.p.terminate()
        
        logger.info("Voice chat stopped")
    
    def run(self):
        """Run the voice chat application"""
        try:
            if self.start():
                # Keep main thread alive
                while self.running:
                    time.sleep(0.1)
        except KeyboardInterrupt:
            logger.debug("Interrupted by user")
        finally:
            self.stop()



def main():
    """Main function"""
    # Configure logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )

    # Set websocket-client logger to DEBUG level
    logging.getLogger('websocket').setLevel(logging.WARNING)
    
    parser = argparse.ArgumentParser(description="SesameAI Voice Chat Example")
    parser.add_argument("--character", default="Miles", choices=VoiceChat.AVAILABLE_CHARACTERS,
                    help=f"Character to chat with (default: Miles, options: {', '.join(VoiceChat.AVAILABLE_CHARACTERS)})")
    parser.add_argument("--input-device", type=int, help="Input device index")
    parser.add_argument("--output-device", type=int, help="Output device index")
    parser.add_argument("--list-devices", action="store_true", help="List audio devices and exit")
    parser.add_argument("--token-file", help="Path to token storage file")
    parser.add_argument("--debug", action="store_true", help="Enable debug logging")
    
    args = parser.parse_args()
    
    # Set debug level if requested
    if args.debug:
        logging.getLogger('sesame').setLevel(logging.DEBUG)
    
    # Create voice chat instance
    voice_chat = VoiceChat(
        character=args.character,
        input_device=args.input_device,
        output_device=args.output_device,
        token_file=args.token_file
    )
    
    # List devices and exit if requested
    if args.list_devices:
        voice_chat.list_audio_devices()
        return
    
    # Run the voice chat
    voice_chat.run()

if __name__ == "__main__":
    main()