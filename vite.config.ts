import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { crx } from "@crxjs/vite-plugin";
import manifest from "./manifest.json";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), crx({ manifest })],
    server: {
        host: "127.0.0.1",
        port: 8080,
        strictPort: true,
        hmr: {
            clientPort: 8080,
        },
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});
