import React, { useState, useEffect } from "react";
import { Select } from "@telefonica/mistica";

const SkinGenerator = () => {
  const [jsonData, setJsonData] = useState({});
  const [skins, setSkins] = useState({});
  const [selectedSkin, setSelectedSkin] = useState("movistar");
  const [generatedJson, setGeneratedJson] = useState({});

  useEffect(() => {
    const fetchSkins = async () => {
      const skinNames = [
        "movistar",
        "movistar-legacy",
        "vivo",
        "vivo-new",
        "blau",
        "o2",
        "telefonica",
        "solar-360",
      ];
      const skins = {};

      try {
        for (let i = 0; i < skinNames.length; i++) {
          const skinName = skinNames[i];
          const response = await fetch(
            `https://raw.githubusercontent.com/Telefonica/mistica-design/production/tokens/${skinName}.json`
          );
          const data = await response.json();
          skins[skinName] = data;
        }

        setSkins(skins);
        setJsonData(skins[selectedSkin]);
        // reset error state when successful
      } catch (error) {
        console.error(error);
      }
    };

    fetchSkins();
  }, [selectedSkin]);

  const handleValueChange = (section, key, subKey, newValue) => {
    setJsonData((prevData) => {
      if (section === "global" && key === "palette") {
        const updatedPalette = Object.entries(prevData.global.palette).reduce(
          (result, [paletteKey, paletteValue]) => {
            if (paletteKey === subKey) {
              result[newValue] = {
                ...paletteValue,
                value: newValue,
              };
            } else {
              result[paletteKey] = paletteValue;
            }
            return result;
          },
          {}
        );

        return {
          ...prevData,
          global: {
            ...prevData.global,
            palette: updatedPalette,
          },
        };
      } else {
        return {
          ...prevData,
          [section]: {
            ...prevData[section],
            [key]: {
              ...prevData[section][key],
              value: newValue,
            },
          },
        };
      }
    });
  };

  const handleKeyChange = (section, key, newKey) => {
    setJsonData((prevData) => {
      if (section === "global" && key === "palette") {
        const updatedPalette = Object.entries(prevData.global.palette).reduce(
          (result, [paletteKey, paletteValue]) => {
            if (paletteKey === key) {
              result[newKey] = {
                ...paletteValue,
                value: paletteValue.value,
              };
            } else {
              result[paletteKey] = paletteValue;
            }
            return result;
          },
          {}
        );

        return {
          ...prevData,
          global: {
            ...prevData.global,
            palette: updatedPalette,
          },
        };
      } else {
        const updatedSection = Object.entries(prevData[section]).reduce(
          (result, [sectionKey, sectionValue]) => {
            if (sectionKey === key) {
              result[newKey] = {
                ...sectionValue,
                value: sectionValue.value,
              };
            } else {
              result[sectionKey] = sectionValue;
            }
            return result;
          },
          {}
        );

        return {
          ...prevData,
          [section]: updatedSection,
        };
      }
    });
  };

  const generateUpdatedJson = () => {
    const updatedJson = {};

    // Define the order of sections
    const sectionsOrder = ["light", "dark", "global"];

    // Iterate over the sections order
    sectionsOrder.forEach((section) => {
      updatedJson[section] = { ...jsonData[section] };

      // Handle specific properties within each section
      if (section === "light" || section === "dark") {
        Object.entries(jsonData[section]).forEach(([key, value]) => {
          updatedJson[section][key] = {
            ...value,
            value: jsonData[section][key].value,
          };
        });
      } else if (section === "global") {
        updatedJson.global.palette = { ...jsonData.global.palette };
        Object.entries(jsonData.global.palette).forEach(([key, value]) => {
          updatedJson.global.palette[key] = {
            ...value,
            value: jsonData.global.palette[key].value,
          };
        });
      }
    });

    return updatedJson;
  };

  const handleGenerateJson = () => {
    const updatedJson = generateUpdatedJson();
    setGeneratedJson(JSON.stringify(updatedJson, null, 2));
  };

  // Render the JSON editor UI
  return (
    <>
      <Select
        label="Skin"
        onChangeValue={setSelectedSkin}
        value={selectedSkin ?? "movistar"}
        options={[
          { value: "movistar", text: "Movistar" },
          { value: "movistar-legacy", text: "Movistar Legacy" },
          { value: "vivo", text: "Vivo" },
          { value: "vivo-new", text: "Vivo New" },
          { value: "o2", text: "O2" },
          { value: "blau", text: "Blau" },
          { value: "telefonica", text: "Telefonica" },
          { value: "solar-360", text: "Solar 360" },
        ]}
      ></Select>

      {Object.keys(skins).length === 0 ? (
        <p>No skins available</p>
      ) : (
        <>
          <details>
            <summary>Light</summary>
            {Object.entries(jsonData.light).map(([key, value]) => (
              <div key={key}>
                <h3>{key}:</h3>
                <label>Value: </label>
                <input
                  type="text"
                  value={value.value || ""}
                  onChange={(e) =>
                    handleValueChange("light", key, "value", e.target.value)
                  }
                />
              </div>
            ))}
          </details>
          <details>
            <summary>Dark</summary>
            {Object.entries(jsonData.dark).map(([key, value]) => (
              <div key={key}>
                <h3>{key}:</h3>
                <label>Value: </label>
                <input
                  type="text"
                  value={value.value || ""}
                  onChange={(e) =>
                    handleValueChange("dark", key, "value", e.target.value)
                  }
                />
              </div>
            ))}
          </details>
          <details>
            <summary>Palette</summary>

            {Object.entries(jsonData.global.palette).map(([key, value]) => (
              <div key={key}>
                <h3>{key}:</h3>
                <label>Key: </label>
                <input
                  type="text"
                  value={key}
                  onChange={(e) =>
                    handleKeyChange("global", "palette", key, e.target.value)
                  }
                />
                <label>Value: </label>
                <input
                  type="text"
                  value={value.value || ""}
                  onChange={(e) =>
                    handleValueChange(
                      "global",
                      "palette",
                      key,
                      "value",
                      e.target.value
                    )
                  }
                />
              </div>
            ))}
          </details>
        </>
      )}
      <button onClick={handleGenerateJson}>Generate Updated JSON</button>

      <textarea
        value={generatedJson}
        rows={25}
        style={{ maxHeight: "800px", width: "100%", resize: "vertical" }}
        readOnly
      ></textarea>
    </>
  );
};

export default SkinGenerator;
