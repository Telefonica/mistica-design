# Guide: Adding a New Brand in Mística

When introducing a new brand in Mística, you need to define its design tokens and update the supporting configuration, workflows, and schema. This ensures that the brand is correctly recognized by the build system, validated against accessibility rules, and included in CI/CD pipelines.

Follow these steps:

## 1. Create the brand’s token file

File: `tokens/<brand>.json`

- Add a new JSON file named after the brand.
- Define all required design tokens: colors, radii, spacings, typography, etc.
- Follow the structure of existing brand token files for consistency.


## 2. Figma script

### 2.1 Constants

File: `tokens/figma/utils/constants.mjs`

- Add new brand to const `BRANDS`

<img width="742" height="205" alt="Screenshot 2025-10-07 at 08 53 17" src="https://github.com/user-attachments/assets/7b8df7ac-1c37-4d8b-8503-f3c45f79e254" />

### 2.2 Config

File: `tokens/figma/config.mjs`

- Add the new brand to the brands list or mapping.
- This ensures Figma export scripts and build tools recognize the brand.

<img width="741" height="237" alt="Screenshot 2025-10-07 at 08 52 18" src="https://github.com/user-attachments/assets/7601c19f-ed33-4d3b-acbc-77f1590388db" />


### 2.3 Map font, icons, and display name

File: `tokens/figma/variables.mjs`

Add the new brand in three places:

- FONT_FAMILIES → assign the brand’s primary typeface.
- ICON_SETS → specify which icon set the brand uses.
- BRAND_NAMES → add the human-readable brand name.

<img width="690" height="582" alt="Screenshot 2025-10-07 at 08 55 12" src="https://github.com/user-attachments/assets/bb1932e0-3ff1-471c-af9c-991980cdd9d2" />

## 3. Update skin schema

File: `tokens/schema/skin-schema.json`

This is critical: the schema defines what token values are valid for each brand.

- Add a new anyOf entry for your brand under `patternProperties.value`.
   - Comment: Name of the new brand
   - Pattern: the colection of the palette colors defined in that brand (check carefully, there are two regular expressions per pattern)
- Add a new anyOf entry for your brand under `patternProperties.description`
   - Comment: Name of the new brand
   - Pattern: the colection of the palette colors defined in that brand

<img width="1247" height="368" alt="Screenshot 2025-10-07 at 09 03 04" src="https://github.com/user-attachments/assets/861a299f-6c1e-483c-a358-98ad500898dc" />


This ensures schema validation enforces correct usage of your brand’s palette.

## 4. GitHub workflows

### 4.1 Sync Figma tokens

File: `.github/workflows/sync-figma-tokens.yml`

- Add the new brand’s token file to the paths list under the push trigger. This ensures Figma tokens for your brand are synced.

<img width="318" height="151" alt="Screenshot 2025-10-07 at 08 58 30" src="https://github.com/user-attachments/assets/42df427c-b2e0-41e1-9052-456a7c78f16b" />


### 4.2 Schema validator

File: `.github/workflows/schema-validator.yml`

- Add the brand to the skins matrix. This includes it in schema validation during CI.

<img width="203" height="343" alt="Screenshot 2025-10-07 at 08 59 07" src="https://github.com/user-attachments/assets/01125d9b-7126-4e93-bae9-234321f0acc6" />



