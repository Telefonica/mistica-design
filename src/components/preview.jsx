import React from "react";
import { ThemeContextProvider } from "@telefonica/mistica";

const Preview = ({ children, skin }) => {
  return (
    <ThemeContextProvider
      as="div"
      theme={{
        skin: skin,
        i18n: {
          locale: "es-ES",
          phoneNumberFormattingRegionCode: "ES",
        },
      }}
    >
      {children}
    </ThemeContextProvider>
  );
};

export default Preview;
