export function hexToRgba(hex, alpha = 1) {
  // Remove the leading # if it's present
  hex = hex.replace(/^#/, "");

  // Expand shorthand form (e.g., "03F") to full form (e.g., "0033FF")
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("");
  }

  // Parse the r, g, b values
  const bigint = parseInt(hex, 16);
  const r = ((bigint >> 16) & 255) / 255;
  const g = ((bigint >> 8) & 255) / 255;
  const b = (bigint & 255) / 255;

  // Return the RGBA object with normalized values
  return {
    r,
    g,
    b,
    a: alpha,
  };
}

export function generateTempModeId(
  targetMode,
  targetCollection
) {
  return `tempId_${targetCollection}_${targetMode}`;
}

export async function updateCollections(
  collections,
  FILE_KEY,
  FIGMA_TOKEN
) {
  try {
    const response = await fetch(
      `https://api.figma.com/v1/files/${FILE_KEY}/variables/local`,
      {
        method: "GET",
        headers: {
          "X-Figma-Token": FIGMA_TOKEN,
          "Content-Type": "application/json",
        },
      }
    );

    const figmaData = await response.json();

    const newData = {
      variableCollections: [],
    };

    const existingCollections =
      figmaData.meta.variableCollections;

    function generateTempId(name) {
      return `tempId_${name}`;
    }

    function updateCollection(
      collectionName,
      existingCollections
    ) {
      // Find the existing collection by name
      const existingCollection = Object.values(
        existingCollections
      ).find(
        (collection) =>
          collection.name === collectionName
      );

      if (existingCollection) {
        // If the collection exists, update it
        newData.variableCollections.push({
          action: "UPDATE",
          id: existingCollection.id,
          name: collectionName,
        });
      } else {
        // If the collection doesn't exist, create it
        const tempId = generateTempId(
          collectionName
        );
        newData.variableCollections.push({
          action: "CREATE",
          id: tempId,
          name: collectionName,
        });
      }
    }

    // Process each collection name
    collections.forEach((collection) => {
      updateCollection(
        collection,
        existingCollections
      );
    });

    const collectionsToDelete = Object.values(
      existingCollections
    ).filter(
      (collection) =>
        !collections.includes(collection.name)
    );

    collectionsToDelete.forEach((collection) => {
      newData.variableCollections.push({
        action: "DELETE",
        id: collection.id,
      });
    });

    // Return the processed data for further use
    return newData;
  } catch (error) {
    console.error("Error:", error);
    throw error; // rethrow the error to be handled later
  }
}

export async function updateOrCreateVariable({
  variable,
  targetCollectionName,
  existingVariables,
  existingCollections,
}) {
  const collectionId = Object.values(
    existingCollections
  ).find(
    (collection) =>
      collection.name === targetCollectionName
  ).id;

  //If exists retrieve the variable id
  const existingVariable = Object.values(
    existingVariables
  ).find(
    (v) =>
      v.name === variable.name &&
      v.variableCollectionId === collectionId
  );

  const tempId = `tempId_${targetCollectionName}_${variable.name}`;

  //Retrieve the variableCollectionId with the targetCollectionName

  if (!existingVariable) {
    // Create new variable
    return {
      action: "CREATE",
      id: tempId,
      name: variable.name,
      variableCollectionId: collectionId,
      resolvedType: variable.resolvedType,
      scopes: variable.scopes,
    };
  } else {
    // Update existing variable
    return {
      action: "UPDATE",
      id: existingVariable.id,
      name: variable.name,
      variableCollectionId: collectionId,
      resolvedType: variable.resolvedType,
      scopes: variable.scopes,
    };
  }
}

export async function updateOrCreateVariableModeValues({
  variable,
  targetModeName,
  targetCollectionName,
  existingCollections,
  existingVariables,
}) {
  // Find the mode for the given modeName, or use tempId if mode is being created

  const targetCollection = Object.values(
    existingCollections
  ).find(
    (collection) =>
      collection.name === targetCollectionName
  );

  if (!targetCollection) {
    console.warn(
      `Collection ${targetCollectionName} not found.`
    );
    return;
  }

  // Now access the modes from the found collection
  const existingMode =
    targetCollection.modes.find(
      (m) => m.name === targetModeName
    );

  const modeId = existingMode
    ? existingMode.modeId
    : generateTempModeId(targetCollectionName,  targetModeName);

  if (!modeId) {
    console.warn(
      `Mode ${targetModeName} not found and no tempId provided.`
    );
    return;
  }

  const collectionId = Object.values(
    existingCollections
  ).find(
    (collection) =>
      collection.name === targetCollectionName
  )?.id;

  // Retrieve the variable id if exists
  const existingVariable = Object.values(
    existingVariables
  ).find(
    (v) =>
      v.name === variable.name &&
      v.variableCollectionId === collectionId
  );

  const tempId = `tempId_${targetCollectionName}_${variable.name}`;

  return {
    action: existingVariable
      ? "UPDATE"
      : "CREATE",
    variableId: existingVariable
      ? existingVariable.id
      : tempId, // Use existing variable ID or a temp one
    modeId: modeId,
    value: variable.hasAlias
      ? {
          type: "VARIABLE_ALIAS",
          id: variable.value,
        }
      : variable.value,
  };
}
