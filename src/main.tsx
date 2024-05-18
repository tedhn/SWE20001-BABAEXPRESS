import React from "react";
import ReactDOM from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import { AirTableProvider } from "./Context/AirTableContext.tsx";
import { Toaster } from "react-hot-toast";

import "@mantine/core/styles.css";

import App from "./App.tsx";
import "./index.css";
import { UserProvider } from "./Context/UserContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MantineProvider>
      <AirTableProvider>
        <UserProvider>
          <Toaster />
          <App />
        </UserProvider>
      </AirTableProvider>
    </MantineProvider>
  </React.StrictMode>
);
