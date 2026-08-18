import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { applyTheme, getTheme } from "./lib/theme";

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

applyTheme(getTheme());

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
