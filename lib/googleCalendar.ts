import { google } from "googleapis";

export async function createCalendarEvent({
  summary,
  description,
  start,
  end,
}: {
  summary: string;
  description: string;
  start: string;
  end: string;
}) {
  // Check required environment variables
  if (!process.env.GOOGLE_SERVICE_ACCOUNT || !process.env.GOOGLE_CALENDAR_ID) {
    throw new Error("Google Calendar environment variables missing");
  }

  // Parse service account JSON from env
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);
  const calendarId = process.env.GOOGLE_CALENDAR_ID;

  // Authenticate with Google
  const auth = new google.auth.JWT(
    credentials.client_email,
    undefined,
    credentials.private_key,
    ["https://www.googleapis.com/auth/calendar"],
    undefined
  );

  const calendar = google.calendar({ version: "v3", auth });

  // Insert the event into Google Calendar
  const event = await calendar.events.insert({
    calendarId,
    requestBody: {
      summary,
      description,
      start: { dateTime: start, timeZone: "Europe/London" },
      end: { dateTime: end, timeZone: "Europe/London" },
    },
  });

  return event.data;
}