import { StrictMode } from "react";
import "@mcp-b/global";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { initializeWebModelContext } from '@mcp-b/global'

// Must run before anything else touches navigator.modelContext
initializeWebModelContext({
  installTestingShim: 'always',   // ← forces the shim even if @mcp-b/global already ran
})

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
