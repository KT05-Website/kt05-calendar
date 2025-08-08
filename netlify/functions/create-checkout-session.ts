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
    // ---- Basic env sanity (helps catch misconfig early) ----
    if (!process.env.NEXT_PUBLIC_BASE_URL) {
      throw new Error("NEXT_PUBLIC_BASE_URL is not set");
    }
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }

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

    // ---- Price ID selection ----
    let priceId = "";
    if (packageOption === "Custom Pro") {
      priceId = process.env.STRIPE_PRICE_CUSTOM_PRO || "";
    } else if (packageOption === "Custom Plus") {
      priceId = process.env.STRIPE_PRICE_CUSTOM_PLUS || "";
    } else {
      priceId = process.env.STRIPE_PRICE_CUSTOM || "";
    }
    if (!priceId) {
      return {
        statusCode: 500,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: "Price ID not configured in env" }),
      };
    }

    // ---- Prepare safe metadata (Stripe limits: values ≤ 500 chars) ----
    const cleanDesc = (typeof description === "string" ? description : "")
      .slice(0, 500);

    const imageArray: string[] = Array.isArray(images)
      ? images.filter((u: any) => typeof u === "string" && /^https?:\/\//i.test(u))
      : [];

    // Join and trim to 500 chars; Keep first ~10 URLs to be safe
    const imagesJoined = imageArray.slice(0, 10).join(", ").slice(0, 500);

    // ---- Create Checkout Session ----
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],

      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,

      // Prefill / collect contact
      customer_email: contact?.email || undefined,
      customer_creation: "if_required",
      phone_number_collection: { enabled: true },

      metadata: {
        sneaker: (sneaker ?? "").toString().slice(0, 500),
        packageOption: (packageOption ?? "").toString().slice(0, 500),
        shoeSize: (shoeSize ?? "").toString().slice(0, 500),
        laceColor: (laceColor ?? "").toString().slice(0, 500),
        description: cleanDesc,
        images: imagesJoined,
        contact_name: (contact?.name ?? "").toString().slice(0, 500),
        contact_email: (contact?.email ?? "").toString().slice(0, 500),
        contact_phone: (contact?.phone ?? "").toString().slice(0, 500),
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
    console.error("❌ Stripe Checkout Error:", error?.message || error);
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({
        error: "Failed to create checkout session",
        details: error?.message || String(error),
      }),
    };
  }
}