import { NextResponse } from "next/server"
import Stripe from "stripe"
import sendEmail from "@/lib/sendEmail"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-07-30.basil",
})

export async function POST(req: Request) {
  try {
    // Stripe signature verification
    const rawBody = await req.text()
    const sig = req.headers.get("stripe-signature") as string
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret)
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message)
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    // Handle checkout.session.completed
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session

      const m = session.metadata || {}

      const emailData = {
        sneaker: m.sneaker || "Not provided",
        packageOption: m.packageOption || "Not provided",
        shoeSize: m.shoeSize || "Not provided",
        laceColor: m.laceColor || "Not provided",
        description: m.description || "No description provided",
        images: m.images || "No images attached",
        contact: {
          name: m.contact_name || "Unknown",
          email: m.contact_email || "Unknown",
          phone: m.contact_phone || "Unknown",
        },
      }

      await sendEmail(emailData)
    }

    return NextResponse.json({ received: true }, { status: 200 })
  } catch (error: any) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}