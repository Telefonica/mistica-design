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
 * SesameAI component
 * Esta versión no intenta reproducir audio en el navegador, ya que el audio es manejado
 * directamente por el servidor Python usando los dispositivos de audio del sistema.
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
  const [connectionStatus, setConnectionStatus] = useState("");

  // Server URL
  const API_URL = "http://localhost:5000/api";

  // Comprobar estado del servidor
  const checkServerStatus = async () => {
    try {
      const response = await fetch("http://localhost:5000/health");
      if (!response.ok) {
        throw new Error(`Error de servidor: ${response.status}`);
      }
      const data = await response.json();
      console.log("Estado del servidor:", data);

      setConnectionStatus(
        data.sesame_connected
          ? "conectado"
          : "servidor activo, sesame desconectado"
      );

      return data;
    } catch (err) {
      console.error("Error comprobando estado del servidor:", err);
      setConnectionStatus("error");
      return null;
    }
  };

  // Iniciar conversación
  const startConversation = async () => {
    console.log("Iniciando conversación...");
    setIsConnecting(true);
    setError(null);

    // Verificar servidor
    const status = await checkServerStatus();
    if (!status) {
      setError(
        "No se pudo conectar al servidor. Verifica que esté funcionando."
      );
      setIsConnecting(false);
      return;
    }

    try {
      // Obtener mensaje de bienvenida
      console.log("Solicitando mensaje de bienvenida...");
      const response = await fetch(`${API_URL}/welcome`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Mensaje de bienvenida recibido:", data);

      // Actualizar UI
      setAssistantResponse(data.text);
      setIsConnecting(false);
      setIsListening(true);

      // Enviar planes al componente padre
      if (data.plans && data.plans.length > 0 && onResponse) {
        onResponse(data.plans);
      }

      // Notificar componente padre
      if (onConversationStart) {
        onConversationStart();
      }

      console.log("✅ Conversación iniciada correctamente");
    } catch (err) {
      console.error("❌ Error iniciando conversación:", err);
      setError(`Error de conexión: ${err.message}`);
      setIsConnecting(false);
    }
  };

  // Finalizar conversación
  const endConversation = () => {
    console.log("Finalizando conversación...");

    // Actualizar estado
    setIsListening(false);
    setTranscript("");

    // Notificar padre
    if (onConversationEnd) {
      onConversationEnd();
    }

    console.log("✅ Conversación finalizada");
  };

  // Enviar texto
  const handleUserInput = (e) => {
    e.preventDefault();
    if (transcript.trim() === "") return;

    console.log(`Enviando texto: "${transcript}"`);

    // Enviar al servidor
    fetch(`${API_URL}/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: transcript }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Respuesta recibida:", data);

        // Actualizar UI
        setAssistantResponse(data.text);

        // Enviar planes
        if (data.plans && data.plans.length > 0 && onResponse) {
          onResponse(data.plans);
        }

        // Limpiar
        setTranscript("");
      })
      .catch((err) => {
        console.error("❌ Error enviando texto:", err);
        setError(`Error: ${err.message}`);
      });
  };

  // Auto-iniciar al montar el componente
  useEffect(() => {
    console.log("Componente montado, iniciando en 500ms...");
    const timer = setTimeout(() => {
      startConversation();
    }, 500);

    // Comprobar estado del servidor cada 5 segundos
    const statusInterval = setInterval(() => {
      checkServerStatus();
    }, 5000);

    // Cleanup
    return () => {
      clearTimeout(timer);
      clearInterval(statusInterval);
      endConversation();
    };
  }, []);

  return (
    <Box>
      <Stack space={24}>
        {/* Indicador de estado */}
        <Box
          padding={8}
          borderRadius={8}
          backgroundColor={skinVars.colors.backgroundAlternative}
        >
          <Text3>Estado: {connectionStatus || "comprobando..."}</Text3>
          <Text3
            color={skinVars.colors.textSecondary}
            style={{ fontSize: "14px" }}
          >
            El audio se reproduce directamente en tu sistema, usando tus
            altavoces
          </Text3>
        </Box>

        {/* Avatar del asistente y respuesta */}
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

        {/* Área de entrada del usuario */}
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

              <Box style={{ display: "flex", alignItems: "center" }}>
                <IconButton
                  Icon={isListening ? IconMicrophoneRegular : IconMuteRegular}
                  aria-label={isListening ? "Activo" : "Inactivo"}
                  type={isListening ? "brand" : "secondary"}
                  onClick={isListening ? endConversation : startConversation}
                  disabled={isConnecting}
                />
                <Text3 style={{ marginLeft: "16px" }}>
                  {isConnecting
                    ? "Conectando..."
                    : isListening
                    ? "Escuchando"
                    : "Desconectado"}
                </Text3>
              </Box>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Box>
  );
};

export default SesameAI;
