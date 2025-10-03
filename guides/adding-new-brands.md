# Guide: Adding a New Brand in Mística

When introducing a new brand in Mística, you need to define its design tokens and update the supporting configuration, workflows, and schema. This ensures that the brand is correctly recognized by the build system, validated against accessibility rules, and included in CI/CD pipelines.

Follow these steps:

## 1. Create the brand’s token file

File: `tokens/<brand>.json`

- Add a new JSON file named after the brand.
- Define all required design tokens: colors, radii, spacings, typography, etc.
- Follow the structure of existing brand token files for consistency.

## 2. Register the brand in Figma config

File: `tokens/figma/config.mjs`

- Add the new brand to the brands list or mapping.
- This ensures Figma export scripts and build tools recognize the brand.

## 3. Map font, icons, and display name

File: `tokens/figma/variables.mjs`

Add the new brand in three places:

- FONT_FAMILIES → assign the brand’s primary typeface.
- ICON_SETS → specify which icon set the brand uses.
- BRAND_NAMES → add the human-readable brand name.

## 4. Update GitHub workflows

Files:

- `.github/workflows/sync-figma-tokens.yml`: In sync-figma-tokens.yml, add the new brand’s token file to the paths list under the push trigger. This ensures Figma tokens for your brand are synced.
- `.github/workflows/schema-validator.yml`: In schema-validator.yml, add the brand to the skins matrix. This includes it in schema validation during CI.

## 5. Update the skin schema

File: `tokens/schema/skin-schema.json`

This is critical: the schema defines what token values are valid for each brand.

- Add a new anyOf entry for your brand under patternProperties.value.
- This entry must:
  - Define regex for palette references (e.g., {palette.myBrandBlue}).
  - Allow rgba({palette.color}, opacity) where opacity is 0–1.
  - Allow linear-gradient(...) if your brand uses gradients.

* Update colors.value under gradient definitions to recognize the new brand’s palette keys.
* Ensure the description property matches the palette key used in value.

Example (simplified):

```
{
"anyOf": [
{
"pattern": "^\\{palette\\.myBrand[A-Za-z0-9]+\\}$",
      "description": { "pattern": "^(myBrand[A-Za-z0-9]+)$" }
},
{
"pattern": "^rgba\\(\\{palette\\.myBrand[A-Za-z0-9]+\\}, (0(\\.\\d+)?|1(\\.0+)?)\\)$"
}
]
}
```

This ensures schema validation enforces correct usage of your brand’s palette.
