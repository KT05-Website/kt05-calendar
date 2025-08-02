import { NextResponse } from "next/server";
import { google } from "googleapis";

export async function POST(req: Request) {
  try {
    // Parse request body
    const body = await req.json();
    const { name, email, startTime, endTime } = body;

    // Validate required fields
    if (!name || !email || !startTime || !endTime) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Parse service account credentials from environment variable
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
      return NextResponse.json(
        { success: false, error: "Google service account not configured" },
        { status: 500 }
      );
    }

    const keyFile = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);

    // Authenticate with Google
    const auth = new google.auth.GoogleAuth({
      credentials: keyFile,
      scopes: ["https://www.googleapis.com/auth/calendar"],
    });

    const calendar = google.calendar({ version: "v3", auth });

    // Create calendar event
    const event = {
      summary: `Booking: ${name}`,
      description: `Email: ${email}`,
      start: { dateTime: startTime, timeZone: "Europe/London" },
      end: { dateTime: endTime, timeZone: "Europe/London" },
    };

    const response = await calendar.events.insert({
      calendarId: "primary",
      requestBody: event,
    });

    return NextResponse.json({
      success: true,
      eventLink: response.data.htmlLink,
    });
  } catch (err) {
    console.error("Error creating booking:", err);
    return NextResponse.json(
      { success: false, error: "Failed to create booking" },
      { status: 500 }
    );
  }
}