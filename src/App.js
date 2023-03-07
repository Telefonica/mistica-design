import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Tokens from "./pages/Tokens";
import Dashboard from "./pages/Dashboard";
import { skinVars } from "@telefonica/mistica";
import { getTelefonicaSkin, ThemeContextProvider } from "@telefonica/mistica";
import { useState } from "react";
import { createContext } from "react";

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
  ]);
  const [theme, setTheme] = useState("light");
  return (
    <SchemeContext.Provider value={{ theme, setTheme }}>
      <ThemeContextProvider
        theme={{
          skin: getTelefonicaSkin(),
          i18n: { locale: "es-ES", phoneNumberFormattingRegionCode: "ES" },
          colorScheme: theme,
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
