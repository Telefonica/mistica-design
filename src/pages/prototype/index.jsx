import React, { useState, useEffect } from "react"; // All comments are in English
import {
  FadeIn,
  Image,
  Inline,
  Table,
  Text3,
  Spinner,
  Tag,
  Text1,
  Box,
  ResponsiveLayout,
  Stack,
  skinVars,
  Tooltip,
  IconInformationRegular,
  MainNavigationBar,
  FunnelNavigationBar,
  MovistarLogo,
  NavigationBarAction,
  useTheme,
  NavigationBarActionGroup,
  IconQuestionRegular,
  Text2,
  IconCloseRegular,
  IconButton,
  IconMicrophoneRegular,
  ProgressBar,
  getMovistarSkin,
  ThemeContextProvider,
  Logo,
  Align,
  Circle,
  Grid,
  DataCard,
  Chip,
} from "@telefonica/mistica";

// Importar el componente mejorado
import SesameAI from "./components/SesameAI";

const Prototype = () => {
  const isDesktopOrBigger = useTheme;
  const [recommendations, setRecommendations] = useState([]);
  const [conversationActive, setConversationActive] = useState(false);
  const [callEnded, setCallEnded] = useState(false);

  // Handle recommendations from Sesame AI
  const handleRecommendations = (plans) => {
    setRecommendations(plans);
  };

  // Handle conversation start
  const handleConversationStart = () => {
    setConversationActive(true);
    setCallEnded(false);
  };

  // Handle conversation end
  const handleConversationEnd = () => {
    setConversationActive(false);
  };

  // Handle plan selection
  const handlePlanSelection = (plan) => {
    console.log("Selected plan:", plan);
    // Send the selected plan to the SesameAI component for feedback
    if (window.handlePlanSelectionFromParent) {
      window.handlePlanSelectionFromParent(plan);
    }
    // Additional logic for plan selection can be added here
  };

  // Handle end call button
  const handleEndCall = () => {
    setCallEnded(true);
    setConversationActive(false);
  };

  // Handle chip selection
  const handleChipPress = (suggestion) => {
    console.log("Suggestion selected:", suggestion);
    // Additional logic for suggestion handling can be added here
  };

  return (
    <>
      <ThemeContextProvider
        theme={{
          skin: getMovistarSkin(),
          i18n: { locale: "es-ES", phoneNumberFormattingRegionCode: "ES" },
        }}
      >
        <Stack space={24}>
          <MainNavigationBar
            logo={<Logo type="imagotype" />}
            withBorder={false}
            right={
              <NavigationBarActionGroup>
                <NavigationBarAction aria-label="mute" onPress={() => {}}>
                  <IconButton
                    Icon={IconMicrophoneRegular}
                    backgroundType="soft"
                    type="brand"
                  />
                  {isDesktopOrBigger && "Mute"}
                </NavigationBarAction>
                <NavigationBarAction
                  aria-label="end call"
                  onPress={handleEndCall}
                >
                  <IconButton
                    Icon={IconCloseRegular}
                    backgroundType="soft"
                    type="danger"
                  />
                  {isDesktopOrBigger && "End call"}
                </NavigationBarAction>
              </NavigationBarActionGroup>
            }
          />
          <ResponsiveLayout>
            <ProgressBar progressPercent={20} />
          </ResponsiveLayout>
          <Box padding={40} paddingBottom={80}>
            <ResponsiveLayout>
              <Stack space={80}>
                {/* Usar el componente SesameAI en lugar de SesameAI */}
                <SesameAI
                  onResponse={handleRecommendations}
                  onConversationStart={handleConversationStart}
                  onConversationEnd={handleConversationEnd}
                  character="Maya"
                />

                <Grid columns={3} gap={24}>
                  {recommendations.length > 0 ? (
                    recommendations.map((plan, index) => (
                      <DataCard
                        key={plan.id || index}
                        title={plan.title}
                        extra={<Text3>{plan.price}</Text3>}
                        onPress={() => handlePlanSelection(plan)}
                      />
                    ))
                  ) : (
                    <>
                      <DataCard
                        title="Fibra 600 Mb y 2 líneas móviles 35 GB"
                        extra={<Text3>52,90 €/mes</Text3>}
                        onPress={() =>
                          handlePlanSelection({
                            title: "Fibra 600 Mb y 2 líneas móviles 35 GB",
                            price: "52,90 €/mes",
                            id: "plan1",
                            description: "Velocidad simétrica, sin permanencia",
                          })
                        }
                      />
                      <DataCard
                        title="Fibra 1 Gb y 2 líneas móviles ilimitadas"
                        extra={<Text3>64,90 €/mes</Text3>}
                        onPress={() =>
                          handlePlanSelection({
                            title: "Fibra 1 Gb y 2 líneas móviles ilimitadas",
                            price: "64,90 €/mes",
                            id: "plan2",
                            description: "Máxima velocidad, sin permanencia",
                          })
                        }
                      />
                      <DataCard
                        title="Fibra 300 Mb y 1 línea móvil 25 GB"
                        extra={<Text3>42,90 €/mes</Text3>}
                        onPress={() =>
                          handlePlanSelection({
                            title: "Fibra 300 Mb y 1 línea móvil 25 GB",
                            price: "42,90 €/mes",
                            id: "plan3",
                            description:
                              "Ideal para uso individual, sin permanencia",
                          })
                        }
                      />
                    </>
                  )}
                </Grid>
                <Inline space="between" alignItems="center">
                  <Text3 color={skinVars.colors.textSecondary}>
                    Sugerencias para la conversación:
                  </Text3>
                  <Inline space={16}>
                    <Chip onPress={() => handleChipPress("Comparar")}>
                      Comparar
                    </Chip>
                    <Chip
                      onPress={() =>
                        handleChipPress("¿Por qué estas opciones?")
                      }
                    >
                      ¿Por qué estas opciones?
                    </Chip>
                    <Chip
                      onPress={() =>
                        handleChipPress("Creo que no es lo que busco")
                      }
                    >
                      Creo que no es lo que busco
                    </Chip>
                  </Inline>
                </Inline>
              </Stack>
            </ResponsiveLayout>
          </Box>
        </Stack>
      </ThemeContextProvider>
    </>
  );
};

export default Prototype;
