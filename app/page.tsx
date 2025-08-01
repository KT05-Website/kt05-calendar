"use client";

import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { setHours, setMinutes } from "date-fns";

export default function BookingForm() {
  const [loading, setLoading] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [confirmed, setConfirmed] = useState(false); // Confirmation state

  // Dummy name/email (from Framer contact details)
  const name = "Murtaza Abbasali";
  const email = "kt05.orders@gmail.com";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!startTime) {
      alert("Please select a time.");
      return;
    }

    setLoading(true);

    const endTime = new Date(startTime);
    endTime.setHours(startTime.getHours() + 1); // Always 1-hour slot

    const formData = {
      name,
      email,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
    };

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setConfirmed(true);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      alert("Error booking slot.");
    } finally {
      setLoading(false);
    }
  }

  // If confirmed, show confirmation page
  if (confirmed && startTime) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          color: "white",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
          Booking Confirmed!
        </h1>
        <p>
          You booked:{" "}
          <strong>
            {startTime.toLocaleDateString()} at{" "}
            {startTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
            {" "}–{" "}
            {new Date(startTime.getTime() + 60 * 60 * 1000).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </strong>
        </p>

        <button
          onClick={() =>
            (window.location.href = "https://buy.stripe.com/test_123456") // Dummy Stripe link
          }
          style={{
            marginTop: "2rem",
            padding: "10px 20px",
            backgroundColor: "#635BFF",
            color: "white",
            border: "none",
            borderRadius: "5px",
            fontSize: "1.2rem",
            cursor: "pointer",
          }}
        >
          Proceed to Payment
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        color: "white",
      }}
    >
      <p style={{ fontSize: "32px", textAlign: "center", marginBottom: "1rem", whiteSpace: "pre-line" }}>
        Select a Time (1 hour slot){"\n"}for your booking consultation:
      </p>

      <div
        style={{
          border: "2px solid blue", // Always visible border
          borderRadius: "4px",
          padding: "0.5rem",
          marginBottom: "1rem",
        }}
      >
        <DatePicker
          selected={startTime}
          onChange={(date) => setStartTime(date)}
          showTimeSelect
          dateFormat="Pp"
          filterDate={(date) => date.getDay() !== 0} // Disable Sundays
          minTime={setHours(setMinutes(new Date(), 0), 9)} // 9:00 AM
          maxTime={setHours(setMinutes(new Date(), 0), 20)} // 8:00 PM
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        style={{
          border: "2px solid white",
          padding: "10px 20px",
          backgroundColor: "transparent",
          color: "white",
          fontSize: "1.2rem",
          cursor: "pointer",
        }}
      >
        {loading ? "Booking..." : "Book Now"}
      </button>
    </form>
  );
}