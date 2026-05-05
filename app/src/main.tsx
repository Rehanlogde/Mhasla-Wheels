import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AuthProvider } from "@/context/AuthContext"; // ✅ import provider
import { GoogleOAuthProvider } from '@react-oauth/google';

const clientid = "463169136486-8rumlbcehnbf2sk2rnb35q43jqg46a0f.apps.googleusercontent.com"
createRoot(document.getElementById("root")!).render(

    <GoogleOAuthProvider clientId={clientid}>
    <AuthProvider>
      <App />
    </AuthProvider>
    </GoogleOAuthProvider>
);
