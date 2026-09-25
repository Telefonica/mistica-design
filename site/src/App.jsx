import React, { Suspense, lazy, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import { skinVars, getTelefonicaSkin, ThemeContextProvider } from "@telefonica/mistica";
import { SchemeContext } from "./context/scheme-context";

// Core pages — loaded eagerly
import Home from "./pages/Home";
import Tokens from "./pages/Tokens";
import Dashboard from "./pages/Dashboard";
import TokensMap from "./pages/TokensMap";
import ColorDetail from "./pages/mistica-tokens/color-detail";
import TokenDetail from "./pages/mistica-tokens/token-detail";
import SkinGenerator from "./pages/skinGenerator";
import PaletteGenerator from "./pages/paletteGenerator";
import Skin2Json from "./pages/skin2Json";
import SkinTool from "./pages/skin-tool";
import ProductStatus from "./pages/mistica-product-status/index";

// Seasonal pages — lazy-loaded to keep the initial bundle small
const Wrapped2023 = lazy(() => import("./pages/wrapped2023/index"));
const WrappedFinale = lazy(() => import("./pages/wrapped2023/finale"));
const AdventCalendar2024 = lazy(() => import("./pages/advent-calendar-2024/index"));
const ComingSoon = lazy(() => import("./pages/advent-calendar-2024/pages/coming-soon"));
const ProgressView = lazy(() => import("./pages/advent-calendar-2024/pages/progress-view"));
const ClaimYourGift = lazy(() => import("./pages/advent-calendar-2024/pages/claim-your-gift"));

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/Tokens", element: <Tokens /> },
  { path: "/Dashboard", element: <Dashboard /> },
  { path: "/tokens-map", element: <TokensMap /> },
  { path: "/tokens-map/:branch/:selectedSkin/:tokenType/:id", element: <ColorDetail /> },
  { path: "/tokens-map/:branch/:selectedSkin/:tokenType/:tokenTextType/:id", element: <TokenDetail /> },
  { path: "/skin-generator", element: <SkinGenerator /> },
  { path: "/palette-generator", element: <PaletteGenerator /> },
  { path: "/wrapped-2023", element: <Wrapped2023 /> },
  { path: "/wrapped-2023/finale", element: <WrappedFinale /> },
  { path: "/advent-calendar-2024", element: <AdventCalendar2024 /> },
  { path: "/advent-calendar-2024/coming-soon", element: <ComingSoon /> },
  { path: "/advent-calendar-2024/progress-view", element: <ProgressView /> },
  { path: "/advent-calendar-2024/claim-your-gift", element: <ClaimYourGift /> },
  { path: "/skin2json", element: <Skin2Json /> },
  { path: "/skin-tool", element: <SkinTool /> },
  { path: "/product-status", element: <ProductStatus /> },
]);

const App = () => {
  const [theme, setTheme] = useState("light");
  return (
    <SchemeContext.Provider value={{ theme, setTheme }}>
      <ThemeContextProvider
        theme={{
          skin: getTelefonicaSkin(),
          i18n: { locale: "es-ES", phoneNumberFormattingRegionCode: "ES" },
          colorScheme: theme,
          isDarkMode: theme === "dark",
        }}
      >
        <div style={{ background: skinVars.colors.background }}>
          <Suspense fallback={<div />}>
            <RouterProvider router={router} />
          </Suspense>
        </div>
      </ThemeContextProvider>
    </SchemeContext.Provider>
  );
};

export default App;
