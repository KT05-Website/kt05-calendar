export default function CancelPage() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: "0 16px",
        backgroundColor: "#000",
        color: "#fff",
        textAlign: "center",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <h1
        style={{
          fontSize: "clamp(28px, 5vw, 40px)",
          fontWeight: "bold",
          marginBottom: "16px",
          lineHeight: 1.2,
        }}
      >
        Payment Canceled
      </h1>
      <p
        style={{
          fontSize: "clamp(16px, 3.5vw, 18px)",
          marginBottom: "0",
          maxWidth: "500px",
          lineHeight: 1.5,
        }}
      >
        No worries — you can return to complete your booking anytime.  
        Please go back to the main page and try again.
      </p>
    </div>
  );
}