# Project overview

This project is designed to update Figma variables based on a JSON input, primarily focused on managing brand themes, colors, and other design tokens. The project retrieves existing variables from Figma, processes the provided JSON data, and updates or creates new variables in collections "Mode" and "Brand".

## Features

- **Fetch existing Figma data**: Retrieves the existing variables and collections from Figma.
- **Process JSON data**: Extracts theme and token data from provided JSON files for each brand.
- **Update or create variables**: Adds new variables or updates existing ones based on the brand's light and dark themes.
- **Handle variable modes**: Ensures each brand's mode (e.g., "Light", "Dark") is updated or created in the Figma "Brand" collection.
- **Support for multiple brands**: Processes multiple brands, mapping each brand's unique variables into Figma's collections.

## Deprecated token behavior (middleware flow)

When running the middleware update flow, deprecated token metadata from skin JSON is propagated to Figma variables.

- **Name format**: deprecated variables are prefixed with `DEPRECATED_`.
- **Description format**: a concise deprecation note is appended.
  - If `deprecatedBy` exists: `Deprecated. Use <tokenName>`
  - If `deprecatedBy` is missing: `Deprecated.`
- **Scope**: any token can be deprecated **except** tokens under `global.palette`.

### Migration safety for renamed variables

Renaming variables in Figma can be breaking if it creates new variables with new IDs. To avoid this, middleware updates perform a rename-safe lookup:

- First try exact name match.
- Then try legacy names (for example, non-prefixed vs prefixed).
- If a legacy match exists, the script updates the existing variable by ID (rename-in-place) instead of creating duplicates.

This keeps existing variable bindings and aliases stable during deprecation rollouts.

## Setup

### Environment variables:

- `FIGMA_TOKEN`: The API token to authenticate with Figma.

### Dependencies:

- Node.js and packages such as `node-fetch`, `dotenv`, and `fs` are used to manage API requests, read local files, and load environment variables.

## Key functions

### `updateModeCollection(jsonData, brand)`

This function updates the color-scheme variables in Figma for a specific brand. It:

- Fetches the current variables from Figma.
- Updates modes and variables for `"Light"` and `"Dark"` color-schemes.
- Sends a POST request to update Figma with the new data.

### `updateBrandCollection(jsonData)`

This function focuses on updating color variables in the "Brand" collection. It:

- Maps color variables from the "Mode" collection to the "Brand" collection.
- Adds non-color variables for each brand.
- Creates or updates modes for each brand.
- Ensures proper aliasing of variables between collections.

## Usage

1. Navigate to the `tokens/figma` directory:

   ```bash
   cd tokens/figma

   ```

2. Install dependencies:

   ```bash
   npm install

   ```

3. Run the script
   ```bash
   node index.mjs
   ```

### Validation tip

After introducing deprecated metadata in tokens, run `node index.mjs` and verify in Figma:

- Deprecated variables use `DEPRECATED_` names.
- Variable descriptions include deprecation notes.
- No duplicated old/new variables are created for the same token.
