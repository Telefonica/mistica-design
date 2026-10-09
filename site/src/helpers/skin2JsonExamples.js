// Placeholders for the Skin2Json page. Each constant is the example content
// shown in the left textarea depending on the active chip.

export const skinExample = `import {MOVISTAR_SKIN} from './constants';
import type {GetKnownSkin, KnownSkin} from './types';

export const palette = {
    white: '#FFFFFF',
    grey100: '#F6F6F6',
    grey200: '#DDDDDD',
    grey600: '#86888C',
    movistarBlue: '#019DF4',
    movistarBlack: '#313235',
    blue800: '#0B2739',
    red: '#FF0000',
};

export const getMovistarSkin: GetKnownSkin = () => {
    const skin: KnownSkin = {
        name: MOVISTAR_SKIN,
        colors: {
            background: palette.white,
            backgroundAlternative: palette.grey100,
            backgroundBrand: palette.movistarBlue,
            border: palette.grey200,
            borderHigh: palette.grey600,
            textPrimary: palette.movistarBlack,
            textSecondary: palette.grey600,
            textLink: palette.movistarBlue,
            error: palette.red,
            brand: palette.movistarBlue,
        },
        darkModeColors: {
            background: palette.movistarBlack,
            backgroundAlternative: palette.movistarBlack,
            backgroundBrand: palette.movistarBlack,
            border: palette.grey600,
            textPrimary: palette.white,
            textSecondary: palette.grey200,
            textLink: palette.movistarBlue,
            error: palette.red,
            brand: palette.movistarBlue,
        },
        borderRadii: {
            container: '8px',
            button: '4px',
        },
    };
    return skin;
};`;

export const jsonExample = `{
  "light": {
    "background": {
      "value": "{palette.white}",
      "type": "color",
      "description": "white"
    },
    "backgroundAlternative": {
      "value": "{palette.movistarWhite}",
      "type": "color",
      "description": "movistarWhite"
    },
    "backgroundBrand": {
      "value": "{palette.movistarBlue}",
      "type": "color",
      "description": "movistarBlue"
    },
    "border": {
      "value": "{palette.grey300}",
      "type": "color",
      "description": "grey300"
    },
    "textPrimary": {
      "value": "{palette.movistarBlack}",
      "type": "color",
      "description": "movistarBlack"
    },
    "textSecondary": {
      "value": "{palette.grey600}",
      "type": "color",
      "description": "grey600"
    },
    "textLink": {
      "value": "{palette.movistarBlue}",
      "type": "color",
      "description": "movistarBlue"
    },
    "brand": {
      "value": "{palette.movistarBlue}",
      "type": "color",
      "description": "movistarBlue"
    },
    "error": {
      "value": "{palette.red}",
      "type": "color",
      "description": "red"
    }
  },
  "dark": {
    "background": {
      "value": "{palette.darkModeBlack}",
      "type": "color",
      "description": "darkModeBlack"
    },
    "backgroundAlternative": {
      "value": "{palette.darkModeBlack}",
      "type": "color",
      "description": "darkModeBlack"
    },
    "backgroundBrand": {
      "value": "{palette.darkModeBlack}",
      "type": "color",
      "description": "darkModeBlack"
    },
    "border": {
      "value": "{palette.darkModeGrey}",
      "type": "color",
      "description": "darkModeGrey"
    },
    "textPrimary": {
      "value": "{palette.white}",
      "type": "color",
      "description": "white"
    },
    "textSecondary": {
      "value": "{palette.grey400}",
      "type": "color",
      "description": "grey400"
    },
    "textLink": {
      "value": "{palette.darkModeMovistarBlue}",
      "type": "color",
      "description": "darkModeMovistarBlue"
    },
    "brand": {
      "value": "{palette.movistarBlue}",
      "type": "color",
      "description": "movistarBlue"
    },
    "error": {
      "value": "{palette.red}",
      "type": "color",
      "description": "red"
    }
  },
  "radius": {
    "container": {
      "value": "8px",
      "type": "borderRadius"
    },
    "button": {
      "value": "4px",
      "type": "borderRadius"
    }
  },
  "global": {
    "palette": {
      "white": { "value": "#FFFFFF", "type": "color" },
      "movistarBlue": { "value": "#019DF4", "type": "color" },
      "movistarBlack": { "value": "#313235", "type": "color" },
      "grey300": { "value": "#DDDDDD", "type": "color" },
      "grey400": { "value": "#B6B7BB", "type": "color" },
      "grey600": { "value": "#86888C", "type": "color" },
      "darkModeBlack": { "value": "#222329", "type": "color" },
      "darkModeGrey": { "value": "#3B3C43", "type": "color" },
      "darkModeMovistarBlue": { "value": "#30BDFF", "type": "color" },
      "red": { "value": "#FF0000", "type": "color" },
      "movistarWhite": { "value": "#FAFAFA", "type": "color" }
    }
  }
}`;
