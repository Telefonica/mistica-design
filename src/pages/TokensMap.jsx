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
} from "@telefonica/mistica";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import GetSkin from "../helpers/getSkin";
import { GetBrands } from "../helpers/getBrands";

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
  const { skinData, skinError } = GetSkin({ branch: selectedBranch });
  const brandNames = GetBrands(selectedBranch);
  const [colorView, setColorView] = useState("constants");

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

  let skin = skinData[selectedSkin] || skinData.movistar;

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
                    disabled={skinError ? true : false}
                    label="Filter tokens"
                    value={filter}
                    onChange={handleFilterChange}
                    placeholder="Search..."
                  />
                  <Select
                    disabled={skinError ? true : false}
                    label="Skin"
                    onChangeValue={setSelectedSkin}
                    value={selectedSkin}
                    options={brandNames}
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
        {active === "color" && skinError === false && (
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
