/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */

import { NextRequest, NextResponse } from "next/server";
import { createCalendarEvent } from "@/lib/googleCalendar";

export async function POST(req: NextRequest) {
  try {
    const { name, email, startTime, endTime } = await req.json();

    // Validate fields
    if (!name || !email || !startTime || !endTime) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create event in Google Calendar
    const event = await createCalendarEvent({
      summary: `Booking for ${name}`,
      description: `Email: ${email}`,
      start: startTime,
      end: endTime,
    });

    return NextResponse.json({
      success: true,
      eventLink: event.htmlLink,
    });
  } catch (error: any) {
    console.error("Error creating calendar event:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}