import { Navigate } from "react-router";
import { supabase } from "./supabase";
import { useState, useEffect } from "react";

export default function ProtectedRoute({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // تشييك سريع على الجلسة الحالية
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="bg-black min-h-screen" />; // شاشة سوداء لحظية

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return children;
}