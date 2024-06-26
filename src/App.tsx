import { lazy, Suspense } from "react";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

const Login = lazy(() => import("./Pages/Auth/Login"));
const LayoutContainer = lazy(() => import("./Layout"));
const Register = lazy(() => import("./Pages/Auth/Register"));
const Dashboard = lazy(() => import("./Pages/Dashboard"));
const Route = lazy(() => import("./Pages/Route/Route"));
const RouteDetails = lazy(() => import("./Pages/Route/RouteDetails"));
const MyTickets = lazy(() => import("./Pages/Tickets/MyTickets"));
const RouteCreate = lazy(() => import("./Pages/Route/RouteCreate"));
const RouteEdit = lazy(() => import("./Pages/Route/RouteEdit"));
const AllTickets = lazy(() => import("./Pages/Tickets/AllTickets"));

const SusWrapper = ({ component }: { component: React.ReactNode }) => {
  return <Suspense fallback={<div>Loading...</div>}>{component}</Suspense>;
};

const router = createBrowserRouter([
  {
    path: "",
    element: <LayoutContainer />,
    children: [
      {
        path: "login",
        element: <SusWrapper component={<Login />} />,
      },
      {
        path: "register",
        element: <SusWrapper component={<Register />} />,
      },
      {
        path: "dashboard",
        element: <SusWrapper component={<Dashboard />} />,
      },
      {
        path: "routes",
        children: [
          { path: "", element: <SusWrapper component={<Route />} /> },
          {
            path: "create",
            element: <SusWrapper component={<RouteCreate />} />,
          },
          {
            path: "edit/:routeId",
            element: <SusWrapper component={<RouteEdit />} />,
          },
          {
            path: ":routeId",
            element: <SusWrapper component={<RouteDetails />} />,
          },
        ],
      },
      { path: "my-tickets", element: <SusWrapper component={<MyTickets />} /> },
      {
        path: "all-tickets",
        element: <SusWrapper component={<AllTickets />} />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
