import {
  Align,
  Grid,
  GridItem,
  IconLockEyeClosedFilled,
  skinVars,
  Stack,
  Text,
  Text6,
  useScreenSize,
} from "@telefonica/mistica";
import React from "react";
import IconCompleted from "../assets/icons/icon-completed.jsx";
import { calendarDays } from "../utils/calendar-config";
import { CARD_STATES } from "../utils/constants"; // Importa CARD_STATES si no lo tienes ya
import contentByDate from "../utils/content-config"; // Asegúrate de importar tu configuración de contenido

// IllustrationWrapper Component
const IllustrationWrapper = ({ illustration, illustrationDimmed, status }) => {
  return (
    <Align x="center">
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100px",
          height: "100px",
        }}
      >
        {status === CARD_STATES.BLOCKED ? illustrationDimmed : illustration}
      </div>
    </Align>
  );
};

const ProgressGrid = ({ completedDays }) => {
  const { isMobile } = useScreenSize();

  // Extraer los días completados
  const completedDayNumbers = completedDays.map((date) =>
    new Date(date).getDate()
  );

  // Verificar si el día está completado
  const isDayCompleted = (day) => completedDayNumbers.includes(day);

  // Estilos de cada día
  const dayStyles = (completed) => ({
    background: completed
      ? skinVars.colors.neutralLow
      : skinVars.colors.backgroundContainer,
    borderRadius: "16px",
    width: "100%",
    height: 255,
    border: completed ? undefined : "1px solid",
    borderColor: skinVars.colors.border,
    padding: 16,
  });

  return (
    <Grid columns={isMobile ? 2 : 4} gap={isMobile ? 8 : 24}>
      {calendarDays.map((day) => {
        // Accede a la ilustración para cada día
        const illustration = contentByDate[day.date]?.illustration;

        // Determina el estado del día
        const status = isDayCompleted(day.dayNumber)
          ? CARD_STATES.COMPLETED
          : CARD_STATES.BLOCKED;

        return (
          <GridItem columnSpan={1} key={day.dayNumber}>
            <div style={dayStyles(isDayCompleted(day.dayNumber))}>
              <Stack space="between">
                {/* Icono de completado */}
                <div style={{ height: 24 }}>
                  <Align x="end">
                    {isDayCompleted(day.dayNumber) === true ? (
                      <IconCompleted size={24} />
                    ) : (
                      <IconLockEyeClosedFilled
                        size={24}
                        color={skinVars.colors.neutralMedium}
                      />
                    )}
                  </Align>
                </div>

                {/* Renderiza la ilustración usando IllustrationWrapper */}
                {illustration ? (
                  <IllustrationWrapper
                    illustration={illustration}
                    illustrationDimmed={
                      contentByDate[day.date]?.illustrationDimmed
                    }
                    status={status}
                  />
                ) : (
                  <div style={{ height: "100px" }} /> // Espaciador si no hay ilustración
                )}

                {/* Texto del día */}
                <Text6>
                  <Text color={skinVars.colors.textSecondary} weight="bold">
                    {day.dayNumber}
                  </Text>
                </Text6>
              </Stack>
            </div>
          </GridItem>
        );
      })}
    </Grid>
  );
};

export default ProgressGrid;
