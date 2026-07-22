import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2024-06-20",
})

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
}

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

        if (!process.env.STRIPE_PRICE_CLEANING) {
            throw new Error("STRIPE_PRICE_CLEANING is not set")
        }


        const payload = JSON.parse(event.body || "{}")

        console.log(
            "🔹 Incoming payload to create-cleaning-checkout-session:",
            payload
        )


        const {
            service,
            sneakerModel,
            material,
            cleaningNotes,
            images,
            contact,
            returnAddress,
            disclaimerAccepted,
        } = payload



        if (!sneakerModel) {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({
                    error: "Missing sneaker model",
                }),
            }
        }


        if (!material) {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({
                    error: "Missing sneaker material",
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


        const imageArray: string[] = Array.isArray(images)
            ? images.filter(
                  (url: unknown) =>
                      typeof url === "string" &&
                      /^https?:\/\//i.test(url)
              )
            : []


        const imagesJoined = imageArray
            .slice(0, 7)
            .join(", ")
            .slice(0, 500)



        const cleanNotes = (
            typeof cleaningNotes === "string"
                ? cleaningNotes
                : ""
        ).slice(0, 500)



        const addressLine1 = (
            returnAddress?.line1 ?? ""
        )
            .toString()
            .slice(0, 500)

        const addressLine2 = (
            returnAddress?.line2 ?? ""
        )
            .toString()
            .slice(0, 500)

        const addressCity = (
            returnAddress?.city ?? ""
        )
            .toString()
            .slice(0, 500)

        const addressCounty = (
            returnAddress?.county ?? ""
        )
            .toString()
            .slice(0, 500)

        const addressPostcode = (
            returnAddress?.postcode ?? ""
        )
            .toString()
            .slice(0, 500)

        const addressCountry = (
            returnAddress?.country ?? ""
        )
            .toString()
            .slice(0, 500)



        const session = await stripe.checkout.sessions.create({
            mode: "payment",

            payment_method_types: ["card"],

            line_items: [
                {
                    price: process.env.STRIPE_PRICE_CLEANING,
                    quantity: 1,
                },
            ],


            success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,


            customer_email: contact.email,


            customer_creation: "if_required",


            phone_number_collection: {
                enabled: true,
            },


            metadata: {

                orderType: "sneaker_cleaning",

                service: (
                    service || "Professional Sneaker Clean"
                )
                    .toString()
                    .slice(0,500),


                sneakerModel: sneakerModel
                    .toString()
                    .slice(0,500),


                material: material
                    .toString()
                    .slice(0,500),


                cleaningNotes: cleanNotes,


                images: imagesJoined,


                contact_name: (
                    contact?.name ?? ""
                )
                    .toString()
                    .slice(0,500),


                contact_email: (
                    contact?.email ?? ""
                )
                    .toString()
                    .slice(0,500),


                contact_phone: (
                    contact?.phone ?? ""
                )
                    .toString()
                    .slice(0,500),



                address_line1: addressLine1,

                address_line2: addressLine2,

                address_city: addressCity,

                address_county: addressCounty,

                address_postcode: addressPostcode,

                address_country: addressCountry,



                disclaimerAccepted:
                    disclaimerAccepted
                        ? "yes"
                        : "no",
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
            "❌ Cleaning Stripe Checkout Error:",
            error?.message || error
        )


        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({
                error: "Failed to create cleaning checkout session",
                details:
                    error?.message || String(error),
            }),
        }
    }
}
