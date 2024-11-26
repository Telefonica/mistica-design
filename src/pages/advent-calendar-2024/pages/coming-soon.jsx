import {
  Align,
  ResponsiveLayout,
  skinVars,
  Snackbar,
  Text5,
  Stack,
  Text,
  Text2,
  Timer,
} from "@telefonica/mistica";
import { useState } from "react";
import DecorationSnake from "../assets/decorations/decoration-snake";
import CornerLayout from "../components/corner-layout.jsx";
import Snow from "../components/snow.tsx";

const ComingSoonPage = () => {
  const defaultTargetDate = "2024-12-02";
  const endTimestamp = new Date(defaultTargetDate).getTime();
  const [isSnackbarOpen, setSnackbarOpen] = useState(false);

  const copyToClipboard = () => {
    const url = window.location.href; // Get the current URL

    navigator.clipboard
      .writeText(url)
      .then(() => {
        setSnackbarOpen(true); // Show the snackbar on success
      })
      .catch((err) => console.error("Failed to copy: ", err));
  };

  return (
    <>
      <ResponsiveLayout variant="inverse">
        <Snow />
        <CornerLayout />
        {isSnackbarOpen && (
          <Snackbar
            onClose={() => setSnackbarOpen(false)} // Close the snackbar
            message="Copied URL to clipboard!"
          />
        )}
        <Align x="center" y="center" height="100vh">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <Stack space={24}>
              <Text
                size={70}
                mobileSize={56}
                lineHeight={100}
                mobileLineHeight={56}
                weight="bold"
              >
                Something special is on its way...
              </Text> 
              <div
                style={{
                  maxWidth: 600,
                  display: "flex",
                  justifyContent: "center",
                  textAlign: "center",
                  margin: "auto",
                }}
              >
                <Text5>
                  Keep an eye out!
                
                </Text5>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  textAlign: "center",
                  margin: "auto",
                  padding: "4%",
                }}
              >
                <DecorationSnake
                  color={skinVars.colors.inverse}
                ></DecorationSnake>
              </div>
              <Timer
                endTimestamp={endTimestamp}
                minTimeUnit="seconds"
                maxTimeUnit="days"
                themeVariant="inverse"
                boxed={false}
              />
            </Stack>
          </div>
        </Align>
      </ResponsiveLayout>
    </>
  );
};

export default ComingSoonPage;
