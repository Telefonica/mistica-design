import React, { useEffect } from "react";
import ReferencePalette from "../components/referencePalette";
import Palette from "../components/Palette";
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
} from "@telefonica/mistica";
import { useState } from "react";
import { useLocation } from "react-router-dom";

const TokensMap = () => {
  // use query params to load the page in the selected state

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
    branchFromUrl || "production"
  );
  const [selectedColor, setSelectedColor] = useState(
    colorFromUrl || "undefined"
  );
  const [skins, setSkins] = useState({});
  const [reference, setReference] = useState(false);

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

      for (let i = 0; i < skinNames.length; i++) {
        const skinName = skinNames[i];
        const response = await fetch(
          `https://raw.githubusercontent.com/Telefonica/mistica-design/${selectedBranch}/tokens/${skinName}.json`
        );
        const data = await response.json();
        skins[skinName] = data;
      }

      setSkins(skins);
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
      view =
        reference === true ? (
          <ReferencePalette
            skin={skin}
            selectedSkin={selectedSkin}
            filter={filter}
            branch={selectedBranch}
            tokenType={active}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
          />
        ) : (
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
    default:
      view =
        reference === true ? (
          <ReferencePalette
            skin={skin}
            selectedSkin={selectedSkin}
            filter={filter}
            branch={selectedBranch}
            tokenType={active}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
          />
        ) : (
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
  }

  return (
    <>
      <ResponsiveLayout>
        <Box paddingY={48}>
          <ButtonLink aligned to={`/`}>
            Go back
          </ButtonLink>
          <Stack space={24}>
            <Title2>Mística tokens</Title2>
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
              <Inline space={8}>
                <TextField
                  label="Filter tokens"
                  value={filter}
                  onChange={handleFilterChange}
                  placeholder="Search..."
                />
                <Select
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
        </Box>
        {active === "color" && (
          <Box paddingBottom={24}>
            <Inline space="between" alignItems="center">
              <Switch
                onChange={setReference}
                value={reference}
                checked={reference === true}
              >
                See color by reference
              </Switch>
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

      {view}
    </>
  );
};

export default TokensMap;
