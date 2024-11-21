import { forwardRef } from "react";
import {
  skinVars,
  Stack,
  Text,
  Text4,
  IconButton,
  IconCloseRegular,
} from "@telefonica/mistica";
import { DecorationSnake } from "../assets/decorations/decorations";

const ModalView = forwardRef(
  ({ title, day, dayOfWeek, description, content, onCancel }, ref) => {
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
        <div style={{ display: "flex" }}>
          <div
            style={{
              width: "40%",
              height: "100vh",
              background: skinVars.colors.backgroundAlternative,
              padding: "56px",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div style={{ position: "absolute", top: 56, left: 56 }}>
              <Stack space={0}>
                <Text color={skinVars.colors.brand} size={64} weight="medium">
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
                size={80}
                lineHeight={84}
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
              height: "100vh",
              display: "flex",
              flexDirection: "column",
              position: "relative",
            }}
          >
            {content}
            {onCancel !== null && (
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
