"use client";

// Issue #16: Global Error Boundary für alle Route-Segmente
import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log error to monitoring service (e.g. Sentry) here
    console.error("[GlobalError]", error.message, error.digest);
  }, [error]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(165deg, #0a1628 0%, #0f1e36 50%, #162d50 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        fontFamily: "var(--font-sans, system-ui, sans-serif)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          maxWidth: "28rem",
          width: "100%",
          textAlign: "center",
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "rgba(206,19,45,0.15)",
            border: "1px solid rgba(206,19,45,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.5rem",
          }}
        >
          <AlertTriangle style={{ width: 28, height: 28, color: "#CE132D" }} />
        </div>

        {/* Title */}
        <h1 style={{ color: "#fff", fontSize: "1.5rem", fontWeight: 800, marginBottom: "0.75rem" }}>
          Ein Fehler ist aufgetreten
        </h1>

        {/* Message */}
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.875rem", marginBottom: "2rem", lineHeight: 1.6 }}>
          {error.message || "Ein unerwarteter Fehler ist aufgetreten. Bitte versuche es erneut."}
          {error.digest && (
            <span style={{ display: "block", marginTop: "0.5rem", fontSize: "0.75rem", color: "rgba(255,255,255,0.25)" }}>
              Code: {error.digest}
            </span>
          )}
        </p>

        {/* Actions */}
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={reset}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.75rem 1.5rem",
              background: "linear-gradient(135deg, #3BA9D3, #6dd2fe)",
              border: "none",
              borderRadius: "0.625rem",
              color: "#001231",
              fontWeight: 700,
              fontSize: "0.875rem",
              cursor: "pointer",
              transition: "opacity 0.15s ease",
            }}
            onMouseOver={(e) => (e.currentTarget.style.opacity = "0.85")}
            onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
          >
            <RefreshCw style={{ width: 15, height: 15 }} />
            Erneut versuchen
          </button>

          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.75rem 1.5rem",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "0.625rem",
              color: "rgba(255,255,255,0.7)",
              fontWeight: 600,
              fontSize: "0.875rem",
              textDecoration: "none",
            }}
          >
            <Home style={{ width: 15, height: 15 }} />
            Zur Startseite
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
