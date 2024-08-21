# Design Tokens Automation Script

## Objective

This script automates the process of fetching, updating, and posting design tokens to Figma for multiple brands. It reads JSON data files, extracts relevant variables, compares them with existing data from Figma, updates them if necessary, and then posts the changes back to Figma's API.

## Overview of the Script

### Environment Setup

- The script uses the `dotenv` package to load environment variables (like Figma API tokens and file keys) from a `.env` file.
- It imports necessary modules (`fetch`, `fs`, `path`, etc.) and utility functions (`extractJsonData`, `hexToRgba`, `extractPaletteValue`).

### File and Data Preparation

- The script reads JSON files from a specific directory, filters out the ones with a `.json` extension, and extracts their data using the `extractJsonData` function.

### Brands and URLs

- An object `brands` maps brand names to their corresponding Figma API URLs. This allows the script to handle multiple brands in one go.

## Main Functions

### `fetchAndUpdateVariables(jsonData, brand, url)`

**Purpose:**  
Handles the core logic of fetching existing variables from Figma, comparing them with local JSON data, and preparing a data object for the POST request.

**Steps:**

1. Fetch existing variables and collections from Figma.
2. Initialize a `newData` object to store the changes that need to be posted back to Figma.
3. For each collection (like "palette", "radius", "font-weight"):
   - Check if it exists. If it does, prepare an update request; otherwise, prepare a create request.
4. For each variable within these collections:
   - Check if it exists and needs updating. If it doesn’t exist, prepare a create request.
5. Identify and delete any variables in Figma that are no longer in the local JSON data.

### `updateVariables(variableName, variableValue, collectionName, existingVariables, existingCollections, variableType, variableScopes)`

**Purpose:**  
Updates or creates variables in the `newData` object based on their existence in the Figma data.

**Parameters:**

- `variableName`, `variableValue`: The name and value of the variable to be updated/created.
- `collectionName`: The name of the collection the variable belongs to.
- `existingVariables`, `existingCollections`: The current variables and collections fetched from Figma.
- `variableType`, `variableScopes`: Additional metadata for the variable.

### `findVariableInCollection(variableName, collectionName, existingVariables, existingCollections)`

**Purpose:**  
Finds a variable within a specific collection in Figma's existing data.

**Returns:**  
The variable object if found, otherwise `undefined`.

### `processAndPostData(url, brand)`

**Purpose:**  
Processes the data for a specific brand and posts the updated data to Figma.

**Parameters:**  
`url` (Figma API URL), `brand` (name of the brand).

### `processAllUrls(brands)`

**Purpose:**  
Sequentially processes and posts data for all brands defined in the `brands` object.

**Parameters:**  
`brands` (an object mapping brand names to Figma API URLs).

## Execution

The script calls `processAllUrls(brands)` at the end, which triggers the whole process for all defined brands.
