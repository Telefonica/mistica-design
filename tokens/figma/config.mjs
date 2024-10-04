import dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

import { BRANDS } from "./utils/constants.mjs";

export const brands = {
  [BRANDS.MOVISTAR]: "ObNHOLPtrIytjy9BH7M9jW",
  [BRANDS.O2_NEW]: "CjvgrHEIycSQ6exznxnFXT",
  [BRANDS.VIVO_NEW]: "EApRpjaTyUOwW5VQU2ZqgP",
  [BRANDS.TELEFONICA]: "m8srmP3eedfvDaqYnbM6PI",
  [BRANDS.BLAU]: "czemeClWRGBI8oF7caNa5m",
  [BRANDS.TU]: "19IXMaFqdYeC1IIdTwXBgY",
};

export const MIDDLEWARE_TOKEN =
  "w7fBxCsEb8WrMVVuxDnCQd";

export const FIGMA_TOKEN =
  process.env.FIGMA_TOKEN;
