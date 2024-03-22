import React from "react";
import ReactDOM from "react-dom/client";
import "./global.css";
import AppRoutes from "./AppRoutes";
import Providers from "./components/Providers";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Providers>
      <AppRoutes />
    </Providers>
  </React.StrictMode>
);
