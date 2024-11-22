import { forwardRef } from "react";
import {
  skinVars,
  Stack,
  Text,
  Text4,
  IconButton,
  IconCloseRegular,
  useScreenSize,
} from "@telefonica/mistica";
import { DecorationSnake } from "../assets/decorations/decorations";

const ModalView = forwardRef(
  ({ title, day, dayOfWeek, description, content, onCancel }, ref) => {
    const { isMobile } = useScreenSize();

    return (
      <dialog
        ref={ref}
        style={{
          width: "100vw",
          height: "100vh",
          margin: 0,
          padding: 0,
          maxWidth: "100%",
          maxHeight: "100%",
          border: "none",
        }}
      >
        {isMobile && onCancel !== null && (
          <div
            style={{ position: "absolute", top: 16, right: 16, zIndex: 999 }}
          >
            <IconButton
              type="brand"
              backgroundType="solid"
              Icon={IconCloseRegular}
              onPress={onCancel}
            />
          </div>
        )}
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          <div
            style={{
              width: isMobile ? "100%" : "65%",
              maxWidth: isMobile ? undefined : "640px",
              height: isMobile ? "auto" : "100vh",
              background: skinVars.colors.backgroundAlternative,
              padding: isMobile ? "16px" : "56px",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                position: isMobile ? "inherit" : "absolute",
                paddingBottom: "16px",
                top: isMobile ? 0 : 64,
                left: isMobile ? 0 : 64,
              }}
            >
              <Stack space={0}>
                <Text
                  color={skinVars.colors.brand}
                  size={isMobile ? 24 : 60}
                  weight="medium"
                >
                  {day}
                </Text>
                <Text4 color={skinVars.colors.brand} weight="medium">
                  {dayOfWeek}
                </Text4>{" "}
              </Stack>
            </div>
            <Stack space={24}>
              <Text
                color={skinVars.colors.brand}
                size={isMobile ? 32 : 80}
                lineHeight={isMobile ? 34 : 80}
                weight="bold"
              >
                {title}
              </Text>
              <DecorationSnake />
              <Text4 color={skinVars.colors.brand} weight="medium">
                {description ??
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed viverra, nisi eu semper rutrum, massa orci imperdiet"}
              </Text4>
            </Stack>
          </div>
          <form
            method="dialog"
            style={{
              width: "100%",
              height: isMobile ? "auto" : "100vh",
              display: "flex",
              flexDirection: "column",
              position: "relative",
              padding: isMobile ? "16px" : "56px",
            }}
          >
            {content}
            {}
            {!isMobile && onCancel !== null && (
              <div style={{ position: "absolute", top: 48, right: 48 }}>
                <IconButton
                  type="neutral"
                  backgroundType="soft"
                  Icon={IconCloseRegular}
                  onPress={onCancel}
                />
              </div>
            )}
          </form>
        </div>
      </dialog>
    );
  }
);

export default ModalView;
