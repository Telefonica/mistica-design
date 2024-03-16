import React, { useState } from "react";
import transformToJSON from "../helpers/skinToJson";
import {
  NavigationBar,
  ResponsiveLayout,
  RadioGroup,
  RadioButton,
  Stack,
  Inline,
  Chip,
  Box,
  TextField,
  skinVars,
  ButtonPrimary,
  Circle,
  IconArrowLineRightRegular,
  IconLayersRegular,
  Text6,
  Text3,
  Snackbar,
} from "@telefonica/mistica";
import { useNavigate } from "react-router-dom";
import { generateSkin } from "../helpers/jsonToSkin";

const Skin2Json = () => {
  const navigate = useNavigate();
  const [rawCode, setRawCode] = useState("");
  const [rawJsCode, setRawJsCode] = useState("");
  const [input, setInput] = useState("skin");
  const [copied, setCopied] = useState(false);

  const rightStyles = {
    width: "100%",
    height: "50vh",
    backgroundColor: skinVars.colors.backgroundAlternative,
    borderRadius: "0 24px 24px 0",
    border: `1px solid ${skinVars.colors.border}`,
    borderLeft: "none",
    padding: 48,
    resize: "none",
    margin: 0,
  };

  const leftStyles = {
    width: "100%",
    height: "50vh",
    borderRadius: "24px 0 0 24px",
    border: `1px solid ${skinVars.colors.border}`,
    borderRight: "none",
    padding: 48,
    resize: "none",
    margin: 0,
  };

  return (
    <>
      <NavigationBar onBack={() => navigate("/")} title="Skin2json" />

      <ResponsiveLayout>
        <Box paddingTop={48}>
          <Stack space={24}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                gap: 32,
                alignItems: "center",
              }}
            >
              <div
                style={{
                  borderBottom: `4px solid ${skinVars.colors.brand}`,
                }}
              >
                <IconLayersRegular size={48}></IconLayersRegular>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  gap: 8,
                  alignItems: "center",
                }}
              >
                <Text6>Skin2Json</Text6>
                <Text3 color={skinVars.colors.textSecondary}>
                  Convert skin tokens file to web
                </Text3>
              </div>
              <RadioGroup
                name="chip-group"
                defaultValue="skin"
                onChange={setInput}
              >
                <Inline space={8}>
                  <RadioButton
                    value="skin"
                    render={({ checked, labelId }) => (
                      <Chip active={checked} id={labelId}>
                        Skin to JSON
                      </Chip>
                    )}
                  />
                  <RadioButton
                    value="json"
                    render={({ checked, labelId }) => (
                      <Chip active={checked} id={labelId}>
                        JSON to skin
                      </Chip>
                    )}
                  />
                </Inline>
              </RadioGroup>
            </div>
            <div style={{ position: "relative" }}>
              <Inline space={0} fullWidth>
                {input === "skin" ? (
                  <textarea
                    style={leftStyles}
                    value={rawCode}
                    onChange={(e) => {
                      setRawCode(e.target.value);
                    }}
                  ></textarea>
                ) : (
                  <textarea
                    style={leftStyles}
                    value={rawJsCode}
                    onChange={(e) => {
                      setRawJsCode(e.target.value);
                    }}
                  ></textarea>
                )}

                <textarea
                  readOnly
                  style={rightStyles}
                  value={
                    input === "skin"
                      ? JSON.stringify(transformToJSON(rawCode) || "", null, 2)
                      : rawJsCode !== "" && generateSkin("skin", rawJsCode)
                  }
                ></textarea>
              </Inline>
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              >
                <Circle
                  border={true}
                  size={48}
                  backgroundColor={skinVars.colors.background}
                >
                  <IconArrowLineRightRegular />
                </Circle>
              </div>
              <div style={{ position: "absolute", bottom: 16, right: 16 }}>
                <ButtonPrimary
                  small
                  onPress={() => {
                    if (input === "skin") {
                      navigator.clipboard.writeText(rawCode);
                    } else {
                      navigator.clipboard.writeText(rawJsCode);
                    }
                    setCopied(true);
                  }}
                >
                  Copy to clipboard
                </ButtonPrimary>
              </div>
            </div>
          </Stack>
        </Box>
        {copied && (
          <Snackbar
            message="Copied to clipboard!"
            withDismiss
            onClose={({ action }) => {
              setCopied(false);
              if (action === "DISMISS") {
                setCopied(false);
              }
            }}
          ></Snackbar>
        )}
      </ResponsiveLayout>
    </>
  );
};

export default Skin2Json;
