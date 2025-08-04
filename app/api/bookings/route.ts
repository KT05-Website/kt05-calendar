import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-07-30.basil",
});

export async function POST(req: Request) {
  try {
    // 1. Parse form data coming from Framer
    const {
      sneaker,
      packageOption,
      shoeSize,
      laceColor,
      description,
      images,
      contact,
    } = await req.json();

    // TEMP: Log raw data to check flow
    console.log("Received booking data:", {
      sneaker,
      packageOption,
      shoeSize,
      laceColor,
      description,
      images,
      contact,
    });

    // 2. (Skip Stripe for now in Step 1) — Just confirm we receive data
    return NextResponse.json(
      { success: true, message: "Data received successfully" },
      { status: 200 }
    );

    // --- Later in Step 2 we will uncomment this Stripe logic ---
    /*
    let priceId = "";
    if (packageOption === "Custom Pro") {
      priceId = process.env.STRIPE_PRICE_CUSTOM_PRO!;
    } else if (packageOption === "Custom Plus") {
      priceId = process.env.STRIPE_PRICE_CUSTOM_PLUS!;
    } else {
      priceId = process.env.STRIPE_PRICE_CUSTOM!;
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
      metadata: {
        sneaker,
        packageOption,
        shoeSize,
        laceColor,
        description,
        images: images?.join(", ") || "",
        contact_name: contact?.name || "",
        contact_email: contact?.email || "",
        contact_phone: contact?.phone || "",
      },
    });

    return NextResponse.json({ url: session.url }, { status: 200 });
    */
  } catch (err: any) {
    console.error("Error handling booking POST:", err);
    return NextResponse.json(
      { error: "Failed to handle booking" },
      { status: 500 }
    );
  }
}