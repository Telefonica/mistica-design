import { hcl, hsl } from "d3-color";
import hexToRgbA from "./hexToRgba";

// Function to calculate the difference in luminosity between two HCL colors
const calculateLuminosityDifference = (color1, color2) => {
  return Math.abs(color1.l - color2.l);
};

export const getHCLScale = (color, steps) => {
  // Check if color is hex
  if (!color?.startsWith("#")) {
    return undefined;
  } else {
    // Create an HCL color object from the hex color
    const hclColor = hcl(color);

    // Get the hue and chroma values from the HCL color
    const hue = hclColor.h;
    const chroma = hclColor.c;

    // Calculate the step size based on the desired number of steps
    const stepSize = (95 - 5) / (steps - 1); // Adjust the range as needed

    // Generate an array of colors with adjusted lightness
    const colorScale = Array.from({ length: steps }, (_, idx) =>
      hcl(hue, chroma, idx * stepSize)
    );
    // Convert the color objects to hex strings
    const scaleValues = colorScale.map((color) => color.toString());

    // Calculate the luminosity difference between the given color and the generated colors
    const luminosityDifferences = colorScale.map((generatedColor) =>
      calculateLuminosityDifference(color.toString(), generatedColor)
    );

    // Find the index of the color with the closest luminosity
    const closestLuminosityIndex = luminosityDifferences.indexOf(
      Math.min(...luminosityDifferences)
    );

    // Replace the given color with the closest luminosity color
    scaleValues[closestLuminosityIndex] = color;

    return scaleValues;
  }
};

const calculateLightnessDifference = (color1, color2) => {
  return Math.abs(color1.l - color2.l);
};

export const getHSLScale = (color, steps) => {
  if (!color?.startsWith("#")) {
    return undefined;
  } else {
    const hslColor = hsl(color);

    const hue = hslColor.h;
    const saturation = hslColor.s;

    // Define the desired lightness range
    const minLightness = 0.05;
    const maxLightness = 0.95;

    // Calculate the step size based on the desired number of steps and the desired lightness range
    const stepSize = (maxLightness - minLightness) / (steps - 1);

    // Generate the color scale with adjusted lightness values within the range
    const colorScale = Array.from({ length: steps }, (_, idx) => {
      const adjustedLightness = minLightness + idx * stepSize;
      return hsl(hue, saturation, adjustedLightness);
    });

    console.log(colorScale);

    // Convert the color objects to HSL strings
    const scaleValues = colorScale.map((color) => color.toString());

    // Calculate the lightness difference between the given color and the generated colors
    const lightnessDifferences = colorScale.map((generatedColor) =>
      calculateLightnessDifference(hslColor.toString(), generatedColor)
    );

    // Find the index of the color with the closest lightness
    const closestLightnessIndex = lightnessDifferences.indexOf(
      Math.min(...lightnessDifferences)
    );

    // Replace the given color in the scale with the closest lightness color
    scaleValues[closestLightnessIndex] = color;

    return scaleValues;
  }
};
