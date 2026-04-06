export default function Unauthorized() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "#050505",
        fontFamily: "'Courier New', Courier, monospace",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          padding: "40px",
          border: "1px solid #1a1a1a",
          borderRadius: "4px",
          background: "#080808",
          boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
        }}
      >
        {/* Main Error Code */}
        <h1
          style={{
            color: "#ef4444",
            fontSize: "14px",
            letterSpacing: "0.4em",
            fontWeight: "bold",
            margin: "0 0 10px 0",
            textShadow: "0 0 10px rgba(239, 68, 68, 0.3)",
          }}
        >
          ERR_UNAUTHORIZED_ACCESS
        </h1>

        {/* Divider */}
        <div style={{ height: "1px", background: "#1a1a1a", margin: "20px 0" }} />

        {/* Message */}
        <p style={{ color: "#666", fontSize: "12px", lineHeight: "1.6" }}>
          Validation failed: Insufficient administrative privileges. <br />
          Your attempt has been logged.
        </p>

        {/* Action Link */}
        <a
          href="/dashboard"
          style={{
            display: "inline-block",
            marginTop: "25px",
            color: "#22c55e",
            fontSize: "12px",
            textDecoration: "none",
            border: "1px solid #22c55e",
            padding: "8px 16px",
            borderRadius: "2px",
            transition: "all 0.2s ease",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = "#22c55e";
            e.currentTarget.style.color = "#000";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#22c55e";
          }}
        >
          RETURN TO DASHBOARD
        </a>
      </div>
    </div>
  );
}