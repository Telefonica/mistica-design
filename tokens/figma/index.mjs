import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { updateSkinFiles } from "./update-skins.mjs";
import { updateMiddleware } from "./update-middleware.mjs";

import {
  extractSkinJsonData,
  extractMiddlewareJsonData,
} from "./utils/extract-json-data.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tokensPath = path.resolve(__dirname, "../");

const files = fs.readdirSync(tokensPath);

const topLevelJsonFiles = files.filter((file) =>
  file.endsWith(".json")
);

// Community brands live in tokens/community/ and are
// referenced with a "community/" prefix so their paths
// resolve correctly while their brand key stays the bare
// file name (see extract-json-data.mjs).
const communityPath = path.resolve(
  tokensPath,
  "community"
);

const communityJsonFiles = fs.existsSync(
  communityPath
)
  ? fs
      .readdirSync(communityPath)
      .filter((file) => file.endsWith(".json"))
      .map((file) => `community/${file}`)
  : [];

const jsonFiles = [
  ...topLevelJsonFiles,
  ...communityJsonFiles,
];

const jsonDataForSkin = extractSkinJsonData(
  jsonFiles,
  tokensPath
);

const jsonDataForMiddleware =
  extractMiddlewareJsonData(
    jsonFiles,
    tokensPath
  );

async function processAll() {
  await updateSkinFiles(jsonDataForSkin);
  await updateMiddleware(jsonDataForMiddleware);
}

processAll();
