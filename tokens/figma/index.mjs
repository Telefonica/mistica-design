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
  process.env.MIDDLEWARE_TEST;

const brands = {
  // Remember to sync these with the workflow file
  [BRANDS.MOVISTAR]: process.env.FILE_KEY_1,
  [BRANDS.O2_NEW]: process.env.FILE_KEY_2,
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
