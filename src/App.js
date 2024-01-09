import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Tokens from "./pages/Tokens";
import Dashboard from "./pages/Dashboard";
import TokensMap from "./pages/TokensMap";
import ColorDetail from "./pages/colorDetail";
import TokenDetail from "./pages/tokenDetail";
import { skinVars } from "@telefonica/mistica";
import { getTelefonicaSkin, ThemeContextProvider } from "@telefonica/mistica";
import { useState } from "react";
import { createContext } from "react";
import SkinGenerator from "./pages/skinGenerator";
import PaletteGenerator from "./pages/paletteGenerator";
import Wrapped2023 from "./pages/wrapped2023/index";

export const SchemeContext = createContext();

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/Tokens",
      element: <Tokens />,
    },
    {
      path: "/Dashboard",
      element: <Dashboard />,
    },
    {
      path: "/tokens-map",
      element: <TokensMap />,
    },
    {
      path: `/tokens-map/:branch/:selectedSkin/:tokenType/:id`,
      element: <ColorDetail />,
    },
    {
      path: `/tokens-map/:branch/:selectedSkin/:tokenType/:tokenTextType/:id`,
      element: <TokenDetail />,
    },
    {
      path: `/skin-generator`,
      element: <SkinGenerator />,
    },
    {
      path: `/palette-generator`,
      element: <PaletteGenerator />,
    },
    {
      path: `/palette-generator`,
      element: <PaletteGenerator />,
    },
    {
      path: `/wrapped-2023`,
      element: <Wrapped2023 />,
    },
  ]);
  const [theme, setTheme] = useState("light");
  return (
    <SchemeContext.Provider value={{ theme, setTheme }}>
      <ThemeContextProvider
        theme={{
          skin: getTelefonicaSkin(),
          i18n: { locale: "es-ES", phoneNumberFormattingRegionCode: "ES" },
          colorScheme: theme,
          isDarkMode: theme === "dark" ? true : false,
        }}
      >
        <div style={{ background: skinVars.colors.background }}>
          <RouterProvider router={router}>
            <Home />
          </RouterProvider>
        </div>
      </ThemeContextProvider>
    </SchemeContext.Provider>
  );
};

export default App;
