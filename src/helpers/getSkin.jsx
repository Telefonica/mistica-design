import { useState, useEffect } from "react";

const GetSkin = ({ selectedSkin, branch }) => {
  const [skinData, setSkinData] = useState({});
  const [skinNames, setSkinNames] = useState([]);
  const [skinError, setSkinError] = useState(null);

  useEffect(() => {
    const getSkinNames = async () => {
      const response = await fetch(
        `https://api.github.com/repos/Telefonica/mistica-design/contents/tokens?ref=${
          branch || "production"
        }`
      );

      return (response?.status === 200 ? await response.json() : [])
        .filter((value) => value.name.endsWith(".json"))
        .map((value) => value.name.slice(0, -5));
    };

    const fetchSkins = async () => {
      const skinNames = await getSkinNames();
      const fetchedSkins = {};

      try {
        for (let i = 0; i < skinNames.length; i++) {
          const skinName = skinNames[i];
          const response = await fetch(
            `https://raw.githubusercontent.com/Telefonica/mistica-design/${branch}/tokens/${skinName}.json`
          );
          const data = await response.json();
          fetchedSkins[skinName] = data;
        }

        if (selectedSkin) {
          // If a selected skin is provided, set the skin data for that skin
          setSkinData(fetchedSkins[selectedSkin]);
          setSkinNames(
            Object.keys(fetchedSkins).map((brandName) => ({
              value: brandName,
              text: brandName.charAt(0).toUpperCase() + brandName.slice(1),
            }))
          );
          setSkinError(false);
        } else {
          // If no selected skin is provided, set the skin data for all skins
          setSkinData(fetchedSkins);
          setSkinNames(
            Object.keys(fetchedSkins).map((brandName) => ({
              value: brandName,
              text: brandName.charAt(0).toUpperCase() + brandName.slice(1),
            }))
          );
          setSkinError(false);
        }
      } catch (error) {
        console.error(error);
        setSkinError(true);
      }
    };

    fetchSkins();
  }, [selectedSkin, branch]);

  return { skinData, skinError, skinNames }; // Return the skins object
};

export default GetSkin;
