const normalTextMinRatio = 4.5;
const uiElementMinRatio = 3;

export const contrastPairs = [
  {
    fg: [
      "textPrimary",
      "textSecondary",
      "textActivated",
      "textError",
      "textLink",
    ],
    bg: [
      "background",
      "backgroundAlternative",
      "backgroundContainer",
    ],
    minRatio: normalTextMinRatio,
  },
  {
    fg: ["textBrand", "textActivated"],
    bg: ["brandLow"],
    minRatio: normalTextMinRatio,
  },
  {
    fg: [
      "textPrimary",
      "textSecondary",
      "textError",
    ],
    bg: ["backgroundContainerError"],
    minRatio: normalTextMinRatio,
  },
  {
    fg: ["textPrimaryInverse"],
    bg: [
      "brandHigh",
      "backgroundContainerBrandOverInverse",
      "completedStep",
    ],
    minRatio: normalTextMinRatio,
  },
  {
    fg: ["textSecondaryInverse"],
    bg: [
      "backgroundContainerBrand",
      "backgroundContainerBrandOverInverse",
      "backgroundBrand",
    ],
    minRatio: normalTextMinRatio,
  },
  {
    fg: [
      "textPrimaryBrand",
      "textSecondaryBrand",
      "textErrorBrand",
      "textLinkBrand",
    ],
    bg: [
      "backgroundContainerBrand",
      "backgroundContainerBrandOverBrand",
      "backgroundBrand",
      "backgroundBrandSecondary",
    ],
    minRatio: normalTextMinRatio,
  },
  // Buttons
  {
    fg: ["textButtonPrimary"],
    bg: [
      "buttonPrimaryBackground",
      "buttonPrimaryBackgroundHover",
      "buttonPrimaryBackgroundPressed",
      "buttonDangerBackground",
      "buttonDangerBackgroundHover",
      "buttonDangerBackgroundPressed",
    ],
    minRatio: normalTextMinRatio,
  },
  {
    fg: ["textButtonPrimaryInverse"],
    bg: ["buttonPrimaryBackgroundInverse"],
    minRatio: normalTextMinRatio,
  },
  {
    fg: ["textButtonPrimaryBrand"],
    bg: ["buttonPrimaryBackgroundBrand"],
    minRatio: normalTextMinRatio,
  },
  {
    fg: ["textButtonPrimaryMedia"],
    bg: ["buttonPrimaryBackgroundMedia"],
    minRatio: normalTextMinRatio,
  },
  {
    fg: ["textButtonPrimaryNegative"],
    bg: ["buttonPrimaryBackgroundNegative"],
    minRatio: 4.5,
  },
  {
    fg: ["textButtonPrimaryInversePressed"],
    bg: [
      "buttonPrimaryBackgroundInverseHover",
      "buttonPrimaryBackgroundInversePressed",
    ],
    minRatio: normalTextMinRatio,
  },
  {
    fg: ["textButtonPrimaryBrandPressed"],
    bg: [
      "buttonPrimaryBackgroundBrandHover",
      "buttonPrimaryBackgroundBrandPressed",
    ],
    minRatio: normalTextMinRatio,
  },
  {
    fg: ["textButtonPrimaryMediaPressed"],
    bg: [
      "buttonPrimaryBackgroundMediaHover",
      "buttonPrimaryBackgroundMediaPressed",
    ],
    minRatio: normalTextMinRatio,
  },
  {
    fg: ["textButtonPrimaryNegativePressed"],
    bg: [
      "buttonPrimaryBackgroundNegativeHover",
      "buttonPrimaryBackgroundNegativePressed",
    ],
    minRatio: 4.5,
  },
  {
    fg: ["textButtonSecondary"],
    bg: [
      "background",
      "backgroundAlternative",
      "backgroundContainer",
    ],
    minRatio: normalTextMinRatio,
  },
  {
    fg: ["textButtonSecondaryPressed"],
    bg: [
      "buttonSecondaryBackgroundHover",
      "buttonSecondaryBackgroundPressed",
    ],
    minRatio: normalTextMinRatio,
  },
  {
    fg: ["textButtonSecondaryInverse"],
    bg: [
      "backgroundBrand",
      "backgroundContainerBrand",
      "backgroundContainerBrandOverInverse",
      "backgroundBrandSecondary",
    ],
    minRatio: normalTextMinRatio,
  },
  {
    fg: ["textButtonSecondaryInversePressed"],
    bg: [
      "buttonSecondaryBackgroundInverseHover",
      "buttonSecondaryBackgroundInversePressed",
    ],
    minRatio: normalTextMinRatio,
  },
  {
    fg: ["textButtonSecondaryBrand"],
    bg: ["buttonSecondaryBackgroundBrand"],
    minRatio: normalTextMinRatio,
  },
  {
    fg: ["textButtonSecondaryBrandPressed"],
    bg: [
      "buttonSecondaryBackgroundBrandHover",
      "buttonSecondaryBackgroundBrandPressed",
    ],
    minRatio: normalTextMinRatio,
  },
  {
    fg: ["textLinkDanger"],
    bg: [
      "background",
      "backgroundAlternative",
      "backgroundContainer",
      "buttonLinkDangerBackgroundPressed",
    ],
    minRatio: normalTextMinRatio,
  },
  {
    fg: ["textLinkDangerInverse"],
    bg: [
      "buttonLinkDangerBackgroundInverse",
      "buttonLinkDangerBackgroundInversePressed",
    ],
    minRatio: normalTextMinRatio,
  },
  {
    fg: ["textLinkDangerBrand"],
    bg: [
      "buttonLinkDangerBackgroundBrand",
      "buttonLinkDangerBackgroundBrandPressed",
    ],
    minRatio: normalTextMinRatio,
  },
  {
    fg: ["textLinkDangerMedia"],
    bg: [
      "buttonLinkDangerBackgroundMedia",
      "buttonLinkDangerBackgroundMediaPressed",
    ],
    minRatio: normalTextMinRatio,
  },
  // Controls
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
    minRatio: uiElementMinRatio,
  },
  {
    fg: [
      "controlInverse",
      "controlActivatedInverse",
      "inputBorderInverse",
    ],
    bg: [
      "backgroundBrand",
      "backgroundContainerBrand",
    ],
    minRatio: uiElementMinRatio,
  },
  {
    fg: [
      "controlBrand",
      "controlActivatedBrand",
      "inputBorderBrand",
    ],
    bg: [
      "backgroundContainerBrand",
      "backgroundContainerBrandOverBrand",
    ],
    minRatio: uiElementMinRatio,
  },
  //tags
  {
    fg: "tagTextPromo",
    bg: "tagBackgroundPromo",
    minRatio: normalTextMinRatio,
  },
  {
    fg: "tagTextActive",
    bg: "tagBackgroundActive",
    minRatio: normalTextMinRatio,
  },
  {
    fg: "tagTextInactive",
    bg: "tagBackgroundInactive",
    minRatio: normalTextMinRatio,
  },
  {
    fg: "tagTextSuccess",
    bg: "tagBackgroundSuccess",
    minRatio: normalTextMinRatio,
  },
  {
    fg: "tagTextError",
    bg: "tagBackgroundError",
    minRatio: normalTextMinRatio,
  },
  {
    fg: "tagTextWarning",
    bg: "tagBackgroundWarning",
    minRatio: normalTextMinRatio,
  },
  {
    fg: "tagTextInfo",
    bg: "tagBackgroundInfo",
    minRatio: normalTextMinRatio,
  },
  {
    fg: "tagTextPromoInverse",
    bg: "tagBackgroundPromoInverse",
    minRatio: normalTextMinRatio,
  },
  {
    fg: "tagTextActiveInverse",
    bg: "tagBackgroundActiveInverse",
    minRatio: normalTextMinRatio,
  },
  {
    fg: "tagTextInactiveInverse",
    bg: "tagBackgroundInactiveInverse",
    minRatio: normalTextMinRatio,
  },
  {
    fg: "tagTextSuccessInverse",
    bg: "tagBackgroundSuccessInverse",
    minRatio: normalTextMinRatio,
  },
  {
    fg: "tagTextErrorInverse",
    bg: "tagBackgroundErrorInverse",
    minRatio: normalTextMinRatio,
  },
  {
    fg: "tagTextWarningInverse",
    bg: "tagBackgroundWarningInverse",
    minRatio: normalTextMinRatio,
  },
  {
    fg: "tagTextInfoInverse",
    bg: "tagBackgroundInfoInverse",
    minRatio: normalTextMinRatio,
  },
  {
    fg: "tagTextPromoBrand",
    bg: "tagBackgroundPromoBrand",
    minRatio: normalTextMinRatio,
  },
  {
    fg: "tagTextActiveBrand",
    bg: "tagBackgroundActiveBrand",
    minRatio: normalTextMinRatio,
  },
  {
    fg: "tagTextInactiveBrand",
    bg: "tagBackgroundInactiveBrand",
    minRatio: normalTextMinRatio,
  },
  {
    fg: "tagTextSuccessBrand",
    bg: "tagBackgroundSuccessBrand",
    minRatio: normalTextMinRatio,
  },
  {
    fg: "tagTextErrorBrand",
    bg: "tagBackgroundErrorBrand",
    minRatio: normalTextMinRatio,
  },
  {
    fg: "tagTextWarningBrand",
    bg: "tagBackgroundWarningBrand",
    minRatio: normalTextMinRatio,
  },
  {
    fg: "tagTextInfoBrand",
    bg: "tagBackgroundInfoBrand",
    minRatio: normalTextMinRatio,
  },
  //Badge
  {
    fg: "textPrimaryNegative",
    bg: "badge",
    minRatio: normalTextMinRatio,
  },
];
