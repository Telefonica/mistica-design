import { useState, useEffect } from "react";
import { allTokens, tokenNames } from "../lib/tokens";

const PRODUCTION_BRANCH = "production";

const staticSkinNames = tokenNames.map(({ value, text, community }) => ({
  value,
  text: community ? `${text}` : text,
}));

/**
 * Returns token skin data.
 *
 * - When branch is "production" (or omitted): tokens are served from the
 *   static registry in src/lib/tokens.ts — imported at build time from the
 *   co-located tokens/ folder. No network calls.
 * - When branch is any other value: tokens are fetched at runtime from the
 *   GitHub raw API so the design team can preview feature-branch changes.
 */
const useSkin = ({ selectedSkin, branch }) => {
  const [fetchedData, setFetchedData] = useState(null);
  const [fetchedNames, setFetchedNames] = useState([]);
  const [skinError, setSkinError] = useState(null);

  const isProduction = !branch || branch === PRODUCTION_BRANCH;

  useEffect(() => {
    if (isProduction) return;

    setSkinError(null);
    setFetchedData(null);
    setFetchedNames([]);

    const fetchSkins = async () => {
      try {
        const [topLevelRes, communityRes] = await Promise.all([
          fetch(
            `https://api.github.com/repos/Telefonica/mistica-design/contents/tokens?ref=${branch}`
          ),
          fetch(
            `https://api.github.com/repos/Telefonica/mistica-design/contents/tokens/community?ref=${branch}`
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

        const entries = [...topLevel, ...community];
        const skins = {};

        for (const { name, community } of entries) {
          const path = community ? `community/${name}.json` : `${name}.json`;
          const res = await fetch(
            `https://raw.githubusercontent.com/Telefonica/mistica-design/${branch}/tokens/${path}`
          );
          skins[name] = await res.json();
        }

        const namesList = entries.map(({ name, community }) => ({
          value: name,
          text: community
            ? `${name.charAt(0).toUpperCase() + name.slice(1)} (Community)`
            : name.charAt(0).toUpperCase() + name.slice(1),
        }));

        setFetchedData(selectedSkin ? skins[selectedSkin] ?? {} : skins);
        setFetchedNames(namesList);
        setSkinError(false);
      } catch (error) {
        console.error(error);
        setSkinError(true);
      }
    };

    fetchSkins();
  }, [branch, selectedSkin, isProduction]);

  if (isProduction) {
    return {
      skinData: selectedSkin ? allTokens[selectedSkin] ?? {} : allTokens,
      skinError: false,
      skinNames: staticSkinNames,
    };
  }

  return {
    skinData: fetchedData ?? {},
    skinError,
    skinNames: fetchedNames.length > 0 ? fetchedNames : staticSkinNames,
  };
};

export default useSkin;
