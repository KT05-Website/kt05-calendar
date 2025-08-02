import { google } from "googleapis";

// Hardcode your Calendar ID here
const CALENDAR_ID = "kt05.orders@gmail.com";

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
  if (!process.env.GOOGLE_SERVICE_ACCOUNT) {
    throw new Error("Google Service Account key missing");
  }

  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);

  // Authenticate using service account
  const auth = new google.auth.JWT(
    credentials.client_email,
    undefined,
    credentials.private_key,
    ["https://www.googleapis.com/auth/calendar"]
  );

  const calendar = google.calendar({ version: "v3", auth });

  // Insert event into Google Calendar
  const event = await calendar.events.insert({
    calendarId: CALENDAR_ID,
    requestBody: {
      summary,
      description,
      start: { dateTime: start, timeZone: "Europe/London" },
      end: { dateTime: end, timeZone: "Europe/London" },
    },
  });

  return event.data;
}