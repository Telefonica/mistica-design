import React, { createContext, useContext } from "react";
import { ThemeContextProvider } from "@telefonica/mistica";

// Create a custom context for the Preview component
const PreviewContext = createContext();

export const PreviewProvider = ({ children, skin }) => {
  return (
    <PreviewContext.Provider value={skin}>{children}</PreviewContext.Provider>
  );
};

export const usePreviewTheme = () => {
  return useContext(PreviewContext);
};

const Preview = ({ children }) => {
  // Use the theme from the context
  const theme = usePreviewTheme();

  return (
    <ThemeContextProvider
      theme={{
        skin: theme, // Use the provided skin object
        i18n: {
          locale: "es-ES",
          phoneNumberFormattingRegionCode: "ES",
        },
      }}
    >
      <html>
        <head>
          {/* Add your HTML head content here */}
          <title>Your Page Title</title>
          <link rel="stylesheet" href="your-styles.css" />
          {/* Add any other head content like meta tags, scripts, or stylesheets */}
        </head>
        <body>
          {children}
          {/* Include your React children inside the body */}
        </body>
      </html>
    </ThemeContextProvider>
  );
};

export default Preview;
