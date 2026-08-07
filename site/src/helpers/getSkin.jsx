import { allTokens, tokenNames } from '../lib/tokens';

/**
 * Returns token skin data from the co-located tokens/ directory.
 *
 * Previously this hook fetched JSON files from the GitHub raw API at runtime.
 * Now that the site lives alongside tokens/ on the production branch, Vite
 * imports them statically at build time — no network calls, no rate-limit risk.
 */
const GetSkin = ({ selectedSkin }) => {
  const skinNames = tokenNames.map(({ value, text, community }) => ({
    value,
    text: community ? `${text}` : text,
  }));

  const skinData = selectedSkin ? allTokens[selectedSkin] ?? {} : allTokens;

  return { skinData, skinError: false, skinNames };
};

export default GetSkin;
