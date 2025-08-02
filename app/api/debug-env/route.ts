import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  return NextResponse.json({
    serviceAccountExists: !!process.env.GOOGLE_SERVICE_ACCOUNT,
    // This is hardcoded now, so always visible:
    calendarId: "kt05.orders@gmail.com",
  });
}