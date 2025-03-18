import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Stack,
  Text1,
  Text2,
  Text3,
  Circle,
  IconMicrophoneRegular,
  IconMuteRegular,
  IconButton,
  skinVars,
  Spinner,
} from "@telefonica/mistica";
import io from "socket.io-client";

/**
 * SesameAIWebSocket component for voice assistant integration
 *
 * This component integrates with the SesameAI voice assistant through WebSockets
 * to provide a conversational interface for recommending internet fiber plans.
 */
const SesameAIWebSocket = ({
  onResponse,
  onConversationStart,
  onConversationEnd,
  character = "Maya",
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [assistantResponse, setAssistantResponse] = useState("");
  const [error, setError] = useState(null);

  // Reference to store the WebSocket connection
  const socketRef = useRef(null);
  const audioContextRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioQueueRef = useRef([]);
  const isPlayingRef = useRef(false);

  // Mock plans data (will be replaced with real data from the assistant)
  const fiberPlans = [
    {
      id: "plan1",
      title: "Fibra 600 Mb y 2 líneas móviles 35 GB",
      price: "52,90 €/mes",
      description: "Velocidad simétrica, sin permanencia",
    },
    {
      id: "plan2",
      title: "Fibra 1 Gb y 2 líneas móviles ilimitadas",
      price: "64,90 €/mes",
      description: "Máxima velocidad, sin permanencia",
    },
    {
      id: "plan3",
      title: "Fibra 300 Mb y 1 línea móvil 25 GB",
      price: "42,90 €/mes",
      description: "Ideal para uso individual, sin permanencia",
    },
  ];

  // Initialize audio context
  const initAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext ||
        window.webkitAudioContext)();
    }
  };

  // Function to play audio
  const playAudio = async (audioData) => {
    if (!audioContextRef.current) return;

    // Add to queue
    audioQueueRef.current.push(audioData);

    // If not already playing, start playing
    if (!isPlayingRef.current) {
      playNextInQueue();
    }
  };

  // Play next audio in queue
  const playNextInQueue = async () => {
    if (audioQueueRef.current.length === 0) {
      isPlayingRef.current = false;
      return;
    }

    isPlayingRef.current = true;
    const audioData = audioQueueRef.current.shift();

    try {
      // Convert base64 to ArrayBuffer
      const binaryString = atob(audioData);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Decode audio data
      const audioBuffer = await audioContextRef.current.decodeAudioData(
        bytes.buffer
      );

      // Play audio
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);
      source.onended = playNextInQueue;
      source.start(0);
    } catch (err) {
      console.error("Error playing audio:", err);
      playNextInQueue(); // Skip to next audio if there's an error
    }
  };

  // Function to start recording audio
  const startRecording = async () => {
    try {
      // Get microphone access
      mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      // Create media recorder
      mediaRecorderRef.current = new MediaRecorder(mediaStreamRef.current);
      audioChunksRef.current = [];

      // Set up event handlers
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        // Convert audio chunks to blob
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        audioChunksRef.current = [];

        // Convert blob to base64
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64data = reader.result.split(",")[1];
          // Send audio to server
          if (socketRef.current) {
            socketRef.current.emit("send_audio", { audio: base64data });
          }
        };
      };

      // Start recording
      mediaRecorderRef.current.start(100); // Collect data every 100ms
    } catch (err) {
      console.error("Error starting recording:", err);
      setError(
        "No se pudo acceder al micrófono. Por favor, verifica los permisos."
      );
    }
  };

  // Function to stop recording
  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
    }
  };

  // Function to handle starting the conversation
  const startConversation = () => {
    setIsConnecting(true);
    setError(null);

    // Initialize audio context (needs to be triggered by user action)
    initAudioContext();

    // Connect to WebSocket server
    const socket = io("http://localhost:5000");
    socketRef.current = socket;

    // Set up event handlers
    socket.on("connect", () => {
      console.log("Connected to server");
      socket.emit("start_conversation", { character });
    });

    socket.on("connect_error", (err) => {
      console.error("Connection error:", err);
      setError(
        "Error de conexión con el servidor. Por favor, inténtalo de nuevo."
      );
      setIsConnecting(false);
    });

    socket.on("sesame_connected", (data) => {
      console.log("Connected to SesameAI:", data);
      setIsConnecting(false);
      setIsListening(true);
      startRecording();

      // Initial greeting
      const greeting = `Hola, soy ${character} de Movistar. ¿En qué puedo ayudarte hoy? Puedo recomendarte planes de fibra óptica según tus necesidades.`;
      setAssistantResponse(greeting);

      // Notify parent component
      if (onConversationStart) {
        onConversationStart();
      }
    });

    socket.on("audio_data", (data) => {
      // Play audio received from server
      playAudio(data.audio);

      // For demo purposes, simulate text responses based on audio
      // In a real implementation, you would get text transcriptions from the server
      setTimeout(() => {
        // Randomly select a response type
        const responseType = Math.floor(Math.random() * 5);
        let response = "";
        let plans = [];

        switch (responseType) {
          case 0:
            response = `Hola, soy ${character} de Movistar. ¿En qué puedo ayudarte hoy? Puedo recomendarte planes de fibra óptica según tus necesidades.`;
            break;
          case 1:
            response =
              "Tenemos excelentes planes de fibra óptica. Te muestro algunas opciones que podrían interesarte:";
            plans = fiberPlans;
            break;
          case 2:
            response =
              "Nuestro plan más rápido es el de Fibra 1 Gb con líneas móviles ilimitadas:";
            plans = [fiberPlans[1]];
            break;
          case 3:
            response = "Te recomiendo nuestro plan más económico:";
            plans = [fiberPlans[2]];
            break;
          case 4:
            response =
              "Para familias, recomiendo nuestros planes con múltiples líneas móviles:";
            plans = [fiberPlans[0], fiberPlans[1]];
            break;
          default:
            response = "¿Hay algo más en lo que pueda ayudarte?";
        }

        setAssistantResponse(response);

        // Send plans to parent component if available
        if (plans.length > 0 && onResponse) {
          onResponse(plans);
        }
      }, 500);
    });

    socket.on("error", (data) => {
      console.error("Server error:", data);
      setError(data.message || "Error en el servidor");
    });

    socket.on("sesame_disconnected", () => {
      console.log("Disconnected from SesameAI");
      endConversation();
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
      endConversation();
    });
  };

  // Function to handle ending the conversation
  const endConversation = () => {
    // Stop recording
    stopRecording();

    // Disconnect from server
    if (socketRef.current) {
      socketRef.current.emit("end_conversation");
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    setIsListening(false);
    setTranscript("");
    setIsConnecting(false);

    // Notify parent component
    if (onConversationEnd) {
      onConversationEnd();
    }
  };

  // Function to handle user input (text input as fallback)
  const handleUserInput = (e) => {
    e.preventDefault();
    if (transcript.trim() === "") return;

    // Send text input to server (for demo purposes)
    // In a real implementation, you would use the microphone input
    setTranscript("");
  };

  // Auto-start conversation when component mounts
  useEffect(() => {
    startConversation();

    // Cleanup function
    return () => {
      endConversation();
    };
  }, []);

  // Function to handle plan selection feedback
  const handlePlanSelected = (plan) => {
    const response = `Has seleccionado el plan ${plan.title} por ${plan.price}. ¡Excelente elección! Este plan incluye ${plan.description}. ¿Deseas proceder con la contratación o tienes alguna otra pregunta?`;
    setAssistantResponse(response);
  };

  // This function would be called from the parent component when a plan is selected
  useEffect(() => {
    // Create a function that can be called from the parent
    window.handlePlanSelectionFromParent = (plan) => {
      handlePlanSelected(plan);
    };

    // Cleanup
    return () => {
      delete window.handlePlanSelectionFromParent;
    };
  }, []);

  return (
    <Box>
      <Stack space={24}>
        {/* Assistant avatar and response */}
        <Box>
          <Stack space={16}>
            <Box>
              <Circle
                size={64}
                backgroundColor={skinVars.colors.brandLow}
                border
              >
                {isConnecting ? (
                  <Spinner size={32} />
                ) : (
                  <Text1 color={skinVars.colors.brand}>
                    {character.charAt(0)}
                  </Text1>
                )}
              </Circle>
            </Box>

            {assistantResponse && (
              <Box
                padding={16}
                borderRadius={8}
                backgroundColor={skinVars.colors.backgroundBrand}
              >
                <Text2>{assistantResponse}</Text2>
              </Box>
            )}

            {error && (
              <Box
                padding={16}
                borderRadius={8}
                backgroundColor={skinVars.colors.backgroundError}
              >
                <Text3 color={skinVars.colors.textError}>{error}</Text3>
              </Box>
            )}
          </Stack>
        </Box>

        {/* User input area */}
        <Box>
          <form onSubmit={handleUserInput}>
            <Stack space={16}>
              <Box
                padding={16}
                borderRadius={8}
                backgroundColor={skinVars.colors.backgroundAlternative}
              >
                <input
                  type="text"
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  placeholder="Escribe tu mensaje aquí..."
                  style={{
                    width: "100%",
                    border: "none",
                    background: "transparent",
                    outline: "none",
                    fontSize: "16px",
                  }}
                  disabled={!isListening || isConnecting}
                />
              </Box>

              <Box>
                <IconButton
                  Icon={isListening ? IconMicrophoneRegular : IconMuteRegular}
                  aria-label={
                    isListening ? "Micrófono activo" : "Micrófono inactivo"
                  }
                  type={isListening ? "brand" : "secondary"}
                  onClick={isListening ? endConversation : startConversation}
                  disabled={isConnecting}
                />
              </Box>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Box>
  );
};

export default SesameAIWebSocket;
