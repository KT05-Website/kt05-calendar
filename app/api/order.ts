/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */

import type { NextApiRequest, NextApiResponse } from "next";

// Simple in-memory cache for orders
let orderCache: any = {};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Debug endpoint to check if environment variables are set
  if (req.method === "GET") {
    return res.status(200).json({
      GOOGLE_CALENDAR_ID: process.env.GOOGLE_CALENDAR_ID ? "Set ✅" : "Not Found ❌",
      GOOGLE_SERVICE_ACCOUNT: process.env.GOOGLE_SERVICE_ACCOUNT ? "Set ✅" : "Not Found ❌",
    });
  }

  // Handle booking creation
  if (req.method === "POST") {
    const { name, email, startTime, endTime } = req.body;

    // Basic validation
    if (!name || !email || !startTime || !endTime) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }

    // Create a simple booking ID
    const bookingId = Date.now().toString();
    orderCache[bookingId] = { name, email, startTime, endTime };

    return res.status(200).json({
      success: true,
      eventLink: `/bookings/${bookingId}`
    });
  }

  return res.status(405).json({ success: false, error: "Method not allowed" });
}