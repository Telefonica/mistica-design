// Las constantes tienen aplicadas dos variables; primero su versión light y a continuación la dark mode. En las constantes que solo se muestra una variable, esta es compartida por ambos modos.

// BACKGROUNDS
appBarBackground = "$white" // "$darkModeGrey"
background = "$white" // "$darkModeBlack"
backgroundContainer = "$white" // "$darkModeGrey"
backgroundBrand = "$movistarBlue" // "$darkModeBlack"
backgroundOverlay = "$grey6" /* alpha 60% */ // "$darkModeBlack" /* alpha 80% */
backgroundSkeleton = "$grey1" // "$grey6" 
backgroundSkeletonInverse = "$movistarBlueDark" // "$grey6"
navigationBarBackground = "$movistarBlue" // "$darkModeBlack"
backgroundAlternative = "$grey1" // "$darkModeGrey" (seguramente mejor darkModeBlack)
backgroundFeedbackBottom = "$movistarBlue" // "$darkModeBlack"

skeletonWave = "$grey2" // "grey5"

// BORDERS
borderLight = "$grey1" // "$darkModeBlack"
border = "$grey3" // "$darkModeGrey"
borderDark = "$grey5"
borderSelected = "$movistarGreen"

// BUTTONS
buttonDangerBackground = "$pepper"
buttonDangerBackgroundDisabled = "$pepperLight30"
buttonDangerBackgroundSelected = "$pepperDark"
buttonDangerBackgroundHover = "$pepperDark" // web only

buttonLinkBackgroundSelected = "$movistarBlueLight10" // "$darkModeGrey"
buttonLinkBackgroundSelectedInverse = "$white" /* alpha 20% */ // "$darkModeGrey"

buttonPrimaryBackground = "$movistarGreen" // "$movistarGreen"
buttonPrimaryBackgroundDisabled = "$movistarGreenLight50" // "$movistarGreenLight50" alpha 40%
buttonPrimaryBackgroundDisabledInverse = "$movistarBlueLight50" // "$movistarGreenLight50" alpha 40%
buttonPrimaryBackgroundInverse = "$white" // "$movistarGreen"
buttonPrimaryBackgroundSelected = "$movistarGreenDark" // "$movistarGreenDark"
buttonPrimaryBackgroundHover = "$movistarGreenDark" // "$movistarGreenDark" // web only
buttonPrimaryBackgroundSelectedInverse = "$movistarBlueLight50" // "$movistarGreenDark"

buttonSecondaryBackground = "$movistarGreen" // "$movistarGreen"
buttonSecondaryBackgroundDisabled = "$movistarGreenLight50" // "$movistarGreenLight50"
buttonSecondaryBackgroundSelected = "$movistarGreenDark" // "$movistarGreenDark"
buttonSecondaryBorderDisabledInverse = "$movistarBlueLight50" // "$movistarGreenLight50" alpha 40% // debería llamarse border? o background? necesitamos consistencia con el resto de los secondary
buttonSecondaryBorderInverse = "$white" // "$movistarGreen" // debería llamarse border? o background? necesitamos consistencia con el resto de los secondary
buttonSecondaryBorderSelectedInverse = "$movistarBlueLight50" // "$movistarGreenDark" // debería llamarse border? o background? necesitamos consistencia con el resto de los secondary

textButtonPrimary = "$white"
[NEW] textButtonPrimaryDisabled = "$white" // "$grey2"
textButtonPrimaryInverse = "$movistarBlue" // "$white"
textButtonPrimaryInverseDisabled = "$movistarBlueLight30" // "$grey5"
textButtonPrimaryInverseSelected = "$movistarBlue" // "$white"

textButtonSecondary = "$movistarGreen" // "$white"
textButtonSecondaryDisabled = "$movistarGreenLight50" // "$movistarGreenLight50" alpha 40%
textButtonSecondarySelected = "$movistarGreenDark" // "$movistarGreenDark"
textButtonSecondaryInverse = "$white"
textButtonSecondaryInverseDisabled = "$movistarBlueLight50" // "$movistarGreenLight50" alpha 40%
textButtonSecondaryInverseSelected = "$white"

textLink = "$movistarBlue" // "$movistarBlue"
textLinkDanger = "$pepper"
textLinkDangerDisabled = "$pepperLight30"
textLinkDisabled = "$movistarBlueLight50" // "$darkModeMovistarBlueDark"
textLinkSnackbar = "$movistarBlueLight50"

// CONTROLS
control = "$grey3" // "$grey6"
controlActivated = "$movistarBlue" // "$movistarBlue"
controlError = "$pepper"
loadingBar = "$movistarGreen" // "$movistarGreen"
loadingBarBackground = "$movistarGreenLight50" // "$movistarGreenLight50"
loadingBarBackgroundInverse = "$movistarBlueDark" // "$movistarGreenDark" // will be deprecated soon
loadingBarInverse = "$movistarBlueLight50" // "$movistarGreenLight50" // will be deprecated soon

toggleAndroidInactive = "$grey2" // "$grey5" //web only
toggleAndroidBackgroundActive = "$movistarBlueLight30" // "$movistarBlueLight30" // web only
toggleIosInactive = "$white" //  web only

// DIVIDERS  
divider = "$grey2" // "$darkModeGrey"
dividerInverse = "$movistarBlueDark" // "$darkModeGrey"
navigationBarDivider = "$movistarBlue" // "$darkModeBlack"

// FEEDBACKS  
badge = "$pepperDark" 
feedbackErrorBackground = "$pepper"
feedbackInfoBackground = "$grey6"

// GLOBAL  
brand = "$movistarBlue" // "$movistarBlueLight50"
brandDark = "$movistarBlueDark" // "$grey6"
inverse = "$white" // "$grey2"
neutralHigh = "$grey6" // "$grey4"
neutralMedium = "$grey5" // "$grey5"
neutralLow = "$grey3" // "$grey6"
promo = "$purple"
highlight = "$pink"

textPrimary = "$grey6" // "$white"
textPrimaryInverse = "$white"
textSecondary = "$grey5" // "$grey4"
textSecondaryInverse = "$white" // "$grey4"
textDisabled = "$grey3" // "$grey5" // veis necesario un textDisabledInverse para textos deshabilitados sobre masa de color?
textAmount = "$movistarBlue"

// STATES
error = "$pepper"
success = "$movistarGreen"
warning = "$egg"

// BARS TEXTS
textNavigationBarPrimary = "$white"
textNavigationBarSecondary = "$movistarBlueLight30" // "$grey4"
textNavigationSearchBarHint = "$movistarBlueLight30" // "$grey4" // iOS only
textNavigationSearchBarText = "$white"// iOS only
textAppBar = "$grey4" // "$grey5"
textAppBarSelected = "$movistarBlue"  // "$white"
