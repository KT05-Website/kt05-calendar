export default function CancelPage() {
  return (
    <div
      style={{
        fontFamily: "Inter, sans-serif",
        padding: "40px",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "48px", fontWeight: "bold", marginBottom: "20px" }}>
        Payment Canceled
      </h1>
      <p style={{ fontSize: "20px", marginBottom: "30px" }}>
        No worries — you can return to complete your booking anytime.
      </p>
      <a
        href="/design-your-own"
        style={{
          padding: "12px 24px",
          backgroundColor: "#000",
          color: "#fff",
          borderRadius: "8px",
          fontSize: "18px",
          textDecoration: "none",
        }}
      >
        Try Again
      </a>
    </div>
  );
}