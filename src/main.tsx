import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import { applyLocale, getLocale } from "./lib/locale";
import { applyTheme, getTheme } from "./lib/theme";

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

applyTheme(getTheme());
applyLocale(getLocale());

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
