import React from "react";
import { skinVars, Text, Stack, Tag } from "@telefonica/mistica";

function ContrastChecker({ contrastRatio }) {
  // Function to check if the contrast ratio meets the WCAG recommendation for text (AA and AAA) and graphical objects (AA)
  function isContrastRatioCompliant(contrastRatio, isGraphicalObject) {
    if (isGraphicalObject) {
      // WCAG 2.0 AA for graphical objects
      return contrastRatio >= 3.0 ? (
        <span
          style={{
            background: skinVars.colors.successLow,
            padding: 4,
            borderRadius: 4,
          }}
        >
          <Text weight="medium" color={skinVars.colors.successHigh}>
            AA
          </Text>
        </span>
      ) : (
        <span
          style={{
            background: skinVars.colors.errorLow,
            padding: 4,
            borderRadius: 4,
          }}
        >
          <Text weight="medium" color={skinVars.colors.errorHigh}>
            Failed
          </Text>
        </span>
      );
    } else {
      // WCAG 2.0 AA for text
      const isAACompliant = contrastRatio >= 4.5;
      // WCAG 2.0 AAA for text
      const isAAACompliant = contrastRatio >= 7.0;

      return isAAACompliant ? (
        <span
          style={{
            background: skinVars.colors.successLow,
            padding: 4,
            borderRadius: 4,
          }}
        >
          <Text weight="medium" color={skinVars.colors.successHigh}>
            AAA
          </Text>
        </span>
      ) : isAACompliant ? (
        <span
          style={{
            background: skinVars.colors.successLow,
            padding: 4,
            borderRadius: 4,
          }}
        >
          <Text weight="medium" color={skinVars.colors.successHigh}>
            AA
          </Text>
        </span>
      ) : (
        <span
          style={{
            background: skinVars.colors.errorLow,
            padding: 4,
            borderRadius: 4,
          }}
        >
          <Text weight="medium" color={skinVars.colors.errorHigh}>
            Failed
          </Text>
        </span>
      );
    }
  }

  // Check if the contrast ratio meets the WCAG recommendation for text and graphical objects
  const isTextAACompliant = isContrastRatioCompliant(contrastRatio, false);
  const isGraphicalObjectAACompliant = isContrastRatioCompliant(
    contrastRatio,
    true
  );

  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        alignItems: "center",
      }}
    >
      <Stack space={4}>
        <Text weight="medium">
          {contrastRatio} {isTextAACompliant}
        </Text>
      </Stack>
    </div>
  );
}

export default ContrastChecker;
