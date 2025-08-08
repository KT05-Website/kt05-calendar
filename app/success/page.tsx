export default function SuccessPage() {
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
        Payment Successful!
      </h1>
      <p
        style={{
          fontSize: "clamp(16px, 3.5vw, 18px)",
          marginBottom: "0",
          maxWidth: "500px",
          lineHeight: 1.5,
        }}
      >
        Thank you for securing your spot. We’ve sent you an email with your booking confimation and next steps.
      </p>
    </div>
  );
}