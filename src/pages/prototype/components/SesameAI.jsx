import React, { useState, useEffect } from "react";
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

/**
 * SesameAI component for voice assistant integration
 *
 * This is a simplified version that uses REST API instead of WebSockets
 */
const SesameAI = ({
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

  // Server URL (replace with your API endpoint)
  const API_URL = "http://localhost:5000/api";

  // Function to handle starting the conversation
  const startConversation = () => {
    setIsConnecting(true);
    setError(null);

    // Fetch welcome message from the server
    fetch(`${API_URL}/welcome`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error de conexión con el servidor");
        }
        return response.json();
      })
      .then((data) => {
        // Show welcome message
        setAssistantResponse(data.text);
        setIsConnecting(false);
        setIsListening(true);

        // Send plans to parent component if available
        if (data.plans && data.plans.length > 0 && onResponse) {
          onResponse(data.plans);
        }

        // Notify parent component
        if (onConversationStart) {
          onConversationStart();
        }
      })
      .catch((err) => {
        console.error("Error:", err);
        setError(
          "Error de conexión con el servidor. Por favor, inténtalo de nuevo."
        );
        setIsConnecting(false);
      });
  };

  // Function to handle ending the conversation
  const endConversation = () => {
    setIsListening(false);
    setTranscript("");

    // Notify parent component
    if (onConversationEnd) {
      onConversationEnd();
    }
  };

  // Function to handle user input
  const handleUserInput = (e) => {
    e.preventDefault();
    if (transcript.trim() === "") return;

    // Send user input to server
    fetch(`${API_URL}/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: transcript }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al procesar la consulta");
        }
        return response.json();
      })
      .then((data) => {
        // Show response
        setAssistantResponse(data.text);

        // Send plans to parent component if available
        if (data.plans && data.plans.length > 0 && onResponse) {
          onResponse(data.plans);
        }

        // Clear transcript
        setTranscript("");
      })
      .catch((err) => {
        console.error("Error:", err);
        setError(
          "Error al procesar la consulta. Por favor, inténtalo de nuevo."
        );
      });
  };

  // Auto-start conversation when component mounts
  useEffect(() => {
    // Small delay to allow page to load completely
    const timer = setTimeout(() => {
      startConversation();
    }, 500);

    // Cleanup function
    return () => {
      clearTimeout(timer);
      endConversation();
    };
  }, []);

  // Function to handle plan selection feedback
  const handlePlanSelected = (plan) => {
    // Send plan selection to server
    fetch(`${API_URL}/select-plan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ plan }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al seleccionar el plan");
        }
        return response.json();
      })
      .then((data) => {
        // Show response
        setAssistantResponse(data.text);
      })
      .catch((err) => {
        console.error("Error:", err);
        setError(
          "Error al seleccionar el plan. Por favor, inténtalo de nuevo."
        );
      });
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

export default SesameAI;
