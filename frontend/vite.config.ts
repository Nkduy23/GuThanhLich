import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true, // Đổi Host header thành target
        secure: false, // Dev mode
        rewrite: (path) => path.replace(/^\/api/, "/api"), // Giữ nguyên path nếu cần
      },
    },
  },
});
