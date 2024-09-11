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
