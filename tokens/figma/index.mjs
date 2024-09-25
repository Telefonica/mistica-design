import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { updateSkinFiles } from "./update-skins.mjs";
import { updateMiddleware } from "./update-middleware.mjs";
import { BRANDS } from "./utils/constants.mjs";

import {
  extractSkinJsonData,
  extractMiddlewareJsonData,
} from "./utils/extract-json-data.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tokensPath = path.resolve(__dirname, "../");

const files = fs.readdirSync(tokensPath);

const jsonFiles = files.filter((file) =>
  file.endsWith(".json")
);
const jsonDataForSkin = extractSkinJsonData(
  jsonFiles,
  tokensPath
);

const jsonDataForMiddleware =
  extractMiddlewareJsonData(
    jsonFiles,
    tokensPath
  );

const MIDDLEWARE_TOKEN =
  process.env.MIDDLEWARE_KEY;

const brands = {
  // Remember to sync these with the workflow file
  [BRANDS.MOVISTAR]:
    process.env.MOVISTAR_FILE_KEY,
  [BRANDS.O2_NEW]: process.env.O2_NEW_FILE_KEY,
  [BRANDS.VIVO_NEW]:
    process.env.VIVO_NEW_FILE_KEY,
  [BRANDS.TELEFONICA]:
    process.env.TELEFONICA_FILE_KEY,
  [BRANDS.BLAU]: process.env.BLAU_FILE_KEY,
  [BRANDS.TU]: process.env.TU_FILE_KEY,
};

const brandNames = Object.keys(brands);

async function processAll() {
  await updateSkinFiles(jsonDataForSkin, brands);
  await updateMiddleware(
    jsonDataForMiddleware,
    brandNames,
    MIDDLEWARE_TOKEN
  );
}

processAll();
