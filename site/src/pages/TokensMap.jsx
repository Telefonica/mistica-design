import React, { useEffect, useState } from "react";
import ReferencePalette from "../components/referencePalette";
import Palette from "../components/Palette";
import GlobalPalette from "../components/globalPalette";
import RadiiTable from "../components/borderRadii";
import TextTable from "../components/typography";
import SpacingTable from "../components/spacingTable";
import PropertiesTable from "../components/propertiesTable";
import {
  Box,
  Chip,
  Inline,
  ResponsiveLayout,
  Select,
  Stack,
  TextField,
  RadioButton,
  RadioGroup,
  Text6,
  Circle,
  Text,
  skinVars,
  useScreenSize,
} from "@telefonica/mistica";
import { useLocation } from "react-router-dom";
import GetSkin from "../helpers/getSkin";
import AppLayout from "../components/app-layout";
import SubHeader from "../components/sub-header";

const BRANCH = "production";

const TokensMap = () => {
  // use query params to load the page in the selected state coming from a detail

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const colorFromUrl = queryParams.get("activeColor");
  const skinFromUrl = queryParams.get("skin");
  const tokenTypeFromUrl = queryParams.get("tokenType");

  const [filter, setFilter] = useState("");
  const [selectedSkin, setSelectedSkin] = useState(skinFromUrl || "movistar");
  const [activeTokenType, setActiveTokenType] = useState(
    tokenTypeFromUrl || "color",
  );
  const [selectedColor, setSelectedColor] = useState(
    colorFromUrl || "undefined",
  );
  const { skinData, skinNames } = GetSkin({});
  const [colorView, setColorView] = useState("constants");
  const { isMobile } = useScreenSize();

  // Update URL with selected skin, tokenType and color

  useEffect(() => {
    let queryParams = `?skin=${selectedSkin}&tokenType=${activeTokenType}`;

    if (selectedColor) {
      queryParams += `&activeColor=${selectedColor}`;
    }

    window.history.pushState({}, "", queryParams);
  }, [selectedColor, selectedSkin, activeTokenType]);

  // Filter tokens

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  // Select skins

  let skin = skinData[selectedSkin] || skinData.movistar;

  const tokenExists = (skin, tokenType) => {
    if (!skin) return false;

    switch (tokenType) {
      case "color":
        // color exists if either light or dark has keys
        return (
          (skin.light && Object.keys(skin.light).length > 0) ||
          (skin.dark && Object.keys(skin.dark).length > 0)
        );
      case "radius":
        return !!skin.radius && Object.keys(skin.radius).length > 0;
      case "text":
        return !!skin.text && Object.keys(skin.text).length > 0;
      case "spacing":
        return !!skin.spacing && Object.keys(skin.spacing).length > 0;
      case "properties":
        return (
          (!!skin.themeVariant && Object.keys(skin.themeVariant).length > 0) ||
          (!!skin.componentProperties &&
            Object.keys(skin.componentProperties).length > 0)
        );
      default:
        return false;
    }
  };

  const TOKEN_FILTERS = {
    color: "Color",
    radius: "Border Radii",
    text: "Typography",
    spacing: "Spacing",
    properties: "Properties",
  };

  const COLOR_FILTERS = {
    constants: "Constants",
    variables: "Variables",
    match: "Match",
  };

  const VIEWS = {
    color: {
      constants: Palette,
      variables: GlobalPalette,
      match: ReferencePalette,
    },
    radius: RadiiTable,
    text: TextTable,
    spacing: SpacingTable,
    properties: PropertiesTable,
  };
  // Modify the view depending on the selected chip

  const Component = VIEWS[activeTokenType][colorView] || VIEWS[activeTokenType];

  const view = (
    <Component
      skin={skin}
      selectedSkin={selectedSkin}
      filter={filter}
      tokenType={activeTokenType}
      branch={BRANCH}
      selectedColor={selectedColor}
      setSelectedColor={setSelectedColor}
    />
  );

  const filters = [
    <TextField
      fullWidth
      label="Filter tokens"
      value={filter}
      onChange={handleFilterChange}
      placeholder="Search..."
    />,
    <Select
      fullWidth
      label="Skin"
      onChangeValue={setSelectedSkin}
      value={selectedSkin}
      options={skinNames}
    ></Select>,
  ];

  return (
    <AppLayout>
      <Box paddingBottom={80}>
        <ResponsiveLayout>
          <Box paddingY={48}>
            <Stack space={32}>
              <Stack space={24}>
                <SubHeader to={`/`} />
                <Text6>Mística tokens</Text6>
              </Stack>
              <Stack space={24}>
                <RadioGroup
                  onChange={setActiveTokenType}
                  name="chip-group"
                  value={activeTokenType}
                >
                  <Inline space={8}>
                    {Object.keys(TOKEN_FILTERS)
                      .filter((tokenType) => tokenExists(skin, tokenType)) // only show existing categories
                      .map((tokenType) => (
                        <RadioButton
                          key={tokenType}
                          value={tokenType}
                          render={({ checked, labelId }) => (
                            <Chip active={checked} id={labelId}>
                              {TOKEN_FILTERS[tokenType]}
                            </Chip>
                          )}
                        />
                      ))}
                  </Inline>
                </RadioGroup>

                {isMobile ? (
                  <Stack space={8}>{filters}</Stack>
                ) : (
                  <Inline space={8} alignItems="center" fullWidth>
                    {filters}
                  </Inline>
                )}
              </Stack>
            </Stack>
          </Box>
          {activeTokenType === "color" && (
            <Box paddingBottom={24}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 16,
                }}
              >
                <RadioGroup
                  onChange={setColorView}
                  name="chip-group"
                  value={colorView}
                >
                  <Inline space={8}>
                    {Object.keys(COLOR_FILTERS).map((filter, index) => (
                      <RadioButton
                        key={index}
                        value={filter}
                        render={({ checked, labelId }) => (
                          <Chip active={checked} id={labelId}>
                            {COLOR_FILTERS[filter]}
                          </Chip>
                        )}
                      />
                    ))}
                  </Inline>
                </RadioGroup>
                <Inline space={8} alignItems="center">
                  <Circle size={24} backgroundColor={skinVars.colors.brandLow}>
                    <Circle
                      size={8}
                      backgroundColor={skinVars.colors.brand}
                    ></Circle>
                  </Circle>
                  <Text>Constants</Text>
                  <Circle
                    size={24}
                    backgroundColor={skinVars.colors.successLow}
                  >
                    <Circle
                      size={8}
                      backgroundColor={skinVars.colors.successHigh}
                    ></Circle>
                  </Circle>
                  <Text>Variables</Text>
                </Inline>
              </div>
            </Box>
          )}
        </ResponsiveLayout>

        {view}
      </Box>
    </AppLayout>
  );
};

export default TokensMap;
