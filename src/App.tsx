import { lazy } from "react";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

const Login = lazy(() => import("./Pages/Auth/Login"));
const LayoutContainer = lazy(() => import("./Layout"));
const Register = lazy(() => import("./Pages/Auth/Register"));
const Dashboard = lazy(() => import("./Pages/Dashboard"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <LayoutContainer />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      { path: "dashboard", element: <Dashboard /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
