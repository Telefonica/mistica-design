import { findItemWithHighestCount, separateItems } from "./utils";
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
  { name: "Slot", count: 119937, usedBy: 105 },
  { name: "Boxed row", count: 118908, usedBy: 96, lastCount: 139371 },
  { name: "Title 1", count: 118014, usedBy: 87, lastCount: 122903 },
  { name: "Button group", count: 114149, usedBy: 120 },
  { name: "Divider", count: 109719, usedBy: 130 },
  {
    name: "iOS navigation bar + status bar",
    count: 105114,
    usedBy: 106,
    lastCount: 100211,
  },
];

export const Components = () => {
  function calculatePercentageChange(currentCount, lastCount) {
    if (lastCount === undefined) {
      return ""; // or any other value you prefer for this case
    }

    const percentageChange = ((currentCount - lastCount) / lastCount) * 100;
    return `${parseFloat(percentageChange.toFixed(2))}% from last year`;
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

const mostUsedFigmaIcons = [
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
  { name: "Menu regular", count: 17251, icon: <IconMenuRegular /> },
  { name: "Kebab menu light", count: 15999, icon: <IconKebabMenuLight /> },
  { name: "Checked filled", count: 13613, icon: <IconCheckedFilled /> },
  { name: "Check regular", count: 13471, icon: <IconCheckRegular /> },
  {
    name: "Mobile device regular",
    count: 13399,
    icon: <IconMobileDeviceRegular />,
  },
];

export const Icons = () => {
  const iconWithHighestCount = findItemWithHighestCount(mostUsedFigmaIcons);
  const restOfMostUsedIcons = separateItems(
    mostUsedFigmaIcons,
    iconWithHighestCount
  ).restOfItems;

  return { iconWithHighestCount, restOfMostUsedIcons };
};

export const newComponents = [
  { name: "Counter", release: "11" },
  { name: "Accordion", release: "11" },
  { name: "Title 3", release: "10" },
  { name: "Actions Sheet", release: "10" },
  { name: "Naked card", release: "10" },
  { name: "Naked small card", release: "10" },
  { name: "Stacking group", release: "9" },
  { name: "Grid", release: "9" },
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
  "Design Core",
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
  "Mística Design System",
  "Seniors",
  "B2P",
  "Telefónica - TCCT",
  "Telefónica - NT Telco-Id",
  "Living Apps",
];
