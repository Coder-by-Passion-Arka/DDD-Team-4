import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
// import dotenv from "dotenv";

// dotenv.config({ path: "src/.env" });

let ClIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  "10314053648-9i01d2gvt3qpspm6elmapdpakishbco9.apps.googleusercontent.com";
if (!ClIENT_ID) {
  console.error("❌ GOOGLE_CLIENT_ID is not defined in environment variables");
  ClIENT_ID = "";
}
let CLIENT_SECRET =
  import.meta.env.VITE_GOOGLE_CLIENT_SECRET || "Cag79NiH_WVQ2vccjAEkZ0c4HaYZ";
if (!CLIENT_SECRET) {
  console.error(
    "❌ GOOGLE_CLIENT_SECRET is not defined in environment variables"
  );
  CLIENT_SECRET = "";
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={ClIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);
