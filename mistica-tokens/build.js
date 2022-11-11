const StyleDictionaryPackage = require('style-dictionary');

// HAVE THE STYLE DICTIONARY CONFIG DYNAMICALLY GENERATED


function getColor(brand, platform, mode) {
  return {
    "source": [
      `tokens/local/color/${brand}/${mode}.json`,
      `tokens/platforms/${platform}/*.json`
    ],
    "platforms": {
      "web": {
        "transformGroup": "js",
        "buildPath": `build/web/${brand}/`,
        "files": [{
          "filter": "isCore",
          "destination": `color-${mode}.json`,
          "format": "json/nested"
        }]

      },
      "android": {
        "transformGroup": "compose",
        "buildPath": `build/android/${brand}/`,
        "files": [{
          "destination": `tokens.colors_${mode}.xml`,
          "format": "compose/object"
        }]

      },
      "ios": {
        "transformGroup": "ios-swift",
        "buildPath": `build/ios/${brand}/`,
        "files": [{
          "destination": `color${mode}.swift`,
          "format": "ios-swift/class.swift"
        }]
      }
    }
  };
}

console.log('Build started...');

// PROCESS THE DESIGN TOKENS FOR THE DIFFEREN BRANDS AND PLATFORMS

['blau', 'movistar', 'o2', 'o2-classic','solar-360', 'vivo'].map(function (brand) {
  ['light', 'dark'].map(function (mode) {
  ['web', 'ios', 'android'].map(function (platform) {

    console.log('\n==============================================');
    console.log(`\nProcessing: [${platform}] [${brand}] [${mode}]`);

    const StyleDictionary = StyleDictionaryPackage.extend(getColor(brand, platform, mode));

    StyleDictionary.registerFilter({
      name: 'isCore',
      matcher: function(token) {
        return token.attributes.category !== 'core';
      }
    })

    StyleDictionary.buildPlatform(platform);

    console.log('\nEnd processing');

  })
})
})


console.log('\n==============================================');
console.log('\nBuild completed!');


function getTypography(brand, platform) {
  return {
    "source": [
      `tokens/local/typography/${brand}.json`,
      "tokens/global/typography.json",
      `tokens/platforms/${platform}/*.json`
    ],
    "platforms": {
      "web": {
        "transformGroup": "js",
        "buildPath": `build/web/`,
        "files": [{
          "destination": `${brand}/typography.json`,
          "filter": "isCore",
          "format": "json/nested",
        }]

      },
      "android": {
        "transformGroup": "android",
        "buildPath": `build/android/${brand}/`,
        "files": [{
          
          "destination": "tokens.font_dimens.xml",
          "format": "android/fontDimens"
        }]
      },
      "ios": {
        "transformGroup": "ios",
        "buildPath": `build/ios/${brand}/`,
        "files": [{
          "destination": "tokens.h",
          "format": "ios/macros"
        }]
      }
    }
  };
}

console.log('Build started...');

// PROCESS THE DESIGN TOKENS FOR THE DIFFEREN BRANDS AND PLATFORMS

['blau', 'movistar', 'o2', 'o2-classic','solar-360', 'vivo'].map(function (brand) {
  ['web', 'ios', 'android'].map(function (platform) {

    console.log('\n==============================================');
    console.log(`\nProcessing: [${platform}] [${brand}]`);


    const StyleDictionary = StyleDictionaryPackage.extend(getTypography(brand, platform));

    StyleDictionary.registerFilter({
      name: 'isCore',
      matcher: function(token) {
        return token.attributes.category !== 'core';
      }
    })

    StyleDictionary.buildPlatform(platform);
   

    console.log('\nEnd processing');

  })
})


console.log('\n==============================================');
console.log('\nBuild completed!');


