import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    hmr: {
      overlay: false,
    },
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "firebase/app",
      "firebase/auth",
      "framer-motion",
      "react-icons/bs",
      "axios",
      "@react-pdf/renderer",
      "react-toastify",
      "sweetalert2",
    ],
    exclude: ["chart.js", "react-chartjs-2"],
  },
});
