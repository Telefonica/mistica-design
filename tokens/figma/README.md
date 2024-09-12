# Project Overview

This project is designed to update Figma variables based on a JSON input, primarily focused on managing brand themes, colors, and other design tokens. The project retrieves existing variables from Figma, processes the provided JSON data, and updates or creates new variables in collections "Theme" and "Skin".

## Features

- **Fetch Existing Figma Data**: Retrieves the existing variables and collections from Figma.
- **Process JSON Data**: Extracts theme and token data from provided JSON files for each brand.
- **Update or Create Variables**: Adds new variables or updates existing ones based on the brand's light and dark themes.
- **Handle Variable Modes**: Ensures each brand's mode (e.g., "Light", "Dark") is updated or created in the Figma "Skin" collection.
- **Support for Multiple Brands**: Processes multiple brands, mapping each brand's unique variables into Figma's collections.

## Setup

### Environment Variables:

- `FIGMA_TOKEN`: The API token to authenticate with Figma.
- `MIDDLEWARE_KEY`: Token for file where the variables need to be created / updated

### Dependencies:

- Node.js and packages such as `node-fetch`, `dotenv`, and `fs` are used to manage API requests, read local files, and load environment variables.

## Key Functions

### `updateTheme(jsonData, brand, FILE_KEY)`

This function updates the theme variables in Figma for a specific brand. It:

- Fetches the current variables from Figma.
- Updates modes and variables for "Light" and "Dark" themes.
- Sends a POST request to update Figma with the new data.

### `updateSkinColorVariables(brands, FILE_KEY)`

This function focuses on updating color variables in the "Skin" collection. It:

- Maps color variables from the "Theme" collection to the "Skin" collection.
- Creates or updates modes for each brand.
- Ensures proper aliasing of variables between collections.

### `updateSkinOtherVariables(jsonData, brands, FILE_KEY)`

This function updates non-color variables, such as font families and icon sets, for each brand. It:

- Handles specific design tokens like radius, font weight, and line height.
- Adds brand-specific font families and icons.

## Usage

1. Navigate to the `tokens/figma` directory:

   ```bash
   cd tokens/figma

   ```

2. Run the script
   ```bash
   node update-middleware.mjs
   ```
