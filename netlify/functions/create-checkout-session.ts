import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
});

export async function handler(event: any) {
  // CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
      body: "Preflight OK",
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const payload = JSON.parse(event.body || "{}");
    console.log("🔹 Incoming payload to create-checkout-session:", payload);

    const {
      sneaker,
      packageOption,
      shoeSize,
      laceColor,
      description,
      images,
      contact,
    } = payload;

    if (!packageOption) {
      return {
        statusCode: 400,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: "Missing package option" }),
      };
    }

    // Choose Price ID
    let priceId = "";
    if (packageOption === "Custom Pro") {
      priceId = process.env.STRIPE_PRICE_CUSTOM_PRO!;
    } else if (packageOption === "Custom Plus") {
      priceId = process.env.STRIPE_PRICE_CUSTOM_PLUS!;
    } else {
      priceId = process.env.STRIPE_PRICE_CUSTOM!;
    }

    if (!priceId) {
      return {
        statusCode: 500,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: "Price ID not configured in env" }),
      };
    }

    // ✅ Create Checkout Session (ensure email/phone captured)
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],

      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,

      // Prefill the email if your form collected it
      customer_email: contact?.email || undefined,

      // Ensure Checkout collects & stores details even if not prefilled
      customer_creation: "if_required",

      // Collect phone number too (optional; shows up in webhook)
      phone_number_collection: { enabled: true },

      // Your existing metadata (great to keep)
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
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
      body: JSON.stringify({ url: session.url }),
    };
  } catch (error: any) {
    console.error("❌ Stripe Checkout Error:", error.message || error);
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({
        error: "Failed to create checkout session",
        details: error.message || String(error),
      }),
    };
  }
}