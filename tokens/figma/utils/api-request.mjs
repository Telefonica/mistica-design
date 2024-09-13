import fetch from "node-fetch";

async function getFigmaData(
  FILE_KEY,
  FIGMA_TOKEN
) {
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
  if (!response.ok) {
    throw new Error(
      `Error fetching Figma data: ${response.statusText}`
    );
  }
  return response.json();
}

async function postFigmaVariables(
  FILE_KEY,
  FIGMA_TOKEN,
  newData
) {
  const response = await fetch(
    `https://api.figma.com/v1/files/${FILE_KEY}/variables`,
    {
      method: "POST",
      headers: {
        "X-Figma-Token": FIGMA_TOKEN,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newData),
    }
  );
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Error updating variables: ${response.statusText}. Response: ${errorText}`
    );
  }
  return response.json();
}

export { getFigmaData, postFigmaVariables };
