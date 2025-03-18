# sesame_ai/websocket.py

import json
import base64
import uuid
import ssl
import urllib.parse
import threading
import queue
import time
import logging
import websocket as websocket_module

logger = logging.getLogger('sesame.websocket')

class SesameWebSocket:
    """
    WebSocket client for real-time communication with SesameAI
    """
    
    def __init__(self, id_token, character="Miles", client_name="RP-Web"):
        """
        Initialize the WebSocket client
        
        Args:
            id_token (str): Firebase ID token for authentication
            character (str, optional): Character to interact with. Defaults to "Miles".
            client_name (str, optional): Client identifier. Defaults to "RP-Web".
        """
        self.id_token = id_token
        self.character = character
        self.client_name = client_name
        
        # WebSocket connection
        self.ws = None
        self.session_id = None
        self.call_id = None
        
        # Audio settings
        self.client_sample_rate = 16000
        self.server_sample_rate = 24000  # Default, will be updated from server
        self.audio_codec = "none"
        
        # Connection state
        self.reconnect = False
        self.is_private = False
        self.user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36"
        
        # Audio buffer for received audio
        self.audio_buffer = queue.Queue(maxsize=1000)
        
        # Message tracking
        self.last_sent_message_type = None
        self.received_since_last_sent = False
        self.first_audio_received = False
        
        # Event for tracking connection state
        self.connected_event = threading.Event()
        
        # Callbacks
        self.on_connect_callback = None
        self.on_disconnect_callback = None
    
    def connect(self, blocking=True):
        """
        Connect to the SesameAI WebSocket server
        
        Args:
            blocking (bool, optional): If True, blocks until connected. Defaults to True.
            
        Returns:
            bool: True if connection was successful
        """
        # Reset connection state
        self.connected_event.clear()
        
        # Start connection in a separate thread
        connection_thread = threading.Thread(target=self._connect_websocket)
        connection_thread.daemon = True
        connection_thread.start()
        
        if blocking:
            # Wait for connection to be established
            return self.connected_event.wait(timeout=10)
        
        return True
    
    def _connect_websocket(self):
        """Internal method to establish WebSocket connection"""
        headers = {
            'Origin': 'https://www.sesame.com',
            'User-Agent': self.user_agent,
        }

        params = {
            'id_token': self.id_token,
            'client_name': self.client_name,
            'usercontext': json.dumps({"timezone": "America/Chicago"}),
            'character': self.character,
        }

        # Construct the WebSocket URL with query parameters
        base_url = 'wss://sesameai.app/agent-service-0/v1/connect'
        
        # Convert params to URL query string
        query_string = '&'.join([f"{key}={urllib.parse.quote(value)}" for key, value in params.items()])
        ws_url = f"{base_url}?{query_string}"
        
        # Create WebSocket connection
        self.ws = websocket_module.WebSocketApp(
            ws_url,
            header=headers,
            on_open=self._on_open,
            on_message=self._on_message,
            on_error=self._on_error,
            on_close=self._on_close
        )

        # Run the WebSocket
        self.ws.run_forever(
            sslopt={"cert_reqs": ssl.CERT_NONE}, 
            skip_utf8_validation=True,
            suppress_origin=False
        )
    
    def _on_open(self, ws):
        """Callback when WebSocket connection is opened"""
        logger.debug("WebSocket connection opened")
    
    def _on_message(self, ws, message):
        """Callback when a message is received from the WebSocket"""
        try:
            # Parse the message as JSON
            data = json.loads(message)
            
            # Handle different message types
            message_type = data.get('type')
            
            if message_type == 'initialize':
                self._handle_initialize(data)
            elif message_type == 'call_connect_response':
                self._handle_call_connect_response(data)
            elif message_type == 'ping_response':
                self._handle_ping_response(data)
            elif message_type == 'audio':
                self._handle_audio(data)
            elif message_type == 'call_disconnect_response':
                self._handle_call_disconnect_response(data)
            else:
                logger.debug(f"Received message type: {message_type}")
                
        except json.JSONDecodeError:
            logger.warning(f"Received non-JSON message: {message}")
        except Exception as e:
            logger.error(f"Error handling message: {e}", exc_info=True)
    
    def _on_error(self, ws, error):
            """Callback when a WebSocket error occurs"""
            logger.error(f"WebSocket error: {error}")
            self.connected_event.clear()
    
    def _on_close(self, ws, close_status_code, close_msg):
        """Callback when the WebSocket connection is closed"""
        logger.debug(f"WebSocket closed: {close_status_code} - {close_msg}")
        self.connected_event.clear()
        
        # Call the disconnect callback if set
        if self.on_disconnect_callback:
            self.on_disconnect_callback()
    
    # Message handlers
    def _handle_initialize(self, data):
        """Handle initialize message from server"""
        self.session_id = data.get('session_id')
        logger.debug(f"Session ID: {self.session_id}")

        # Send location and call_connect
        self._send_client_location_state()
        self._send_call_connect()
    
    def _handle_call_connect_response(self, data):
        """Handle call_connect_response message from server"""
        self.session_id = data.get('session_id')
        self.call_id = data.get('call_id')
        content = data.get('content', {})
        self.server_sample_rate = content.get('sample_rate', self.server_sample_rate)
        self.audio_codec = content.get('audio_codec', 'none')

        logger.debug(f"Connected: Session ID: {self.session_id}, Call ID: {self.call_id}")
        
        # Signal that we're connected
        self.connected_event.set()
        
        # Call the connect callback if set
        if self.on_connect_callback:
            self.on_connect_callback()
    
    
    def _handle_ping_response(self, data):
        """Handle ping_response message from server"""
        pass
    
    def _handle_audio(self, data):
        """Handle audio message from server"""
        audio_data = data.get('content', {}).get('audio_data', '')
        if audio_data:
            try:
                audio_bytes = base64.b64decode(audio_data)
                # Use put_nowait to avoid blocking if buffer is full
                # This prevents audio processing delays
                try:
                    self.audio_buffer.put_nowait(audio_bytes)
                except queue.Full:
                    # If buffer is full, discard oldest audio to make room
                    try:
                        self.audio_buffer.get_nowait()
                        self.audio_buffer.put_nowait(audio_bytes)
                    except queue.Empty:
                        pass
                
                if not self.first_audio_received:
                    self.first_audio_received = True
                    logger.debug("First audio received, sending initialization chunks")
                    # Send 2 all-A chunks to initialize audio stream
                    chunk_of_As = "A" * 1707 + "="
                    self._send_audio(chunk_of_As)
                    self._send_audio(chunk_of_As)
            except Exception as e:
                logger.error(f"Error processing audio: {e}", exc_info=True)
    
    def _handle_call_disconnect_response(self, data):
        """Handle call_disconnect_response message from server"""
        logger.debug("Call disconnected")
        self.call_id = None
        
        # Call the disconnect callback if set
        if self.on_disconnect_callback:
            self.on_disconnect_callback()
    
    # Methods to send messages
    def _send_ping(self):
        """Send ping message to server"""
        if not self.session_id:
            return

        message = {
            "type": "ping",
            "session_id": self.session_id,
            "call_id": self.call_id,
            "request_id": self._generate_request_id(),
            "content": "ping"
        }

        self._send_data(message)
    
    def _send_client_location_state(self):
        """Send client_location_state message to server"""
        if not self.session_id:
            return

        message = {
            "type": "client_location_state",
            "session_id": self.session_id,
            "call_id": None,
            "content": {
                "latitude": 0,
                "longitude": 0,
                "address": "",
                "timezone": "America/Chicago"
            }
        }
        self._send_data(message)
    
    def _send_audio(self, data):
        """
        Send audio data to server
        
        Args:
            data (str): Base64-encoded audio data
        """
        if not self.session_id or not self.call_id:
            return

        message = {
            "type": "audio",
            "session_id": self.session_id,
            "call_id": self.call_id,
            "content": {
                "audio_data": data
            }
        }

        self._send_data(message)
    
    def _send_call_connect(self):
        """Send call_connect message to server"""
        if not self.session_id:
            return
            
        message = {
            "type": "call_connect",
            "session_id": self.session_id,
            "call_id": None,
            "request_id": self._generate_request_id(),
            "content": {
                "sample_rate": self.client_sample_rate,
                "audio_codec": "none",
                "reconnect": self.reconnect,
                "is_private": self.is_private,
                "client_name": self.client_name,
                "settings": {
                    "preset": f"{self.character}"
                },
                "client_metadata": {
                    "language": "en-US",
                    "user_agent": self.user_agent,
                    "mobile_browser": False,
                    "media_devices": self._get_media_devices()
                }
            }
        }
        
        self._send_data(message)
    
    def send_audio_data(self, raw_audio_bytes):
        """
        Send raw audio data to the AI
        
        Args:
            raw_audio_bytes (bytes): Raw audio data (16-bit PCM)
            
        Returns:
            bool: True if audio was sent successfully
        """
        if not self.session_id or not self.call_id:
            return False
            
        # Encode the raw audio data in base64
        encoded_data = base64.b64encode(raw_audio_bytes).decode('utf-8')
        self._send_audio(encoded_data)
        return True
    
    def disconnect(self):
        """
        Disconnect from the server
        
        Returns:
            bool: True if disconnect message was sent successfully
        """
        if not self.session_id or not self.call_id:
            logger.warning("Cannot disconnect: Not connected")
            return False
            
        message = {
            "type": "call_disconnect",
            "session_id": self.session_id,
            "call_id": self.call_id,
            "request_id": self._generate_request_id(),
            "content": {
                "reason": "user_request"
            }
        }
        
        logger.debug("Sending disconnect request")
        self._send_data(message)
        return True
    
    def _send_message(self, message):
        """Send a raw message to the WebSocket"""
        if self.ws and self.ws.sock and self.ws.sock.connected:
            message_str = json.dumps(message)
            self.ws.send(message_str)
            return True
        else:
            logger.warning("WebSocket is not connected")
            return False
    
    def _send_data(self, message):
        """Send data with proper ping handling"""
        try:
            data_type = message.get("type")

            # Send pings for non-control messages after connection is established
            if self.call_id is not None and data_type not in ["ping", "call_connect", "call_disconnect"]:
                if (self.last_sent_message_type is None 
                    or self.received_since_last_sent 
                    or (data_type != self.last_sent_message_type)):
                    self._send_ping()
                    
                self.last_sent_message_type = data_type
                self.received_since_last_sent = False

            return self._send_message(message)
            
        except Exception as e:
            logger.error(f"Error sending data: {e}", exc_info=True)
            return False
    
    def _generate_request_id(self):
        """Generate a unique request ID"""
        return str(uuid.uuid4())
    
    def _get_media_devices(self):
        """Get a list of media devices for the client metadata"""
        # Simplified version - in a real implementation, this would detect actual devices
        return [
            {
                "deviceId": "default",
                "kind": "audioinput",
                "label": "Default - Microphone",
                "groupId": "default"
            },
            {
                "deviceId": "default",
                "kind": "audiooutput",
                "label": "Default - Speaker",
                "groupId": "default"
            }
        ]
    
    def get_next_audio_chunk(self, timeout=None):
        """
        Get the next audio chunk from the buffer
        
        Args:
            timeout (float, optional): Timeout in seconds. None means block indefinitely.
            
        Returns:
            bytes: Audio data, or None if timeout occurred
        """
        try:
            return self.audio_buffer.get(timeout=timeout)
        except queue.Empty:
            return None
    
    def set_connect_callback(self, callback):
        """
        Set callback for connection established events
        
        Args:
            callback (callable): Function with no arguments
        """
        self.on_connect_callback = callback
    
    def set_disconnect_callback(self, callback):
        """
        Set callback for disconnection events
        
        Args:
            callback (callable): Function with no arguments
        """
        self.on_disconnect_callback = callback
    
    def is_connected(self):
        """
        Check if the WebSocket is connected
        
        Returns:
            bool: True if connected
        """
        return self.session_id is not None and self.call_id is not None