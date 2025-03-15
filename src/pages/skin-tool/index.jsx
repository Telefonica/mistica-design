// This file defines the `SkinTool` component, the entry point for the skin creation tool.
// It provides options to start creating a skin from scratch or remix an existing one.

// To-do: improve UI and add a Mockup for decoration purpose and to let the user know how the platform works

import {
  ResponsiveLayout,
  skinVars,
  ButtonPrimary,
  ButtonSecondary,
} from "@telefonica/mistica";
import AppLayout from "../../components/app-layout";
import { useNavigate } from "react-router-dom";

const SkinTool = () => {
  const navigate = useNavigate();
  return (
    <AppLayout>
      <ResponsiveLayout>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignSelf: "flex-start",
            height: "100vh",
            flexDirection: "column",
            transform: "translateY(-100px)",
          }}
        >
          <div>
            <h1
              style={{
                fontWeight: "normal",
                fontSize: 40,
                color: skinVars.colors.textPrimary,
                marginBottom: "20px",
              }}
            >
              Your brand's new look starts here.
              <span
                style={{
                  display: "block",
                  background: "linear-gradient(90deg, #0066FF, #FCCFE5)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontWeight: "inherit",
                  fontSize: "inherit",
                }}
              >
                Discover Mística Skintool
              </span>
            </h1>
            <div style={{ display: "flex", gap: "13px", marginTop: "20px" }}>
              <ButtonPrimary onPress={() => navigate("/create-skin")}>
                Start from Scratch
              </ButtonPrimary>
              <ButtonSecondary onPress={() => navigate("/remix-skin")}>
                Remix an Existing Skin
              </ButtonSecondary>
            </div>
            {/* Here should be a Mockup for decoration purpose */}
          </div>
        </div>
      </ResponsiveLayout>
    </AppLayout>
  );
};

export default SkinTool;
