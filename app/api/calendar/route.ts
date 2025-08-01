import { google } from "googleapis";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { summary, description, startTime, endTime } = body;

    // Authenticate using refresh token
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      "http://localhost:3000"
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN, // stored in .env.local
    });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    // Insert event into calendar
    await calendar.events.insert({
      calendarId: "primary", // or specific KT05 calendar ID
      requestBody: {
        summary,
        description,
        start: {
          dateTime: startTime,
          timeZone: "Europe/London",
        },
        end: {
          dateTime: endTime,
          timeZone: "Europe/London",
        },
      },
    });

    return new Response(
      JSON.stringify({ message: "Event created successfully!" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating Google Calendar event:", error);
    return new Response(
      JSON.stringify({ error: "Failed to create event" }),
      { status: 500 }
    );
  }
}