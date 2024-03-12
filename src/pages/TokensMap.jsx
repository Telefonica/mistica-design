import React, { useEffect } from "react";
import ReferencePalette from "../components/referencePalette";
import Palette from "../components/Palette";
import GlobalPalette from "../components/globalPalette";
import RadiiTable from "../components/borderRadii";
import TextTable from "../components/typography";
import {
  Box,
  ButtonLink,
  Chip,
  Inline,
  ResponsiveLayout,
  Select,
  Stack,
  TextField,
  RadioButton,
  RadioGroup,
  Title2,
  Circle,
  Text,
  skinVars,
  EmptyStateCard,
  IconErrorRegular,
  useScreenSize,
} from "@telefonica/mistica";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import GetSkin from "../helpers/getSkin";
import GetBranches from "../helpers/getBranches";

const TokensMap = () => {
  // use query params to load the page in the selected state coming from a detail

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const branchFromUrl = queryParams.get("branch");
  const colorFromUrl = queryParams.get("activeColor");
  const skinFromUrl = queryParams.get("skin");
  const tokenTypeFromUrl = queryParams.get("tokenType");

  const [filter, setFilter] = useState("");
  const [selectedSkin, setSelectedSkin] = useState(skinFromUrl || "movistar");
  const [activeTokenType, setActiveTokenType] = useState(
    tokenTypeFromUrl || "color"
  );
  const [selectedBranch, setSelectedBranch] = useState(
    branchFromUrl || "production"
  );
  const [selectedColor, setSelectedColor] = useState(
    colorFromUrl || "undefined"
  );
  const { skinData, skinNames, skinError } = GetSkin({
    branch: selectedBranch,
  });
  const [colorView, setColorView] = useState("constants");
  const { isMobile } = useScreenSize();

  const branches = GetBranches();

  // Update URL with selected branch, skin, tokenType and color

  useEffect(() => {
    let queryParams = `?branch=${selectedBranch}&skin=${selectedSkin}&tokenType=${activeTokenType}`;

    if (selectedColor) {
      queryParams += `&activeColor=${selectedColor}`;
    }

    window.history.pushState({}, "", queryParams);
  }, [selectedBranch, selectedColor, selectedSkin, activeTokenType]);

  // Filter tokens

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  // Select skins

  let skin = skinData[selectedSkin] || skinData.movistar;

  const TOKEN_FILTERS = {
    color: "Color",
    radius: "Border Radii",
    text: "Typography",
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
  };
  // Modify the view depending on the selected chip

  const Component = VIEWS[activeTokenType][colorView] || VIEWS[activeTokenType];

  const view = (
    <Component
      skin={skin}
      selectedSkin={selectedSkin}
      filter={filter}
      tokenType={activeTokenType}
      branch={selectedBranch}
      selectedColor={selectedColor}
      setSelectedColor={setSelectedColor}
    />
  );

  const filters = [
    <TextField
      fullWidth
      disabled={skinError ? true : false}
      label="Filter tokens"
      value={filter}
      onChange={handleFilterChange}
      placeholder="Search..."
    />,
    <Select
      fullWidth
      disabled={skinError ? true : false}
      label="Skin"
      onChangeValue={setSelectedSkin}
      value={selectedSkin}
      options={skinNames}
    ></Select>,
    <Select
      fullWidth
      label="Branch"
      onChangeValue={setSelectedBranch}
      value={selectedBranch}
      options={branches.map((branch) => ({
        value: branch.startsWith("#") ? `%23${branch.substring(1)}` : branch,
        text: branch,
      }))}
    ></Select>,
  ];

  return (
    <Box paddingBottom={80}>
      <ResponsiveLayout>
        <Box paddingY={48}>
          <Stack space={32}>
            <Stack space={24}>
              <ButtonLink aligned to={`/`}>
                Go back
              </ButtonLink>
              <Title2>Mística tokens</Title2>
            </Stack>
            <Stack space={24}>
              <RadioGroup
                onChange={setActiveTokenType}
                name="chip-group"
                value={activeTokenType}
              >
                <Inline space={8}>
                  {Array.from(
                    { length: Object.keys(TOKEN_FILTERS).length },
                    (_, idx) => (
                      <RadioButton
                        value={Object.keys(TOKEN_FILTERS)[idx]}
                        render={({ checked, labelId }) => (
                          <Chip active={checked} id={labelId}>
                            {Object.values(TOKEN_FILTERS)[idx]}
                          </Chip>
                        )}
                      />
                    )
                  )}
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
        {activeTokenType === "color" && skinError === false && (
          <Box paddingBottom={24}>
            <Inline space="between" alignItems="center">
              <RadioGroup
                onChange={setColorView}
                name="chip-group"
                value={colorView}
              >
                <Inline space={8}>
                  {Array.from({ length: 3 }, (_, idx) => (
                    <RadioButton
                      value={Object.keys(COLOR_FILTERS)[idx]}
                      render={({ checked, labelId }) => (
                        <Chip active={checked} id={labelId}>
                          {Object.values(COLOR_FILTERS)[idx]}
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
                <Circle size={24} backgroundColor={skinVars.colors.successLow}>
                  <Circle
                    size={8}
                    backgroundColor={skinVars.colors.successHigh}
                  ></Circle>
                </Circle>
                <Text>Variables</Text>
              </Inline>
            </Inline>
          </Box>
        )}
      </ResponsiveLayout>

      {skinError ? (
        <ResponsiveLayout>
          <EmptyStateCard
            icon={
              <IconErrorRegular
                size={40}
                color={skinVars.colors.error}
              ></IconErrorRegular>
            }
            title="Error retrieving the tokens"
            description={`The branch ${selectedBranch} may not have token files or there's a problem fetching them from GitHub.`}
          />
        </ResponsiveLayout>
      ) : (
        view
      )}
    </Box>
  );
};

export default TokensMap;
