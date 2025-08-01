import { NextResponse } from "next/server";
import { google } from "googleapis";
import path from "path";
import { readFileSync } from "fs";

export async function POST(req: Request) {
  try {
    // Parse request body
    const body = await req.json();
    const { name, email, startTime, endTime } = body;

    // Validate input
    if (!name || !email || !startTime || !endTime) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Load service account key
    const keyPath = path.join(process.cwd(), "credentials/service-account-key.json");
    const keyFile = JSON.parse(readFileSync(keyPath, "utf8"));

    // Authenticate with Google
    const auth = new google.auth.GoogleAuth({
      credentials: keyFile,
      scopes: ["https://www.googleapis.com/auth/calendar"],
    });

    const calendar = google.calendar({ version: "v3", auth });

    // Calendar ID (from your Google Calendar)
    const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID;

    if (!CALENDAR_ID) {
      return NextResponse.json(
        { success: false, error: "Missing GOOGLE_CALENDAR_ID in environment variables" },
        { status: 500 }
      );
    }

    // Create event object
    const event = {
      summary: `Booking: ${name}`,
      description: `Booked by ${name} (${email})`,
      start: {
        dateTime: startTime,
        timeZone: "Europe/London",
      },
      end: {
        dateTime: endTime,
        timeZone: "Europe/London",
      },
    };

    // Insert event into Google Calendar
    const response = await calendar.events.insert({
      calendarId: CALENDAR_ID,
      requestBody: event,
    });

    // Respond with event link
    return NextResponse.json({
      success: true,
      eventLink: response.data.htmlLink,
    });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create event" },
      { status: 500 }
    );
  }
}