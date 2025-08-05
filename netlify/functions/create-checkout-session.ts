import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2024-06-20",
});

export async function handler(event: any) {
    // Handle preflight (CORS) requests
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

        // Validate required field
        if (!packageOption) {
            return {
                statusCode: 400,
                headers: { "Access-Control-Allow-Origin": "*" },
                body: JSON.stringify({ error: "Missing package option" }),
            };
        }

        // Determine Stripe Price ID
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

        // Create Stripe Checkout Session
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