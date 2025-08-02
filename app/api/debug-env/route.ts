import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    serviceAccountExists: !!process.env.GOOGLE_SERVICE_ACCOUNT,
    calendarId: process.env.GOOGLE_CALENDAR_ID || null,
    // Uncomment below if you want to see the first part of the service account (for sanity check)
    // serviceAccountPreview: process.env.GOOGLE_SERVICE_ACCOUNT?.substring(0, 50)
  });
}