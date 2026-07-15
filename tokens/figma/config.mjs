import dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

import { BRANDS } from "./utils/constants.mjs";

export const BRAND_KEY = {
  [BRANDS.MOVISTAR]: "kVMzBCXr4T4zFqLBjuExwe",
  [BRANDS.O2]: "CjvgrHEIycSQ6exznxnFXT",
  [BRANDS.VIVO]: "EApRpjaTyUOwW5VQU2ZqgP",
  [BRANDS.VIVO_EVOLUTION]:
    "sDxRJeu0D7OEX5FjJsORbu",
  [BRANDS.TELEFONICA]: "m8srmP3eedfvDaqYnbM6PI",
  [BRANDS.BLAU]: "czemeClWRGBI8oF7caNa5m",
  [BRANDS.ESIMFLAG]: "5WSkNxQ7GwbfagfJqXfZSs",
  [BRANDS.UNBRANDED]: "4MCgtJnkTXK8zTE3thNjzu",
  [BRANDS.CYBER]: "UqJLBr2XCY0KCBLL842sOJ",
};

export const MIDDLEWARE_KEY =
  "w7fBxCsEb8WrMVVuxDnCQd";

export const FIGMA_TOKEN =
  process.env.FIGMA_TOKEN;
