import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2024-06-20",
})

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
}

// Maps the "product" key sent from the frontend to the
// matching Stripe Price ID environment variable.
const PRICE_ENV_MAP: Record<string, string | undefined> = {
    Signature_AF1: process.env.STRIPE_PRICE_SIGNATURE_AF1,
    Signature_AJ1: process.env.STRIPE_PRICE_SIGNATURE_AJ1,
    Custom_AF1: process.env.STRIPE_PRICE_CUSTOM_AF1,
    Custom_AJ1: process.env.STRIPE_PRICE_CUSTOM_AJ1,
}

const ALLOWED_PRODUCTS = Object.keys(PRICE_ENV_MAP)

export async function handler(event: any) {
    if (event.httpMethod === "OPTIONS") {
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: "Preflight OK",
        }
    }

    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            headers: corsHeaders,
            body: JSON.stringify({
                error: "Method not allowed",
            }),
        }
    }

    try {
        if (!process.env.NEXT_PUBLIC_BASE_URL) {
            throw new Error("NEXT_PUBLIC_BASE_URL is not set")
        }

        if (!process.env.STRIPE_SECRET_KEY) {
            throw new Error("STRIPE_SECRET_KEY is not set")
        }

        for (const key of ALLOWED_PRODUCTS) {
            if (!PRICE_ENV_MAP[key]) {
                throw new Error(
                    `Stripe Price env var is not set for product: ${key}`
                )
            }
        }

        const payload = JSON.parse(event.body || "{}")

        console.log(
            "🔹 Incoming payload to create-fullpayment-checkout-session:",
            payload
        )

        const { product, orderReference } = payload

        if (!product) {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({
                    error: "Missing product selection",
                }),
            }
        }

        if (!ALLOWED_PRODUCTS.includes(product)) {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({
                    error: "Invalid product selection",
                }),
            }
        }

        const priceId = PRICE_ENV_MAP[product]

        if (!priceId) {
            throw new Error(
                `Stripe Price ID is not configured for ${product}`
            )
        }

        const cleanOrderReference = (
            typeof orderReference === "string" ? orderReference : ""
        ).slice(0, 500)

        const session = await stripe.checkout.sessions.create({
            mode: "payment",

            payment_method_types: ["card"],

            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],

            success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,

            // No customer_email passed in — the customer enters
            // their own email directly on Stripe's Checkout page.
            customer_creation: "always",

            // Collects the customer's phone number on the
            // Stripe-hosted Checkout page.
            phone_number_collection: {
                enabled: true,
            },

            // Collects the customer's full name on the
            // Stripe-hosted Checkout page.
            custom_fields: [
                {
                    key: "full_name",
                    label: {
                        type: "custom",
                        custom: "Full Name",
                    },
                    type: "text",
                    optional: false,
                },
            ],

            metadata: {
                orderType: "full_payment",

                product: product.toString().slice(0, 500),

                orderReference: cleanOrderReference,
            },
        })

        if (!session.url) {
            throw new Error(
                "Stripe Checkout Session did not return a URL"
            )
        }

        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({
                url: session.url,
            }),
        }
    } catch (error: any) {
        console.error(
            "❌ Full Payment Stripe Checkout Error:",
            error?.message || error
        )

        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({
                error: "Failed to create full payment checkout session",
                details: error?.message || String(error),
            }),
        }
    }
}
