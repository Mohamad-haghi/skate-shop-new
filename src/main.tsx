import React from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App";
import "./styles/index.css";

document.documentElement.lang = "fa";
document.documentElement.dir = "rtl";
document.body.dir = "rtl";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
