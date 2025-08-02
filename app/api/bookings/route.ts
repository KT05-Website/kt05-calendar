import { NextResponse } from "next/server";
import { createCalendarEvent } from "@/lib/googleCalendar";

export async function POST(req: Request) {
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
  } catch (error) {
    console.error("Error creating calendar event:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}