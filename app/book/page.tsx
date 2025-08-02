"use client";

import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function BookingForm() {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name || !email || !startTime || !endTime) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true);

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
        alert(`Booking created! View it here: ${data.eventLink}`);
        setName("");
        setEmail("");
        setStartTime(null);
        setEndTime(null);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (_error) {
      alert("An unexpected error occurred. Check console.");
      console.error(_error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: 400 }}
    >
      <input
        name="name"
        placeholder="Your Name"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        name="email"
        placeholder="Your Email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <label>Start Time:</label>
      <DatePicker
        selected={startTime}
        onChange={(date) => setStartTime(date)}
        showTimeSelect
        dateFormat="Pp"
        placeholderText="Select start time"
      />

      <label>End Time:</label>
      <DatePicker
        selected={endTime}
        onChange={(date) => setEndTime(date)}
        showTimeSelect
        dateFormat="Pp"
        placeholderText="Select end time"
      />

      <button
        type="submit"
        disabled={loading}
        style={{
          backgroundColor: loading ? "#6666" : "#000",
          color: "#fff",
          padding: "10px 15px",
          border: "none",
          borderRadius: "6px",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Booking..." : "Book Now"}
      </button>
    </form>
  );
}