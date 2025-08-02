import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-07-30.basil",
})

export async function POST(req: Request) {
  try {
    const {
      sneaker,
      packageOption,
      shoeSize,
      laceColor,
      description,
      images,
      contact,
    } = await req.json()

    // Choose correct Stripe Price ID based on package option
    let priceId = ""
    if (packageOption === "Custom Pro") {
      priceId = process.env.STRIPE_PRICE_CUSTOM_PRO!
    } else if (packageOption === "Custom Plus") {
      priceId = process.env.STRIPE_PRICE_CUSTOM_PLUS!
    } else {
      priceId = process.env.STRIPE_PRICE_CUSTOM!
    }

    // Create Checkout Session with metadata
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
        images: images.join(", "), // store file names in comma-separated string
        contact_name: contact.name,
        contact_email: contact.email,
        contact_phone: contact.phone,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error("Error creating Stripe session:", err)
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    )
  }
}