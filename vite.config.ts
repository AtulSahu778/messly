import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  
  console.log('Vite loading env variables:', {
    VITE_SUPABASE_URL: env.VITE_SUPABASE_URL ? 'Set' : 'Not set',
    VITE_SUPABASE_ANON_KEY: env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Not set',
  });

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "react-icons/sf": path.resolve(__dirname, "./src/icons/sf"),
        "react-icons/sf6": path.resolve(__dirname, "./src/icons/sf6"),
      },
    },
  };
});
