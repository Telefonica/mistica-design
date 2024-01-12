import { findItemWithHighestCount, separateItems } from "../utils";
import {
  IconArrowDropDownFilled,
  IconCheckRegular,
  IconCheckedFilled,
  IconChevronDownRegular,
  IconCloseRegular,
  IconKebabMenuLight,
  IconMenuRegular,
  IconMobileDeviceRegular,
} from "@telefonica/mistica";

///Components /////////////////////////////////

const mostUsedFigmaComponents = [
  { name: "Row", count: 483546, usedBy: 108, lastCount: 365764 },
  { name: "Tag", count: 163618, usedBy: 141 },
  { name: "Boxed row", count: 118908, usedBy: 96, lastCount: 139371 },
  { name: "Title 1", count: 117702, usedBy: 96, lastCount: 139371 },
];

export const Components = () => {
  function calculatePercentageChange(currentCount, lastCount) {
    if (lastCount === undefined) {
      return ""; // or any other value you prefer for this case
    }

    const percentageChange = ((currentCount - lastCount) / lastCount) * 100;
    const formattedChange = parseFloat(percentageChange.toFixed(2));
    return `${formattedChange > 0 ? "+" : ""}${formattedChange}%`;
  }

  const componentsWithPercentageChange = mostUsedFigmaComponents.map(
    ({ name, count, lastCount, usedBy }) => ({
      name,
      count,
      lastCount,
      usedBy,
      percentageChange: calculatePercentageChange(count, lastCount),
    })
  );

  const componentWithHighestCount = findItemWithHighestCount(
    componentsWithPercentageChange
  );

  const restOfMostUsedComponents = componentsWithPercentageChange.filter(
    (item) => item !== componentWithHighestCount
  );

  return { componentWithHighestCount, restOfMostUsedComponents };
};

///Icons /////////////////////////////////

export const Icons = [
  { name: "Close regular", count: 33508, icon: <IconCloseRegular /> },
  {
    name: "Chevron down regular",
    count: 26767,
    icon: <IconChevronDownRegular />,
  },
  {
    name: "Arrow dropdown filled",
    count: 21499,
    icon: <IconArrowDropDownFilled />,
  },

  /*
  { name: "Menu regular", count: 17251, icon: <IconMenuRegular /> },
  { name: "Kebab menu light", count: 15999, icon: <IconKebabMenuLight /> },
  { name: "Checked filled", count: 13613, icon: <IconCheckedFilled /> },
  { name: "Check regular", count: 13471, icon: <IconCheckRegular /> },
  {
    name: "Mobile device regular",
    count: 13399,
    icon: <IconMobileDeviceRegular />,
  },
  */
];

export const newComponents = [
  { name: "Slider", figmaRelease: "12.0.0", webRelease: "14.25.0" },
  { name: "Progress stepped", figmaRelease: "11.1.0", webRelease: "14.26.0" },
  { name: "PinField", figmaRelease: "11.1.0", webRelease: "14.26.0" },
  { name: "Counter", figmaRelease: "11.0.0", webRelease: "14.29.0" },
  { name: "Accordion", figmaRelease: "11.0.0", webRelease: "14.26.0" },
  { name: "Title 3", figmaRelease: "10.0.0", webRelease: "14.20.0" },
  { name: "Actions Sheet", figmaRelease: "10.0.0", webRelease: "14.21.0" },
  { name: "Naked card", figmaRelease: "10.0.0", webRelease: "14.18.0" },
  { name: "Naked small card", figmaRelease: "10.0.0", webRelease: "14.18.0" },
  { name: "Stacking group", figmaRelease: "9.0.0", webRelease: "14.11.0" },
  { name: "Grid", figmaRelease: "9.0.0", webRelease: "14.11.0" },
  { name: "Hero", figmaRelease: "8.0.0", webRelease: "13.3.0" },
  { name: "Mosaic", figmaRelease: "12.0.0", webRelease: "13.3.0" },
  { name: "Loading Screen", figmaRelease: "12.0.0", webRelease: "13.3.0" },
];

export const topTeams = {
  mobile: [
    { name: "Vivo", count: 68 },
    { name: "Smart WiFi - APP - Movistar/Vivo", count: 8 },
    { name: "Mi Movistar", count: 4 },
    { name: "CDP", count: 3 },
    { name: "Telefónica - NT", count: 2 },
  ],
  desktop: [
    { name: "Vivo", count: 25 },
    { name: "CMS", count: 19 },
    { name: "Digital Growth", count: 15 },
    { name: "Fonditel", count: 11 },
    { name: "Metaverso", count: 8 },
  ],
};

export const teams = [
  "Vivo",
  "CMS",
  "Digital Growth",
  "Fonditel",
  "Metaverso",
  "Telefónica - Latch",
  "O2 España",
  "Open gateway",
  "O2 - Paradigma",
  "O2 ES",
  "Telefónica - Core Innovation",
  "Mi Movistar",
  "Telefónica - TEFD (DC)",
  "CDP",
  "Telefónica - NT",
  "Content Design",
  "Smart WiFi - APP - Movistar/Vivo",
  "DIPA | Digital Payments - Global checkout",
  "Mi Gestión Digital",
  "Ecuador eCare",
  "Cross-Cutting",
  "Telefónica - NT BR",
  "Smart WiFi - Living App",
  "Video & Entertainment Innovation",
  "Mein O2 & Blau",
  "Solar 360",
  "Comms & Markets",
  "Vivo - INDI - DAET",
  "LIBRERIAS SMART WIFI",
  "Graphene Design System",
  "Telefónica",
  "My O2",
  "Movistar Home",
  "EC - App Mi Movistar",
  "Equinox xFactor",
  "Aura",
  "Seniors",
  "B2P",
  "Telefónica - TCCT",
  "Telefónica - NT Telco-Id",
  "Living Apps",
];

{
  /* 
{ name: "Title 1", count: 118014, usedBy: 87, lastCount: 122903 },
{ name: "Button group", count: 114149, usedBy: 120 },
{ name: "Divider", count: 109719, usedBy: 130 },
{
  name: "iOS navigation bar + status bar",
  count: 105114,
  usedBy: 106,
  lastCount: 100211,
},*/
}
