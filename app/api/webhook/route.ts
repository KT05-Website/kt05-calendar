import { NextResponse } from "next/server"
import Stripe from "stripe"
import sendEmail from "@/lib/sendEmail"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-07-30.basil",
})

export async function POST(req: Request) {
  try {
    // 1. Get raw body and signature
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

    // 2. Handle checkout.session.completed event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session

      // Parse metadata (we store JSON strings for structured data)
      let metadata: any = {}
      try {
        metadata = session.metadata ? JSON.parse(session.metadata.details || "{}") : {}
      } catch (err) {
        console.error("Failed to parse metadata:", err)
      }

      const emailData = {
        sneaker: metadata.sneaker || "Not provided",
        packageOption: metadata.packageOption || "Not provided",
        shoeSize: metadata.shoeSize || "Not provided",
        laceColor: metadata.laceColor || "Not provided",
        description: metadata.description || "No description provided",
        images: metadata.images || "No images attached",
        contact: {
          name: metadata.contact?.name || "Unknown",
          email: metadata.contact?.email || "Unknown",
          phone: metadata.contact?.phone || "Unknown",
        },
      }

      // 3. Send notification email
      await sendEmail(emailData)
    }

    return NextResponse.json({ received: true }, { status: 200 })
  } catch (error: any) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}