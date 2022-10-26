import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          [
            "module-resolver",
            {
              root: ["./src"],
              alias: {
                "@assets": "./src/assets",
                "@components": "./src/components",
                "@pages": "./src/pages",
                "@styles": "./src/styles",
              },
            },
          ],
        ],
      },
    }),
  ],
  server: {
    port: 3000,
  },
});
