// Las constantes tienen aplicadas dos variables; primero su versión light y a continuación la dark mode. En las constantes que solo se muestra una variable, esta es compartida por ambos modos.

// BACKGROUNDS
appBarBackground = "$white" // "$darkModeGrey"
background = "$white" // "$darkModeBlack"
backgroundContainer = "$white" // "$darkModeGrey"
backgroundBrand = "$movistarBlue" // "$darkModeBlack"
backgroundOverlay = "$grey6" /* alpha 60% */ 
backgroundSkeleton = "$grey1" // "$grey6"
backgroundSkeletonInverse = "$movistarBlueDark"
navigationBarBackground = "$movistarBlue" // "$darkModeBlack"
backgroundAlternative = "$grey1" // "$darkModeGrey"
backgroundFeedbackBottom = "$movistarBlue" // "$darkModeBlack"

skeletonWave = "$grey2"

// BORDERS
borderLight = "$grey1"
border = "$grey3" // "$darkModeGrey"
borderDark = "$grey5" // "$grey5"
borderSelected = "$movistarGreen"

// BUTTONS
buttonDangerBackground = "$pepper"
buttonDangerBackgroundDisabled = "$pepperLight30"
buttonDangerBackgroundSelected = "$pepperDark"
buttonDangerBackgroundHover = "$pepperDark" // web only

buttonLinkBackgroundSelected = "$movistarBlueLight10" // "$darkModeGrey"
buttonLinkBackgroundSelectedInverse = "$white" /* alpha 20% */ // "$darkModeGrey"

buttonPrimaryBackground = "$movistarGreen" // "$movistarGreenLight50"
buttonPrimaryBackgroundDisabled = "$movistarGreenLight50" // "$darkModeMovistarGreenDark" alpha 40%
buttonPrimaryBackgroundDisabledInverse = "$movistarBlueLight50" // "$darkModeMovistarGreenDark" alpha 40%
buttonPrimaryBackgroundInverse = "$white" // "$movistarGreenLight50"
buttonPrimaryBackgroundSelected = "$movistarGreenDark" // "$movistarGreenLight10"
buttonPrimaryBackgroundHover = "$movistarGreenDark" // "$movistarGreenLight10" // web only
buttonPrimaryBackgroundSelectedInverse = "$movistarBlueLight50" // "$movistarGreenLight10"

buttonSecondaryBackground = "$movistarGreen" // "$movistarGreenLight50"
buttonSecondaryBackgroundDisabled = "$movistarGreenLight50" // "$darkModeMovistarGreenDark"
buttonSecondaryBackgroundSelected = "$movistarGreenDark" // "$movistarGreenLight10"
buttonSecondaryBorderDisabledInverse = "$movistarBlueLight50" // "$darkModeMovistarGreenDark" // debería llamarse border? o background? necesitamos consistencia con el resto de los secondary
buttonSecondaryBorderInverse = "$white" // "$movistarGreenLight50" // debería llamarse border? o background? necesitamos consistencia con el resto de los secondary
buttonSecondaryBorderSelectedInverse = "$movistarBlueLight50" // "$movistarGreenLight10" // debería llamarse border? o background? necesitamos consistencia con el resto de los secondary

textButtonPrimary = "$white" // "$darkModeBlack"
[NEW] textButtonPrimaryDisabled = "$white" // "$grey5"
textButtonPrimaryInverse = "$movistarBlue" // "$darkModeBlack"
textButtonPrimaryInverseDisabled = "$movistarBlueLight30" // "$grey5"
textButtonPrimaryInverseSelected = "$movistarBlue" // "$darkModeBlack"

textButtonSecondary = "$movistarGreen" // "$movistarGreenLight50"
textButtonSecondaryDisabled = "$movistarGreenLight50" // "$darkModeMovistarGreenDark"
textButtonSecondarySelected = "$movistarGreenDark" // "$movistarGreenLight10"
textButtonSecondaryInverse = "$white" // "$movistarGreenLight50"
textButtonSecondaryInverseDisabled = "$movistarBlueLight50" // "$darkModeMovistarGreenDark"
textButtonSecondaryInverseSelected = "$white" // "$movistarGreenLight10"

textLink = "$movistarBlue" // "$movistarBlueLight50"
textLinkDanger = "$pepper"
textLinkDangerDisabled = "$pepperLight30"
textLinkDisabled = "$movistarBlueLight50" // "$darkModeMovistarBlueDark"
textLinkSnackbar = "$movistarBlueLight50" // podría usar textLink

// CONTROLS
control = "$grey3" // "$grey1"
controlActivated = "$movistarBlue" // "$movistarBlueLight50"
controlError = "$pepper"
loadingBar = "$movistarGreen" // "$movistarGreenLight50"
loadingBarBackground = "$movistarGreenLight50" // "$movistarGreenLight10"
loadingBarBackgroundInverse = "$movistarBlueDark" // "$movistarGreenLight10"
loadingBarInverse = "$movistarBlueLight50" // "$movistarGreenLight50"

toggleAndroidInactive = "$grey2" // web only
toggleAndroidBackgroundActive = "$movistarBlueLight30" // web only
toggleIosInactive = "$white" // web only

// DIVIDERS  
divider = "$grey2" // "$grey6"
dividerInverse = "$movistarBlueDark" // "$darkModeMovistarBlueDark"
navigationBarDivider = "$movistarBlue" // "$darkModeBlack" // realmente usa el mismo color de la navbar.. igual no lo necesitamos

// FEEDBACKS  
badge = "$pepperDark"
feedbackErrorBackground = "$pepper" // se podría usar neutralHigh en los snackbars y cargarnos esta
feedbackInfoBackground = "$grey6" // se podría usar neutralHigh en los snackbars y cargarnos esta

// GLOBAL  
brand = "$movistarBlue" // "$movistarBlueLight50" // antes iconBrand
brandDark = "$movistarBlueDark" // "$grey6" // antes navigationSearchBarBackground
inverse = "$white" // antes iconInverse
neutralHigh = "$grey6" // "$white" // antes iconPrimary
neutralLow = "$grey3" // "$grey5" // antes iconDisabled
neutralMedium = "$grey5" // "$grey1" // antes iconSecondary
promo = "$purple" // antes backgroundPromo
highlight = "$pink"

textPrimary = "$grey6" // "$white"
textPrimaryInverse = "$white"
textSecondary = "$grey5" // "$grey1"
textSecondaryInverse = "$movistarBlueLight30" // "$grey1"
textDisabled = "$grey3" // "$grey5" // veis necesario un textDisabledInverse para textos deshabilitados sobre masa de color?
textAmount = "$movistarBlue" // "$movistarBlueLight50"

// STATES
error = "$pepper" // antes iconError
success = "$movistarGreen" // antes iconSuccess
warning = "$egg" // antes iconWarning

// BARS TEXTS
textNavigationBarPrimary = "$white"
textNavigationBarSecondary = "$movistarBlueLight30"
textNavigationSearchBarHint = "$movistarBlueLight30" // iOS only
textNavigationSearchBarText = "$white" // iOS only
textAppBar = "$grey4" // "$grey1"
textAppBarSelected = "$movistarBlue"  // "$movistarBlueLight50"
