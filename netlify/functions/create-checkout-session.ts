import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2024-06-20",
})

// £100 expressed in pence
const SNEAKER_DEPOSIT_AMOUNT = 10000

const allowedPackages = ["Custom", "Signature"]

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
}

export async function handler(event: any) {
    // CORS preflight
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
        // Environment checks
        if (!process.env.NEXT_PUBLIC_BASE_URL) {
            throw new Error("NEXT_PUBLIC_BASE_URL is not set")
        }

        if (!process.env.STRIPE_SECRET_KEY) {
            throw new Error("STRIPE_SECRET_KEY is not set")
        }

        const payload = JSON.parse(event.body || "{}")

        console.log(
            "🔹 Incoming payload to create-checkout-session:",
            payload
        )

        const {
            sneaker,
            packageOption,
            shoeSize,
            laceColor,
            description,
            images,
            contact,
            depositType,
        } = payload

        // Validate package selection
        if (!packageOption) {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({
                    error: "Missing package option",
                }),
            }
        }

        // Prevent old or unexpected package values being submitted
        if (!allowedPackages.includes(packageOption)) {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({
                    error: "Invalid package option",
                }),
            }
        }

        // Validate essential form data
        if (!sneaker) {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({
                    error: "Missing sneaker selection",
                }),
            }
        }

        if (!shoeSize) {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({
                    error: "Missing shoe size",
                }),
            }
        }

        if (!contact?.email) {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({
                    error: "Missing customer email",
                }),
            }
        }

        // Stripe metadata values must remain at or below 500 characters
        const cleanDescription = (
            typeof description === "string" ? description : ""
        ).slice(0, 500)

        const imageArray: string[] = Array.isArray(images)
            ? images.filter(
                  (url: unknown) =>
                      typeof url === "string" &&
                      /^https?:\/\//i.test(url)
              )
            : []

        // Keep the combined image metadata within Stripe's 500-character limit
        const imagesJoined = imageArray
            .slice(0, 10)
            .join(", ")
            .slice(0, 500)

        // Create the £100 Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            mode: "payment",

            payment_method_types: ["card"],

            line_items: [
                {
                    price_data: {
                        currency: "gbp",

                        unit_amount: SNEAKER_DEPOSIT_AMOUNT,

                        product_data: {
                            name: "KT05 Sneaker Deposit",

                            description:
                                "£100 deposit towards your custom KT05 sneaker project. This amount is deducted from your final balance.",
                        },
                    },

                    quantity: 1,
                },
            ],

            success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,

            // Prefill the customer's email address
            customer_email: contact.email,

            customer_creation: "if_required",

            phone_number_collection: {
                enabled: true,
            },

            metadata: {
                depositType: (
                    depositType || "Sneaker Deposit"
                )
                    .toString()
                    .slice(0, 500),

                depositAmount: "£100",

                sneaker: (sneaker ?? "")
                    .toString()
                    .slice(0, 500),

                packageOption: (packageOption ?? "")
                    .toString()
                    .slice(0, 500),

                shoeSize: (shoeSize ?? "")
                    .toString()
                    .slice(0, 500),

                laceColor: (laceColor ?? "")
                    .toString()
                    .slice(0, 500),

                description: cleanDescription,

                images: imagesJoined,

                contact_name: (contact?.name ?? "")
                    .toString()
                    .slice(0, 500),

                contact_email: (contact?.email ?? "")
                    .toString()
                    .slice(0, 500),

                contact_phone: (contact?.phone ?? "")
                    .toString()
                    .slice(0, 500),
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
            "❌ Stripe Checkout Error:",
            error?.message || error
        )

        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({
                error: "Failed to create checkout session",
                details: error?.message || String(error),
            }),
        }
    }
}
