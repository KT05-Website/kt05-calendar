/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */

import { NextResponse } from "next/server"

// Simple in-memory cache (temporary)
let orderCache: Record<string, any> = {}

// Debug endpoint to verify env variables
export async function GET() {
  return NextResponse.json({
    GOOGLE_CALENDAR_ID: process.env.GOOGLE_CALENDAR_ID ? "Set ✅" : "Not Found ❌",
    GOOGLE_SERVICE_ACCOUNT: process.env.GOOGLE_SERVICE_ACCOUNT ? "Set ✅" : "Not Found ❌",
  })
}

// Booking creation handler
export async function POST(req: Request) {
  try {
    const { name, email, startTime, endTime } = await req.json()

    // Basic validation
    if (!name || !email || !startTime || !endTime) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Simple booking ID
    const bookingId = Date.now().toString()
    orderCache[bookingId] = { name, email, startTime, endTime }

    return NextResponse.json({
      success: true,
      eventLink: `/bookings/${bookingId}`,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 })
  }
}