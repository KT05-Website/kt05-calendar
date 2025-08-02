export default function SuccessPage() {
  return (
    <div
      style={{
        fontFamily: "Inter, sans-serif",
        padding: "40px",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "48px", fontWeight: "bold", marginBottom: "20px" }}>
        Payment Successful!
      </h1>
      <p style={{ fontSize: "20px", marginBottom: "30px" }}>
        Thank you for securing your spot. We’ve sent you an email with next
        steps and a link to book your consultation.
      </p>
      <a
        href="/"
        style={{
          padding: "12px 24px",
          backgroundColor: "#000",
          color: "#fff",
          borderRadius: "8px",
          fontSize: "18px",
          textDecoration: "none",
        }}
      >
        Back to Home
      </a>
    </div>
  );
}