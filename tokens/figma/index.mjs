import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { updateSkinFiles } from "./update-skins.mjs";
import { updateMiddleware } from "./update-middleware.mjs";

import {
  extractSkinJsonData,
  extractMiddlewareJsonData,
} from "./extract-json-data.mjs";

dotenv.config({ path: "../../.env" });
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

const FIGMA_TOKEN = process.env.FIGMA_TOKEN;
const MIDDLEWARE_TOKEN =
  process.env.MIDDLEWARE_KEY;

const FILE_KEYS = {
  // Remember to sync these with the workflow file
  movistar: process.env.MOVISTAR_FILE_KEY,
  "o2-new": process.env.O2_NEW_FILE_KEY,
  "vivo-new": process.env.VIVO_NEW_FILE_KEY,
  telefonica: process.env.TELEFONICA_FILE_KEY,
  blau: process.env.BLAU_FILE_KEY,
  tu: process.env.TU_FILE_KEY,
};

const brands = Object.fromEntries(
  Object.entries(FILE_KEYS).map(
    ([brand, FILE_KEY]) => [brand, FILE_KEY]
  )
);

const brandNames = Object.keys(brands);

async function processAll() {
  await updateSkinFiles(
    jsonDataForSkin,
    brands,
    FIGMA_TOKEN
  );
  await updateMiddleware(
    jsonDataForMiddleware,
    brandNames,
    MIDDLEWARE_TOKEN,
    FIGMA_TOKEN
  );
}

processAll();
