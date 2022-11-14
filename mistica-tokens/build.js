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
        "transforms": ["color/composeColor"],
        "buildPath": `build/android/${brand}/`,
        "files": [{
          "destination": `tokens.colors_${mode}.xml`,
          "format": "android/resources"
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
        "transforms": ["attribute/cti", "name/cti/camel", "lineToEm", "sizeToRem"],
        "buildPath": `build/web/`,
        "files": [{
          "destination": `${brand}/typography.json`,
          "filter": "isCore",
          "format": "json/flat",
        }]

      },
      "android": {
        "transformGroup": "android",
        "buildPath": `build/android/${brand}/`,
        "files": [{
          "destination": "tokens.font_dimens.xml",
          "filter": "isCore",
          "format": "android/fontDimens"
        }]
      },
      "ios": {
        "transformGroup": "ios",
        "buildPath": `build/ios/${brand}/`,
        "files": [{
          "destination": "typography.swift",
          "filter": "isCore",
          "format": "ios-swift/class.swift"
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

    StyleDictionary.registerTransform({
      name: 'sizeToRem',
      type: 'value',
      matcher: function(token) {
        return token.attributes.type === 'font-size';
      },
      transformer: function(token) {
        return (parseInt(token.original.value)) / 16 + 'rem';
      }
    });

    StyleDictionary.registerTransform({
      name: 'lineToEm',
      type: 'value',
      matcher: function(token) {
        return token.attributes.type === 'line-height';
      },
      transformer: function(token) {
        return (parseFloat(token.original.value)) + 'em';
      }
    });



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


