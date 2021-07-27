import palette from './movistar-palette'

// Las constantes tienen aplicadas dos variables,
// primero su versión light y a continuación la dark mode.
// En las constantes que solo se muestra una variable, esta es compartida por ambos modos.

export const colors = {
    // BACKGROUNDS
    appBarBackground: palette.white || palette.darkModeGrey,
    background: palette.white || palette.darkModeBlack,
    backgroundContainer: palette.white || palette.darkModeGrey,
    backgroundBrand: palette.movistarBlue || palette.darkModeBlack,
    backgroundOverlay: (palette.grey6, 0.6) || (palette.darkModeGrey, 0.8),
    backgroundSkeleton: palette.grey1 || palette.grey6 ,
    backgroundSkeletonInverse: palette.movistarBlueDark || palette.grey6,
    navigationBarBackground: palette.movistarBlue || palette.darkModeBlack,
    backgroundAlternative: palette.grey1 || palette.darkModeGrey,
    backgroundFeedbackBottom: palette.movistarBlue || palette.darkModeBlack,

    skeletonWave: palette.grey2 || palette.grey5,

    // BORDERS
    borderLight: palette.grey1 || palette.darkModeBlack,
    border: palette.grey3 || palette.darkModeGrey,
    borderDark: palette.grey5,
    borderSelected: palette.movistarGreen,

    // BUTTONS
    buttonDangerBackground: palette.pepper,
    buttonDangerBackgroundDisabled: palette.pepperLight30 || palette.darkModeGrey,
    buttonDangerBackgroundSelected: palette.pepperDark,
    buttonDangerBackgroundHover: palette.pepperDark, // web only

    buttonLinkBackgroundSelected: palette.movistarBlueLight10 || (palette.white, 0.05),
    buttonLinkBackgroundSelectedInverse: (palette.white, 0.2)|| (palette.white, 0.05),

    buttonPrimaryBackground: palette.movistarGreen || palette.movistarGreen,
    buttonPrimaryBackgroundDisabled: palette.movistarGreenLight50 || palette.darkModeGrey,
    buttonPrimaryBackgroundDisabledInverse: palette.movistarBlueLight50 || palette.darkModeGrey,
    buttonPrimaryBackgroundInverse: palette.white || palette.movistarGreen,
    buttonPrimaryBackgroundSelected: palette.movistarGreenDark || palette.movistarGreenDark,
    buttonPrimaryBackgroundHover: palette.movistarGreenDark || palette.movistarGreenDark, // web only
    buttonPrimaryBackgroundSelectedInverse: palette.movistarBlueLight50 || palette.movistarGreenDark,

    buttonSecondaryBackground: palette.movistarGreen || palette.movistarGreen,
    buttonSecondaryBackgroundDisabled: palette.movistarGreenLight50 || palette.darkModeGrey,
    buttonSecondaryBackgroundSelected: palette.movistarGreenDark || palette.movistarGreenDark,
    buttonSecondaryBorderDisabledInverse: palette.movistarBlueLight50 || palette.darkModeGrey,
    buttonSecondaryBorderInverse: palette.white || palette.movistarGreen,
    buttonSecondaryBorderSelectedInverse: palette.movistarBlueLight50 || palette.movistarGreenDark,

    textButtonPrimary: palette.white || palette.grey2,
    textButtonPrimaryDisabled: palette.white || palette.grey5,
    textButtonPrimaryInverse: palette.movistarBlue || palette.grey2,
    textButtonPrimaryInverseDisabled: palette.movistarBlueLight30 || palette.grey5,
    textButtonPrimaryInverseSelected: palette.movistarBlue || palette.grey2,

    textButtonSecondary: palette.movistarGreen || palette.grey2,
    textButtonSecondaryDisabled: palette.movistarGreenLight50 || palette.grey5,
    textButtonSecondarySelected: palette.movistarGreenDark || palette.movistarGreenDark,
    textButtonSecondaryInverse: palette.white || palette.grey2,
    textButtonSecondaryInverseDisabled: palette.movistarBlueLight50 || palette.grey5,
    textButtonSecondaryInverseSelected: palette.white || palette.movistarGreenDark,

    textLink: palette.movistarBlue || palette.movistarBlue,
    textLinkInverse: palette.white || palette.movistarBlue,
    textLinkDanger: palette.pepper,
    textLinkDangerDisabled: palette.pepperLight30 || palette.grey5,
    textLinkDisabled: palette.movistarBlueLight50 || palette.grey6,
    textLinkSnackbar: palette.movistarBlueLight50,

    // CONTROLS
    control: palette.grey3 || palette.grey6,
    controlActivated: palette.movistarBlue || palette.movistarBlue,
    controlError: palette.pepper,
    loadingBar: palette.movistarBlueLight50 || palette.movistarBlue,
    loadingBarBackground: palette.movistarBlueDark || palette.grey6,

    toggleAndroidInactive: palette.grey2 || palette.grey4, // web only
    toggleAndroidBackgroundActive: palette.movistarBlueLight30 || palette.movistarBlueLight30, // web only
    iosControlKnob: palette.white || palette.grey2, // web only

    // DIVIDERS  
    divider: palette.grey2 || (palette.white, 0.05),
    dividerInverse: palette.movistarBlueDark || (palette.white, 0.05),
    navigationBarDivider: palette.movistarBlue || palette.darkModeBlack,

    // FEEDBACKS  
    badge: palette.pepperDark, 
    feedbackErrorBackground: palette.pepper,
    feedbackInfoBackground: palette.grey6,

    // GLOBAL  
    brand: palette.movistarBlue,
    brandDark: palette.movistarBlueDark || palette.grey6,
    inverse: palette.white || palette.grey2,
    neutralHigh: palette.grey6 || palette.grey2  ,
    neutralMedium: palette.grey5 || palette.grey5,
    neutralLow: palette.grey3 || palette.grey6,
    promo: palette.purple,
    highlight: palette.pink,

    textPrimary: palette.grey6 || palette.grey2,
    textPrimaryInverse: palette.white || palette.grey2,
    textSecondary: palette.grey5 || palette.grey4,
    textSecondaryInverse: palette.white || palette.grey4,
    textDisabled: palette.grey3 || palette.grey5, // veis necesario un textDisabledInverse para textos deshabilitados sobre masa de color?
    textAmount: palette.movistarBlue || palette.movistarBlueLight50,

    // STATES
    error: palette.pepper,
    success: palette.movistarGreen,
    warning: palette.egg,

    // BARS TEXTS
    textNavigationBarPrimary: palette.white || palette.grey2,
    textNavigationBarSecondary: palette.movistarBlueLight30 || palette.grey4,
    textNavigationSearchBarHint: palette.movistarBlueLight30 || palette.grey4, // iOS only
    textNavigationSearchBarText: palette.white || palette.grey2, // iOS only
    textAppBar: palette.grey4 || palette.grey5,
    textAppBarSelected: palette.movistarBlue  || palette.grey2,
};