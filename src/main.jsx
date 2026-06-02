import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";
import "./App.css";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ToastProvider>
      <App />
    </ToastProvider>
  </BrowserRouter>
);
