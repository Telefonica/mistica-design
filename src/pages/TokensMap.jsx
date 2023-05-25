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
  Switch,
  Circle,
  Text,
  skinVars,
  EmptyStateCard,
  IconErrorRegular,
  useTheme,
} from "@telefonica/mistica";
import { useState } from "react";
import { useLocation } from "react-router-dom";

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
  const [active, setActive] = useState(tokenTypeFromUrl || "color");
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(
    branchFromUrl || "pre-production"
  );
  const [selectedColor, setSelectedColor] = useState(
    colorFromUrl || "undefined"
  );
  const [skins, setSkins] = useState({});
  const [colorView, setColorView] = useState("constants");
  const [isError, setIsError] = useState(false);

  // Fetch branches from GitHub

  useEffect(() => {
    const fetchBranches = async () => {
      const response = await fetch(
        `https://api.github.com/repos/Telefonica/mistica-design/branches`
      );
      const data = await response.json();
      setBranches(data.map((branch) => branch.name));
    };
    fetchBranches();
  }, []);

  // Fetch skins from GitHub

  useEffect(() => {
    const fetchSkins = async () => {
      const skinNames = [
        "movistar",
        "movistar-classic",
        "vivo",
        "vivo-new",
        "blau",
        "o2",
        "telefonica",
        "solar-360",
      ];
      const skins = {};

      try {
        for (let i = 0; i < skinNames.length; i++) {
          const skinName = skinNames[i];
          const response = await fetch(
            `https://raw.githubusercontent.com/Telefonica/mistica-design/${selectedBranch}/tokens/${skinName}.json`
          );
          const data = await response.json();
          skins[skinName] = data;
        }

        setSkins(skins);
        setIsError(false); // reset error state when successful
      } catch (error) {
        setIsError(true);
      }
    };

    fetchSkins();
  }, [selectedBranch]);

  // Update URL with selected branch, skin, tokenType and color

  useEffect(() => {
    let queryParams = `?branch=${selectedBranch}&skin=${selectedSkin}&tokenType=${active}`;

    if (selectedColor) {
      queryParams += `&activeColor=${selectedColor}`;
    }

    window.history.pushState({}, "", queryParams);
  }, [selectedBranch, selectedColor, selectedSkin, active]);

  // Filter tokens

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  // Select skins

  let skin;
  switch (selectedSkin) {
    case "movistar":
      skin = skins.movistar;
      break;
    case "movistar-classic":
      skin = skins["movistar-classic"];
      break;
    case "vivo":
      skin = skins.vivo;
      break;
    case "vivo-new":
      skin = skins["vivo-new"];
      break;
    case "blau":
      skin = skins.blau;
      break;
    case "o2":
      skin = skins.o2;
      break;
    case "telefonica":
      skin = skins.telefonica;
      break;
    case "solar-360":
      skin = skins["solar-360"];
      break;
    default:
      skin = skins.movistar;
  }

  // Modify the view depending on the selected chip

  let view;
  switch (active) {
    case "color":
      switch (colorView) {
        case "constants":
          view = (
            <Palette
              skin={skin}
              selectedSkin={selectedSkin}
              filter={filter}
              branch={selectedBranch}
              tokenType={active}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
            />
          );
          break;
        case "variables":
          view = (
            <GlobalPalette
              skin={skin}
              selectedSkin={selectedSkin}
              filter={filter}
              branch={selectedBranch}
              tokenType={active}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
            />
          );
          break;
        case "match":
          view = (
            <ReferencePalette
              skin={skin}
              selectedSkin={selectedSkin}
              filter={filter}
              branch={selectedBranch}
              tokenType={active}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
            />
          );
      }
      break;
    case "radius":
      view = (
        <RadiiTable
          skin={skin}
          selectedSkin={selectedSkin}
          filter={filter}
          tokenType={active}
          branch={selectedBranch}
        />
      );
      break;
    case "text":
      view = (
        <TextTable
          skin={skin}
          selectedSkin={selectedSkin}
          filter={filter}
          tokenType={active}
          branch={selectedBranch}
        />
      );
      break;
  }

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
              <RadioGroup onChange={setActive} name="chip-group" value={active}>
                <Inline space={8}>
                  <RadioButton
                    value="color"
                    render={({ checked, labelId }) => (
                      <Chip active={checked} id={labelId}>
                        Color
                      </Chip>
                    )}
                  />
                  <RadioButton
                    value="radius"
                    render={({ checked, labelId }) => (
                      <Chip active={checked} id={labelId}>
                        Border Radii
                      </Chip>
                    )}
                  />
                  <RadioButton
                    value="text"
                    render={({ checked, labelId }) => (
                      <Chip active={checked} id={labelId}>
                        Typography
                      </Chip>
                    )}
                  />
                </Inline>
              </RadioGroup>

              <Inline space="between" alignItems="center">
                <Inline space={8} fullWidth>
                  <TextField
                    disabled={isError ? true : false}
                    label="Filter tokens"
                    value={filter}
                    onChange={handleFilterChange}
                    placeholder="Search..."
                  />
                  <Select
                    disabled={isError ? true : false}
                    label="Skin"
                    onChangeValue={setSelectedSkin}
                    value={selectedSkin}
                    options={[
                      { value: "movistar", text: "Movistar" },
                      { value: "movistar-classic", text: "Movistar Classic" },
                      { value: "vivo", text: "Vivo" },
                      { value: "vivo-new", text: "Vivo New" },
                      { value: "o2", text: "O2" },
                      { value: "blau", text: "Blau" },
                      { value: "telefonica", text: "Telefonica" },
                      { value: "solar-360", text: "Solar 360" },
                    ]}
                  ></Select>
                  <Select
                    label="Branch"
                    onChangeValue={setSelectedBranch}
                    value={selectedBranch}
                    options={branches.map((branch) => ({
                      value: branch,
                      text: branch,
                    }))}
                  ></Select>
                </Inline>
              </Inline>
            </Stack>
          </Stack>
        </Box>
        {active === "color" && isError === false && (
          <Box paddingBottom={24}>
            <Inline space="between" alignItems="center">
              <RadioGroup
                onChange={setColorView}
                name="chip-group"
                value={colorView}
              >
                <Inline space={8}>
                  <RadioButton
                    value="constants"
                    render={({ checked, labelId }) => (
                      <Chip active={checked} id={labelId}>
                        Constants
                      </Chip>
                    )}
                  />
                  <RadioButton
                    value="variables"
                    render={({ checked, labelId }) => (
                      <Chip active={checked} id={labelId}>
                        Variables
                      </Chip>
                    )}
                  />
                  <RadioButton
                    value="match"
                    render={({ checked, labelId }) => (
                      <Chip active={checked} id={labelId}>
                        Constants / variables
                      </Chip>
                    )}
                  />
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

      {isError ? (
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
