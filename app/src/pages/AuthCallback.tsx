// src/pages/AuthCallback.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Since Supabase OAuth is removed,
    // this page simply redirects the user safely.
    navigate("/profile");
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#121212] text-white">
      <div className="p-6 bg-[#1f1f1f] rounded-xl shadow text-center">
        <p className="mb-2 text-lg font-semibold">Finalizing sign-in…</p>
        <p className="text-sm text-gray-400">
          Redirecting you to your profile.
        </p>
      </div>
    </div>
  );
}
