import { useState, useEffect } from "react";

const GetSkin = ({ selectedSkin, branch }) => {
  const [skinData, setSkinData] = useState({});
  const [skinNames, setSkinNames] = useState([]);
  const [skinError, setSkinError] = useState(null);

  useEffect(() => {
    const branchRef = branch || "production";

    const getSkinEntries = async () => {
      const [topLevelRes, communityRes] = await Promise.all([
        fetch(
          `https://api.github.com/repos/Telefonica/mistica-design/contents/tokens?ref=${branchRef}`
        ),
        fetch(
          `https://api.github.com/repos/Telefonica/mistica-design/contents/tokens/community?ref=${branchRef}`
        ),
      ]);

      const topLevel = (
        topLevelRes?.status === 200 ? await topLevelRes.json() : []
      )
        .filter((f) => f.name.endsWith(".json"))
        .map((f) => ({ name: f.name.slice(0, -5), community: false }));

      const community = (
        communityRes?.status === 200 ? await communityRes.json() : []
      )
        .filter((f) => f.type === "file" && f.name.endsWith(".json"))
        .map((f) => ({ name: f.name.slice(0, -5), community: true }));

      return [...topLevel, ...community];
    };

    const fetchSkins = async () => {
      const entries = await getSkinEntries();
      const fetchedSkins = {};

      try {
        for (const { name, community } of entries) {
          const path = community ? `community/${name}.json` : `${name}.json`;
          const response = await fetch(
            `https://raw.githubusercontent.com/Telefonica/mistica-design/${branchRef}/tokens/${path}`
          );
          const data = await response.json();
          fetchedSkins[name] = data;
        }

        const namesList = entries.map(({ name, community }) => ({
          value: name,
          text: community
            ? `${name.charAt(0).toUpperCase() + name.slice(1)} (Community)`
            : name.charAt(0).toUpperCase() + name.slice(1),
        }));

        if (selectedSkin) {
          setSkinData(fetchedSkins[selectedSkin]);
          setSkinNames(namesList);
          setSkinError(false);
        } else {
          setSkinData(fetchedSkins);
          setSkinNames(namesList);
          setSkinError(false);
        }
      } catch (error) {
        console.error(error);
        setSkinError(true);
      }
    };

    fetchSkins();
  }, [selectedSkin, branch]);

  return { skinData, skinError, skinNames };
};

export default GetSkin;
