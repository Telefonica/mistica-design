import React, { useState } from "react";
import { ThemeContextProvider, skinVars } from "@telefonica/mistica";

const Preview = ({ children, skin }) => {
  const [colorScheme, setColorScheme] = useState("light");

  return (
    <ThemeContextProvider
      as="div"
      theme={{
        skin: skin,
        colorScheme: colorScheme,
        i18n: {
          locale: "es-ES",
          phoneNumberFormattingRegionCode: "ES",
        },
      }}
    >
      <button
        onClick={() =>
          setColorScheme(colorScheme === "light" ? "dark" : "light")
        }
      >
        {" "}
        Toggle color scheme{" "}
      </button>
      <div style={{ background: skinVars.colors.background }}>{children}</div>
    </ThemeContextProvider>
  );
};

export default Preview;
