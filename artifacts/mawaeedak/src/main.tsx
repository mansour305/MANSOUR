import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./styles/mawaeedak-reference.css";
import { registerApiAuth } from "./lib/apiAuth";

// Debug: Log environment info
console.log("[Mawaeedak] VITE_SUPABASE_URL:", import.meta.env.VITE_SUPABASE_URL || "NOT SET");
console.log("[Mawaeedak] VITE_API_BASE_URL:", import.meta.env.VITE_API_BASE_URL || "NOT SET");
console.log("[Mawaeedak] BASE_URL:", import.meta.env.BASE_URL);

registerApiAuth();

console.log("[Mawaeedak] Creating React root...");
const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error("[Mawaeedak] ERROR: #root element not found!");
} else {
  console.log("[Mawaeedak] #root element found, rendering...");
  createRoot(rootElement).render(<App />);
  console.log("[Mawaeedak] React root rendered");
}
