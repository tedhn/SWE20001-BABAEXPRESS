import { lazy } from "react";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

const Login = lazy(() => import("./Auth/Login"));
const LayoutContainer = lazy(() => import("./Layout"));
const Register = lazy(() => import("./Auth/Register"));

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
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
