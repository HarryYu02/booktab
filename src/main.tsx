import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "./providers/ThemeProvider.tsx";

const root = document.createElement("div");
root.id = "crx-root";
document.body.appendChild(root);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
            <App />
        </ThemeProvider>
    </React.StrictMode>
);
