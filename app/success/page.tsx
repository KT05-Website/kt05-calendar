export default function SuccessPage() {
  const framerHomeUrl = process.env.NEXT_PUBLIC_FRAMER_HOME_URL || "/";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#000",
        color: "#fff",
        textAlign: "center",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <h1 style={{ fontSize: "40px", fontWeight: "bold", marginBottom: "20px" }}>
        Payment Successful!
      </h1>
      <p style={{ fontSize: "18px", marginBottom: "30px", maxWidth: "500px" }}>
        Thank you for securing your spot. We’ve sent you an email with next steps and a link to book your consultation.
      </p>

      <a
        href={framerHomeUrl}
        style={{
          backgroundColor: "#fff",
          color: "#000",
          padding: "12px 24px",
          borderRadius: "6px",
          textDecoration: "none",
          fontWeight: "bold",
          fontSize: "16px",
        }}
      >
        Back to Home
      </a>
    </div>
  );
}