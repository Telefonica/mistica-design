export const contrastPairs = [
  {
    fg: [
      "textPrimary",
      "textSecondary",
      "textActivated",
      "textError",
      "textButtonSecondary",
      "textLink",
    ],
    bg: [
      "background",
      "backgroundAlternative",
      "backgroundContainer",
    ],
    minRatio: 4.5,
  },
  {
    fg: [
      "textPrimary",
      "textSecondary",
      "textError",
    ],
    bg: ["backgroundContainerError"],
    minRatio: 4.5,
  },

  {
    fg: ["textButtonPrimary"],
    bg: [
      "buttonPrimaryBackground",
      "buttonPrimaryBackgroundHover",
      "buttonPrimaryBackgroundPressed",
    ],
    minRatio: 4.5,
  },
  {
    fg: ["textButtonPrimaryInverse"],
    bg: [
      "buttonPrimaryBackgroundInverse",
      "buttonPrimaryBackgroundInverseHover",
      "buttonPrimaryBackgroundInversePressed",
    ],
    minRatio: 4.5,
  },
  {
    fg: [
      "control",
      "controlActivated",
      "inputBorder",
    ],
    bg: [
      "background",
      "backgroundAlternative",
      "backgroundContainer",
    ],
    minRatio: 3,
  },
  {
    fg: [
      "controlInverse",
      "controlActivatedInverse",
    ],
    bg: [
      "backgroundBrand",
      "backgroundContainerBrand",
    ],
    minRatio: 3,
  },
];
