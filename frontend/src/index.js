import React from "react";
import ReactDOM from "react-dom/client"; // Use createRoot from react-dom/client
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import "./App.css"; // Ensure your styles are imported

// const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);