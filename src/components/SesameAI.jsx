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

/**
 * SesameAI component for voice assistant integration
 *
 * This component integrates with the SesameAI voice assistant to provide
 * a conversational interface for recommending internet fiber plans.
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

  // Reference to store the WebSocket connection
  const wsRef = useRef(null);

  // Mock plans data (in a real implementation, this would come from the assistant)
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

  // Function to simulate receiving a response from the assistant
  const simulateAssistantResponse = (userQuery) => {
    setIsConnecting(false);
    setIsListening(true);

    // Simulate processing time
    setTimeout(() => {
      let response = "";
      let plans = [];

      // Simple keyword matching to simulate AI understanding
      const query = userQuery.toLowerCase();

      if (
        query.includes("hola") ||
        query.includes("buenos días") ||
        query.includes("buenas")
      ) {
        response = `Hola, soy ${character} de Movistar. ¿En qué puedo ayudarte hoy? Puedo recomendarte planes de fibra óptica según tus necesidades.`;
      } else if (
        query.includes("fibra") ||
        query.includes("internet") ||
        query.includes("planes")
      ) {
        response =
          "Tenemos excelentes planes de fibra óptica. Te muestro algunas opciones que podrían interesarte:";
        plans = fiberPlans;
      } else if (
        query.includes("más rápido") ||
        query.includes("velocidad") ||
        query.includes("1 gb")
      ) {
        response =
          "Nuestro plan más rápido es el de Fibra 1 Gb con líneas móviles ilimitadas:";
        plans = [fiberPlans[1]];
      } else if (
        query.includes("económico") ||
        query.includes("barato") ||
        query.includes("precio")
      ) {
        response = "Te recomiendo nuestro plan más económico:";
        plans = [fiberPlans[2]];
      } else if (
        query.includes("familia") ||
        query.includes("varias líneas") ||
        query.includes("hijos")
      ) {
        response =
          "Para familias, recomiendo nuestros planes con múltiples líneas móviles:";
        plans = [fiberPlans[0], fiberPlans[1]];
      } else {
        response =
          "Disculpa, no he entendido tu consulta. ¿Podrías decirme qué tipo de plan de internet estás buscando?";
      }

      setAssistantResponse(response);

      // Send plans to parent component if available
      if (plans.length > 0 && onResponse) {
        onResponse(plans);
      }
    }, 1000);
  };

  // Function to handle starting the conversation
  const startConversation = () => {
    setIsConnecting(true);
    setError(null);

    // Simulate connection delay
    setTimeout(() => {
      // Simulate initial greeting from assistant
      const greeting = `Hola, soy ${character} de Movistar. ¿En qué puedo ayudarte hoy? Puedo recomendarte planes de fibra óptica según tus necesidades.`;
      setAssistantResponse(greeting);
      setIsConnecting(false);
      setIsListening(true);

      // Notify parent component that conversation has started
      if (onConversationStart) {
        onConversationStart();
      }
    }, 1500);
  };

  // Function to handle ending the conversation
  const endConversation = () => {
    setIsListening(false);
    setTranscript("");
    setAssistantResponse("");

    // Notify parent component that conversation has ended
    if (onConversationEnd) {
      onConversationEnd();
    }
  };

  // Function to handle user input (simulated for now)
  const handleUserInput = (e) => {
    e.preventDefault();
    if (transcript.trim() === "") return;

    // Process user input
    simulateAssistantResponse(transcript);
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

export default SesameAI;
