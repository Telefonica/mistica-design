import React, { useContext, useState } from "react";
import {
  ResponsiveLayout,
  ButtonPrimary,
  ThemeContextProvider,
  ToggleIconButton,
  IconMoonFilled,
  IconSunFilled,
  Tag,
  Stack,
  Inline,
  ButtonSecondary,
  ButtonLink,
  ButtonDanger,
  ButtonLinkDanger,
  MediaCard,
  DataCard,
  DisplayDataCard,
  DisplayMediaCard,
  PosterCard,
  SnapCard,
  HighlightedCard,
  Title1,
  Avatar,
  Callout,
  RadioGroup,
  RadioButton,
  Checkbox,
  Switch,
  Chip,
  Icon3GRegular,
  IconLightningFilled,
  Select,
  Box,
  RowList,
  Row,
  BoxedRowList,
  BoxedRow,
  Accordion,
  AccordionItem,
  BoxedAccordion,
  BoxedAccordionItem,
} from "@telefonica/mistica";
import { generateCustomSkin } from "../../helpers/generateCustomSkin";
import { SchemeContext } from "../../App";

const SkinPreview = ({ skin }) => {
  const generatedSkin = generateCustomSkin("Custom", skin, skin.global.palette);
  const [themeVariant, setThemeVariant] = useState("default");
  const [colorScheme, setColorScheme] = useState("light");

  const { theme, setTheme } = useContext(SchemeContext);

  console.log(generatedSkin);

  return (
    <ThemeContextProvider
      theme={{
        skin: generatedSkin,
        i18n: { locale: "es-ES", phoneNumberFormattingRegionCode: "ES" },
        colorScheme: theme,
      }}
    >
      <ResponsiveLayout>
        <Box paddingY={16}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 16,
            }}
          >
            <Select
              label="Theme variant"
              onChangeValue={setThemeVariant}
              value={themeVariant}
              options={[
                { value: "default", text: "Default" },
                { value: "inverse", text: "Inverse" },
                { value: "alternative", text: "Alternative" },
              ]}
            ></Select>
            <ToggleIconButton
              checkedProps={{ Icon: IconSunFilled, label: "Light mode" }}
              uncheckedProps={{ Icon: IconMoonFilled, label: "Dark mode" }}
              onChange={() =>
                theme === "light" ? setTheme("dark") : setTheme("light")
              }
            />
          </div>
        </Box>
      </ResponsiveLayout>
      <ResponsiveLayout variant={themeVariant}>
        <Box paddingY={32}>
          <Stack space={32}>
            <Title1>Avatar</Title1>
            <Inline space={8}>
              <Avatar size={64} />
              <Avatar size={64} initials="TS" />
              <Avatar size={64} badge />
              <Avatar size={64} badge={8} />
            </Inline>
            <Title1>Tag</Title1>
            <Inline space={8}>
              {Array.from([
                "promo",
                "active",
                "inactive",
                "success",
                "warning",
                "error",
              ]).map((type, index) => (
                <Tag key={index} type={type}>
                  Tag label
                </Tag>
              ))}
            </Inline>
            <Title1>Buttons</Title1>
            <Inline space={8} alignItems="center">
              <ButtonPrimary onPress={() => {}}>Test</ButtonPrimary>
              <ButtonSecondary onPress={() => {}}>Test</ButtonSecondary>
              <ButtonLink onPress={() => {}}>Test</ButtonLink>
              <ButtonDanger onPress={() => {}}>Test</ButtonDanger>
              <ButtonLinkDanger onPress={() => {}}>Test</ButtonLinkDanger>
            </Inline>
            <Title1>Controls</Title1>
            <Inline space={8} alignItems="center">
              <Stack space={16}>
                <RadioGroup>
                  <Inline space={24}>
                    {Array.from({ length: 3 }, (_, idx) => (
                      <RadioButton key={idx} value={idx + 1}>
                        Value {idx}
                      </RadioButton>
                    ))}
                  </Inline>
                </RadioGroup>
                <Checkbox>Checkbox</Checkbox>
                <Switch>Switch</Switch>
              </Stack>
            </Inline>
            <Title1>Chips</Title1>
            <Inline space={8} alignItems="center">
              <Chip>Chip</Chip>
              <Chip Icon={IconLightningFilled}>Chip with icon</Chip>
              <Chip active>Chip active</Chip>
              <Chip Icon={IconLightningFilled} active>
                Chip active with icon
              </Chip>
              <Chip badge={8}>Chip with badge</Chip>
            </Inline>

            <Title1>Cards</Title1>
            <Inline space={8} alignItems="center">
              <MediaCard title="Title" description="Description"></MediaCard>
              <DataCard title="Title" description="Description"></DataCard>
              <DisplayDataCard
                title="Title"
                description="Description"
              ></DisplayDataCard>
              <DisplayMediaCard
                title="Title"
                description="Description"
              ></DisplayMediaCard>
              <PosterCard title="Title" description="Description"></PosterCard>
              <SnapCard title="Title" subtitle="Description"></SnapCard>
              <HighlightedCard
                title="Title"
                description="Description"
              ></HighlightedCard>
            </Inline>
            <Title1>Callout</Title1>
            <Inline space={8} alignItems="center">
              <Callout
                onClose={() => {}}
                title="Title"
                description="Description"
              ></Callout>
            </Inline>
            <Title1>Lists</Title1>
            <Stack space={16}>
              <RowList>
                {Array.from({ length: 2 }, (_, idx) => (
                  <Row
                    title="Title"
                    description="Description"
                    onPress={[() => {}, () => {}][idx]}
                    detail="Detail"
                    checkbox={[undefined, true][idx]}
                  ></Row>
                ))}
              </RowList>
              <BoxedRowList>
                {Array.from({ length: 2 }, (_, idx) => (
                  <BoxedRow
                    title="Title"
                    description="Description"
                    onPress={[() => {}, () => {}][idx]}
                    detail="Detail"
                    checkbox={[undefined, true][idx]}
                  ></BoxedRow>
                ))}
              </BoxedRowList>
            </Stack>
            <Title1>Accordion</Title1>
            <Stack space={16}>
              <Accordion index={0}>
                <AccordionItem
                  title="Title"
                  content="Accordion content"
                ></AccordionItem>
              </Accordion>
              <BoxedAccordion index={0}>
                <BoxedAccordionItem
                  title="Title"
                  content="Accordion content"
                ></BoxedAccordionItem>
              </BoxedAccordion>
            </Stack>
          </Stack>
        </Box>
      </ResponsiveLayout>
    </ThemeContextProvider>
  );
};

export default SkinPreview;
