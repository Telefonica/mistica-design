import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Tokens from "./pages/Tokens";
import Dashboard from "./pages/Dashboard";
import { skinVars } from "@telefonica/mistica";

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

  return (
    <>
      <div style={{ background: skinVars.colors.background }}>
        <RouterProvider router={router}>
          <Home />
        </RouterProvider>
      </div>
    </>
  );
};

export default App;
