import dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

import { BRANDS } from "./utils/constants.mjs";

export const BRAND_KEY = {
  [BRANDS.AI_NATIVE_SOC]:
    "UqJLBr2XCY0KCBLL842sOJ",
};

export const MIDDLEWARE_KEY =
  "3riXcRcvkiyvLE1nERMq9Y";

export const FIGMA_TOKEN =
  process.env.FIGMA_TOKEN;
