import { Buffer } from "buffer";

// Function to encode data in Base64
export const base64Encode = (data) => {
  return Buffer.from(data).toString("base64");
};

// Function to decode Base64 data
export const base64Decode = (data) => {
  return Buffer.from(data, "base64").toString("utf-8");
};
