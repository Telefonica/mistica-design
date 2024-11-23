import React from "react";
import {
  Align,
  skinVars,
  Grid,
  GridItem,
  Stack,
  Text,
  Text6,
} from "@telefonica/mistica";
import IconCompleted from "../assets/icons/icon-completed.jsx";
import contentByDate from "../utils/content-config"; // Asegúrate de importar tu configuración de contenido
import { calendarDays } from "../utils/calendar-config";
import { CARD_STATES } from "../utils/constants"; // Importa CARD_STATES si no lo tienes ya

// IllustrationWrapper Component
const IllustrationWrapper = ({ illustration, status }) => {
  return (
    <Align x="center">
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100px",
          height: "100px",
          filter:
            status === CARD_STATES.BLOCKED
              ? "grayscale(100%) contrast(0%)"
              : "none",
          opacity: status === CARD_STATES.BLOCKED ? 0.35 : 1,
        }}
      >
        {illustration}
      </div>
    </Align>
  );
};

const ProgressGrid = ({ completedDays }) => {
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
    width: 184,
    height: 255,
    border: completed ? undefined : "1px solid",
    borderColor: skinVars.colors.border,
    padding: 16,
  });

  return (
    <Grid columns={8} gap={24}>
      {calendarDays.map((day) => {
        // Accede a la ilustración para cada día
        const illustration = contentByDate[day.date]?.illustration;

        // Determina el estado del día
        const status = isDayCompleted(day.dayNumber)
          ? CARD_STATES.COMPLETED
          : CARD_STATES.BLOCKED;

        return (
          <GridItem columnSpan={2} key={day.dayNumber}>
            <div>
              <div style={dayStyles(isDayCompleted(day.dayNumber))}>
                <Stack space="between">
                  {/* Icono de completado */}
                  <div style={{ height: 24 }}>
                    <Align x="end">
                      {isDayCompleted(day.dayNumber) && (
                        <IconCompleted size={24} />
                      )}
                    </Align>
                  </div>

                  {/* Renderiza la ilustración usando IllustrationWrapper */}
                  {illustration ? (
                    <IllustrationWrapper
                      illustration={illustration}
                      status={status}
                    />
                  ) : (
                    <div style={{ height: "100px" }} /> // Espaciador si no hay ilustración
                  )}

                  {/* Texto del día */}
                  <Text6>
                    <Text color={skinVars.colors.textSecondary} weight="medium">
                      {day.dayNumber}
                    </Text>
                  </Text6>
                </Stack>
              </div>
            </div>
          </GridItem>
        );
      })}
    </Grid>
  );
};

export default ProgressGrid;
