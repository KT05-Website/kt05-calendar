/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */

import type { NextApiRequest, NextApiResponse } from "next";

// Simple in-memory cache for orders
let orderCache: any = {};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
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