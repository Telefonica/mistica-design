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

  const handleValueChange = (section, key, subKey, newKey, newValue) => {
    setJsonData((prevData) => {
      if (section === "light" || section === "dark") {
        const updatedValue = {
          ...prevData[section][key],
          value: newValue,
        };

        // Update the description
        const description = newValue.replace(
          /{palette\.(.*?)}/g,
          (match, p1) => {
            return prevData.global.palette[p1]?.value || match;
          }
        );
        updatedValue.description = description;

        return {
          ...prevData,
          [section]: {
            ...prevData[section],
            [key]: updatedValue,
          },
        };
      } else if (section === "global" && key === "palette") {
        const updatedPalette = Object.entries(prevData.global.palette).reduce(
          (result, [paletteKey, paletteValue]) => {
            if (paletteKey === subKey) {
              if (newKey) {
                // Modify the key and/or value
                const updatedValue = newValue
                  ? { ...paletteValue, value: newValue }
                  : paletteValue;
                delete result[paletteKey]; // Remove the old key
                result[newKey] = updatedValue; // Add the updated key-value pair
              } else {
                // Modify the value only, keep the key unchanged
                result[paletteKey] = { ...paletteValue, value: newValue };
              }
            } else {
              result[paletteKey] = paletteValue;
            }
            return result;
          },
          {}
        );

        if (newKey && !prevData.global.palette.hasOwnProperty(newKey)) {
          // Add a new entry if a new key is provided and it doesn't exist in the current palette
          updatedPalette[newKey] = { value: newValue };
        }

        return {
          ...prevData,
          global: {
            ...prevData.global,
            palette: updatedPalette,
          },
        };
      } else if (section === "radius") {
        return {
          ...prevData,
          radius: {
            ...prevData.radius,
            [key]: {
              ...prevData.radius[key],
              value: newValue,
            },
          },
        };
      } else if (section === "text" && key === "weight") {
        return {
          ...prevData,
          text: {
            ...prevData.text,
            weight: {
              ...prevData.text.weight,
              [subKey]: {
                ...prevData.text.weight[subKey],
                value: newValue,
              },
            },
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

  const generateUpdatedJson = (prevData) => {
    const updatedJson = {};

    const sectionsOrder = ["light", "dark", "global", "radius", "text"];

    sectionsOrder.forEach((section) => {
      updatedJson[section] = { ...jsonData[section] };

      if (section === "light" || section === "dark") {
        Object.entries(prevData[section]).forEach(([key, value]) => {
          const description = value.value.replace(/{palette\.(.*?)}/g, "$1");

          updatedJson[section][key] = {
            ...value,
            value: value.value,
            description: description,
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
    const updatedJson = generateUpdatedJson(jsonData);
    setGeneratedJson(JSON.stringify(updatedJson, null, 2));
  };

  const handleInputChange = (event, section, key, subKey, newKey) => {
    const { name, value } = event.target;
    // Call the handleValueChange function passing the appropriate arguments
    handleValueChange(section, key, subKey, newKey, value);
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
        <div>
          {Object.entries(jsonData).map(([section, sectionData]) => {
            if (section === "light" || section === "dark") {
              // Render input fields for light and dark sections
              return Object.entries(sectionData).map(
                ([key, { value, description }]) => (
                  <div key={key}>
                    <span>{key}</span>
                    <input
                      type="text"
                      name={key}
                      value={value}
                      onChange={(event) =>
                        handleInputChange(event, section, key, null, null)
                      }
                    />
                    <span>{description}</span>
                  </div>
                )
              );
            } else if (section === "global") {
              // Render input fields for global.palette section
              if (sectionData.palette) {
                return Object.entries(sectionData.palette).map(
                  ([key, { value }]) => {
                    const handleKeyChange = (event) => {
                      const newKey = event.target.value;
                      handleInputChange(
                        event,
                        section,
                        "palette",
                        key,
                        newKey,
                        value
                      );
                    };

                    const handleValueChange = (event) => {
                      const newValue = event.target.value;
                      handleInputChange(
                        event,
                        section,
                        "palette",
                        key,
                        key,
                        newValue
                      );
                    };

                    return (
                      <div key={key}>
                        <input
                          type="text"
                          name={`${key}-key`}
                          value={key}
                          onChange={handleKeyChange}
                        />
                        <input
                          type="text"
                          name={`${key}-value`}
                          value={value}
                          onChange={handleValueChange}
                        />
                      </div>
                    );
                  }
                );
              }
            } else if (section === "radius") {
              return Object.entries(sectionData).map(([key, { value }]) => (
                <div key={key}>
                  <span>{key}</span>
                  <input
                    type="text"
                    name={key}
                    value={value}
                    onChange={(event) =>
                      handleInputChange(event, section, key, null, null)
                    }
                  />
                </div>
              ));
            } else if (section === "text") {
              if (sectionData.weight) {
                return Object.entries(sectionData.weight).map(
                  ([key, { value }]) => (
                    <div key={key}>
                      <span>{key}</span>
                      <input
                        type="text"
                        name={key}
                        value={value}
                        onChange={(event) =>
                          handleInputChange(event, section, "weight", key, null)
                        }
                      />
                    </div>
                  )
                );
              }
            } else {
              // Render input fields for other sections
              return Object.entries(sectionData).map(([key, { value }]) => (
                <div key={key}>
                  <input
                    type="text"
                    name={key}
                    value={value}
                    onChange={(event) =>
                      handleInputChange(event, section, "weight", key, null)
                    }
                  />
                </div>
              ));
            }
          })}
        </div>
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
