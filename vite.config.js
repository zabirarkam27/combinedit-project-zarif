import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const devPort = Number(env.VITE_DEV_PORT || 5173);

  return {
    plugins: [react(), tailwindcss()],
    server: {
      host: env.VITE_DEV_HOST || "localhost",
      port: Number.isNaN(devPort) ? 5173 : devPort,
      strictPort: true,
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
  };
});
