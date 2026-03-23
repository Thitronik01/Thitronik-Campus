// Issue #16: Global Loading State für alle Route-Segmente
export default function GlobalLoading() {
  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1.5rem",
      }}
    >
      {/* Animated logo placeholder */}
      <div style={{ position: "relative", width: 56, height: 56 }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: "3px solid rgba(59,169,211,0.15)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: "3px solid transparent",
            borderTopColor: "#3BA9D3",
            animation: "spin 0.8s linear infinite",
          }}
        />
      </div>

      <p
        style={{
          color: "rgba(255,255,255,0.4)",
          fontSize: "0.75rem",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
        }}
      >
        Wird geladen...
      </p>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
