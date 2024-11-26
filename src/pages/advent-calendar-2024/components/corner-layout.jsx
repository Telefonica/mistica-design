import {
  ButtonSecondary,
  IconShareFilled,
  ResponsiveLayout,
  Snackbar,
  TelefonicaLogo,
  Text1,
  TextLink,
  Touchable,
  skinVars,
  useScreenSize,
} from "@telefonica/mistica";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { base64Encode } from "../utils/url-encoder";
import RotatingSVG from "./label-rotate";

const CornerLayout = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location
  const { isLargeDesktop, isTabletOrBigger } = useScreenSize();
  const [isSnackbarOpen, setSnackbarOpen] = useState(false);
  const [showLogo, setShowLogo] = useState(false);

  useEffect(() => {
    const updateLogoVisibility = () => {
      setShowLogo(window.innerWidth >= 1560);
    };

    // Set initial state and listen for resize events
    updateLogoVisibility();
    window.addEventListener("resize", updateLogoVisibility);

    return () => {
      window.removeEventListener("resize", updateLogoVisibility);
    };
  }, []);

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
    <ResponsiveLayout>
      {isTabletOrBigger && (
        <div style={{ position: "fixed", top: 24, left: 24 }}>
          <Touchable to={"/advent-calendar-2024"}>
            <RotatingSVG color={skinVars.colors.brand} />
          </Touchable>
        </div>
      )}

      {isLargeDesktop && (
        <div
          style={{
            position: "fixed",
            bottom: 88,
            left: "-12px",
            transform: "rotate(-90deg)",
          }}
        >
          <Text1>
            Made with{" "}
            <strong>
              <TextLink
                style={{ color: "inherit" }}
                href="https://brandfactory.telefonica.com/mistica"
                newTab
              >
                Mística
              </TextLink>
            </strong>
          </Text1>
        </div>
      )}

      {showLogo && (
        <div
          style={{
            position: "fixed",
            top: 30,
            right: 40,
          }}
        >
          <TelefonicaLogo type="imagotype" size={40} />
        </div>
      )}
      <div
        style={{
          position: "fixed",
          bottom: 40,
          right: 40,
        }}
      >
        <ButtonSecondary
          small
          onPress={() => copyToClipboard()}
          StartIcon={IconShareFilled}
        >
          Share
        </ButtonSecondary>
      </div>
      {isSnackbarOpen && (
        <Snackbar
          onClose={() => setSnackbarOpen(false)} // Close the snackbar
          message="Copied URL to clipboard!"
        />
      )}
    </ResponsiveLayout>
  );
};

export default CornerLayout;
