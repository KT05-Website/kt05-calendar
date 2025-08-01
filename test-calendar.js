import { google } from "googleapis";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Fix __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load service account key
const KEYFILE_PATH = path.join(__dirname, "credentials", "service-account-key.json");

// Calendar ID (your KT05 Booking calendar)
const CALENDAR_ID = "b2f70806c7ac5cdc0f6e38fe39182ed9639f47f59f21c2dd0554c1f338dd2710@group.calendar.google.com";

async function addTestEvent() {
  try {
    // Authenticate using service account
    const auth = new google.auth.GoogleAuth({
      keyFile: KEYFILE_PATH,
      scopes: ["https://www.googleapis.com/auth/calendar"],
    });

    const calendar = google.calendar({ version: "v3", auth });

    // Create test event
    const event = {
      summary: "Test Booking",
      description: "Testing service account calendar booking",
      start: {
        dateTime: "2025-08-01T15:00:00+01:00",
        timeZone: "Europe/London",
      },
      end: {
        dateTime: "2025-08-01T16:00:00+01:00",
        timeZone: "Europe/London",
      },
    };

    const response = await calendar.events.insert({
      calendarId: CALENDAR_ID,
      resource: event,
    });

    console.log("Event created: ", response.data.htmlLink);
  } catch (error) {
    console.error("Error creating event:", error);
  }
}

addTestEvent();