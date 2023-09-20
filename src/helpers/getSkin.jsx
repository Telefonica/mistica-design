import { useState, useEffect } from "react";

const GetSkin = ({ selectedSkin, branch }) => {
  const [skinData, setSkinData] = useState({});
  const [skinError, setSkinError] = useState(null);

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
      const fetchedSkins = {};

      try {
        for (let i = 0; i < skinNames.length; i++) {
          const skinName = skinNames[i];
          const response = await fetch(
            `https://raw.githubusercontent.com/Telefonica/mistica-design/${branch}/tokens/${skinName}.json`
          );
          const data = await response.json();
          fetchedSkins[skinName] = data;

          // Log the fetched data for debugging
        }

        if (selectedSkin) {
          // If a selected skin is provided, set the skin data for that skin
          setSkinData(fetchedSkins[selectedSkin]);
          setSkinError(false);
        } else {
          // If no selected skin is provided, set the skin data for all skins
          setSkinData(fetchedSkins);
          setSkinError(false);
        }
      } catch (error) {
        console.error(error);
        setSkinError(true);
      }
    };

    fetchSkins();
  }, [selectedSkin, branch]);

  return { skinData, skinError }; // Return the skins object
};

export default GetSkin;
