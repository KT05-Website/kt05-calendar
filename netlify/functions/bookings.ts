import { Handler } from "@netlify/functions";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-07-30.basil",
});

export const handler: Handler = async (event) => {
  try {
    // 1. Parse incoming data
    const data = JSON.parse(event.body || "{}");

    const {
      sneaker,
      packageOption,
      shoeSize,
      laceColor,
      description,
      images,
      contact,
    } = data;

    // TEMP: Log raw data for debugging
    console.log("Booking data received:", data);

    // 2. (Step 1 test) Return confirmation
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "Data received successfully",
        received: {
          sneaker,
          packageOption,
          shoeSize,
          laceColor,
          description,
          images,
          contact,
        },
      }),
    };

    // --- Stripe logic will be re-enabled in Step 2 ---
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

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url }),
    };
    */
  } catch (err) {
    console.error("Error in bookings function:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to handle booking" }),
    };
  }
};