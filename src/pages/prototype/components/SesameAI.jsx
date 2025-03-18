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
  Button,
  ButtonPrimary,
} from "@telefonica/mistica";

/**
 * SesameAI component
 * Versión con mejor conectividad y registro de eventos
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
  const [logs, setLogs] = useState([]);

  // Server URL - Asegúrate de que esta URL es correcta
  const API_URL = "http://localhost:5000/api";

  // Función para añadir logs
  const addLog = (message) => {
    console.log(message); // Loguear también en consola
    setLogs((prevLogs) =>
      [...prevLogs, `${new Date().toLocaleTimeString()}: ${message}`].slice(-10)
    );
  };

  // Comprobar estado del servidor
  const checkServerStatus = async () => {
    try {
      addLog("Comprobando estado del servidor...");
      const response = await fetch("http://localhost:5000/health");
      if (!response.ok) {
        throw new Error(`Error de servidor: ${response.status}`);
      }
      const data = await response.json();
      addLog(`Estado del servidor: ${JSON.stringify(data)}`);

      setConnectionStatus(
        data.sesame_connected
          ? data.sesame_initialized
            ? "conectado y listo"
            : "conectado, inicializando"
          : "servidor activo, sesame desconectado"
      );

      return data;
    } catch (err) {
      console.error("Error comprobando estado del servidor:", err);
      addLog(`Error: ${err.message}`);
      setConnectionStatus(`error: ${err.message}`);
      return null;
    }
  };

  // Reiniciar el servidor
  const restartServer = async () => {
    try {
      addLog("Solicitando reinicio del servidor...");
      const response = await fetch("http://localhost:5000/restart");
      const data = await response.json();
      addLog(`Respuesta: ${JSON.stringify(data)}`);

      // Comprobar estado después del reinicio
      setTimeout(checkServerStatus, 2000);

      return data.success;
    } catch (err) {
      addLog(`Error reiniciando: ${err.message}`);
      return false;
    }
  };

  // Iniciar conversación
  const startConversation = async () => {
    addLog("Iniciando conversación...");
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
      addLog("Solicitando mensaje de bienvenida...");
      const response = await fetch(`${API_URL}/welcome`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      addLog(
        `Mensaje de bienvenida recibido: ${data.text.substring(0, 30)}...`
      );

      // Actualizar UI
      setAssistantResponse(data.text);
      setIsConnecting(false);
      setIsListening(true);

      // Enviar planes al componente padre
      if (data.plans && data.plans.length > 0 && onResponse) {
        addLog(`Enviando ${data.plans.length} planes al componente padre`);
        onResponse(data.plans);
      }

      // Notificar componente padre
      if (onConversationStart) {
        onConversationStart();
      }

      addLog("✅ Conversación iniciada correctamente");

      // Enviar un "hola" automático para activar el saludo
      setTimeout(() => {
        if (transcript === "") {
          handleUserInput(null, "hola");
        }
      }, 1000);
    } catch (err) {
      console.error("❌ Error iniciando conversación:", err);
      addLog(`Error: ${err.message}`);
      setError(`Error de conexión: ${err.message}`);
      setIsConnecting(false);
    }
  };

  // Finalizar conversación
  const endConversation = () => {
    addLog("Finalizando conversación...");

    // Actualizar estado
    setIsListening(false);
    setTranscript("");

    // Notificar padre
    if (onConversationEnd) {
      onConversationEnd();
    }

    addLog("✅ Conversación finalizada");
  };

  // Enviar texto
  const handleUserInput = (e, textOverride = null) => {
    if (e) e.preventDefault();

    const textToSend = textOverride || transcript;
    if (textToSend.trim() === "") return;

    addLog(`Enviando texto: "${textToSend}"`);

    // Enviar al servidor
    fetch(`${API_URL}/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: textToSend }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        addLog(`Respuesta recibida: ${data.text.substring(0, 30)}...`);

        // Actualizar UI
        setAssistantResponse(data.text);

        // Enviar planes
        if (data.plans && data.plans.length > 0 && onResponse) {
          addLog(`Enviando ${data.plans.length} planes al componente padre`);
          onResponse(data.plans);
        }

        // Limpiar si no era un textOverride
        if (!textOverride) {
          setTranscript("");
        }
      })
      .catch((err) => {
        console.error("❌ Error enviando texto:", err);
        addLog(`Error: ${err.message}`);
        setError(`Error: ${err.message}`);
      });
  };

  // Auto-iniciar al montar el componente
  useEffect(() => {
    addLog("Componente montado, iniciando en 1 segundo...");
    const timer = setTimeout(() => {
      startConversation();
    }, 1000);

    // Comprobar estado del servidor cada 10 segundos
    const statusInterval = setInterval(() => {
      checkServerStatus();
    }, 10000);

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
        {/* Indicador de estado y botones de acción */}
        <Box
          padding={8}
          borderRadius={8}
          backgroundColor={skinVars.colors.backgroundAlternative}
        >
          <Stack space={8}>
            <Text3>
              Estado del servidor: {connectionStatus || "comprobando..."}
            </Text3>
            <Text3
              color={skinVars.colors.textSecondary}
              style={{ fontSize: "14px" }}
            >
              El audio se reproduce directamente a través de tus altavoces del
              sistema
            </Text3>
            <Box style={{ display: "flex", gap: "8px" }}>
              <ButtonPrimary
                small
                onPress={restartServer}
                style={{ alignSelf: "flex-start" }}
              >
                Reiniciar servidor
              </ButtonPrimary>
              <ButtonPrimary
                small
                onPress={() => handleUserInput(null, "hola")}
                style={{ alignSelf: "flex-start" }}
              >
                Decir "Hola"
              </ButtonPrimary>
            </Box>
          </Stack>
        </Box>

        {/* Logs */}
        <Box
          padding={8}
          borderRadius={8}
          backgroundColor={skinVars.colors.backgroundBrandLow}
          style={{ display: logs.length > 0 ? "block" : "none" }}
        >
          <Text3 color={skinVars.colors.textSecondary}>Logs:</Text3>
          {logs.map((log, index) => (
            <Text3 key={index} style={{ fontSize: "12px", marginTop: "2px" }}>
              {log}
            </Text3>
          ))}
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
