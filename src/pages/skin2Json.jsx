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
} from "@telefonica/mistica";
import { useNavigate } from "react-router-dom";
import { generateSkin } from "../helpers/jsonToSkin";

const Skin2Json = () => {
  const navigate = useNavigate();
  const [rawCode, setRawCode] = useState("");
  const [rawJsCode, setRawJsCode] = useState("");
  const [input, setInput] = useState("skin");

  return (
    <>
      <NavigationBar onBack={() => navigate("/")} title="Skin2json" />

      <ResponsiveLayout>
        <Box paddingTop={48}>
          <Stack space={24}>
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
            <label>Input ({input})</label>
            {input === "skin" ? (
              <textarea
                style={{ width: "100%", height: "300px" }}
                value={rawCode}
                onChange={(e) => {
                  setRawCode(e.target.value);
                }}
              ></textarea>
            ) : (
              <textarea
                style={{ width: "100%", height: "300px" }}
                value={rawJsCode}
                onChange={(e) => {
                  setRawJsCode(e.target.value);
                }}
              ></textarea>
            )}

            <label>Output</label>
            <textarea
              readOnly
              style={{ width: "100%", height: "300px" }}
              value={
                input === "skin"
                  ? JSON.stringify(transformToJSON(rawCode) || "", null, 2)
                  : rawJsCode !== "" && generateSkin("skin", rawJsCode)
              }
            ></textarea>
          </Stack>
        </Box>
      </ResponsiveLayout>
    </>
  );
};

export default Skin2Json;
