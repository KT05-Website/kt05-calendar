import { NextResponse } from "next/server";
import Stripe from "stripe";

// Initialize Stripe (not used yet in Step 1, but ready for later)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-07-30.basil",
});

export async function POST(req: Request) {
  try {
    // 1. Parse JSON body from Framer
    const data = await req.json();
    const {
      sneaker,
      packageOption,
      shoeSize,
      laceColor,
      description,
      images,
      contact,
    } = data;

    // 2. Log to confirm data flow
    console.log("---- API HIT ----");
    console.log("Received booking data:", data);

    // 3. Respond success (skip Stripe for now)
    return NextResponse.json(
      {
        success: true,
        message: "Booking data received successfully",
        received: {
          sneaker,
          packageOption,
          shoeSize,
          laceColor,
          description,
          images,
          contact,
        },
      },
      { status: 200 }
    );

    // --- Stripe checkout will be re-enabled in Step 2 ---
  } catch (err: any) {
    console.error("Error in /api/bookings:", err);
    return NextResponse.json(
      { error: "Failed to handle booking request" },
      { status: 500 }
    );
  }
}