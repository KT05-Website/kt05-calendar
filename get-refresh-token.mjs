import { google } from "googleapis";
import readline from "readline";
import dotenv from "dotenv";

// Force load .env.local
dotenv.config({ path: '.env.local' });

const SCOPES = ["https://www.googleapis.com/auth/calendar"];

// Debugging: log env variables (safe check)
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.error("❌ Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET. Check .env.local");
  process.exit(1);
}

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.NEXTAUTH_URL // Must match Google Console redirect URI
);

// 1. Generate the auth URL
const authUrl = oAuth2Client.generateAuthUrl({
  access_type: "offline",
  prompt: "consent",
  scope: SCOPES,
});

console.log("Authorize this app by visiting this URL:\n", authUrl);

// 2. Get code from user
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Enter the code from the page: ", async (code) => {
  try {
    const { tokens } = await oAuth2Client.getToken(code);
    console.log("\nYour Refresh Token is:\n", tokens.refresh_token);
    rl.close();
  } catch (err) {
    console.error("Error retrieving access token", err);
    rl.close();
  }
});