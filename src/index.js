import React from "react";
// Telegram Web App hash cleanup
if (window.location.hash.includes('tgWebAppData')) {
  window.history.replaceState(null, document.title, window.location.pathname + '#/');
}

import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);