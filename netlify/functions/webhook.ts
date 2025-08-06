import type { Handler } from "@netlify/functions";
import Stripe from "stripe";
import sgMail from "@sendgrid/mail";
import nodemailer from "nodemailer";
import { customerConfirmationEmail } from "../../lib/emails/customerConfirmation";
import { internalOrderNotificationEmail } from "../../lib/emails/internalOrderNotification";

// 👇 Disable automatic body parsing so Stripe signature works
export const config = {
  bodyParser: false,
};

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-07-30.basil",
});

async function sendViaGmailFallback(to: string, subject: string, text: string) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NOTIFY_EMAIL,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.NOTIFY_EMAIL,
      to,
      subject,
      text,
    });

    console.log(`📩 Gmail fallback email sent to ${to}`);
  } catch (gmailErr: any) {
    console.error(`🚨 Gmail fallback also failed for ${to}:`, gmailErr.message);
  }
}

async function sendEmailWithFallback(mailData: any) {
  try {
    await sgMail.send(mailData);
    console.log(`✅ Email sent to ${mailData.to}`);
  } catch (err: any) {
    console.error(`❌ SendGrid failed for ${mailData.to}:`, err.message);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await sgMail.send(mailData);
      console.log(`🔁 Retry success: Email sent to ${mailData.to}`);
    } catch (retryErr: any) {
      console.error(`⚠️ Retry failed for ${mailData.to}:`, retryErr.message);

      await sendViaGmailFallback(
        mailData.to,
        mailData.subject,
        mailData.text || "Plain text email fallback triggered."
      );
    }
  }
}

const handler: Handler = async (event) => {
  console.log("✅ Webhook function triggered");

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  const sig = event.headers["stripe-signature"];
  const rawBody = event.isBase64Encoded
    ? Buffer.from(event.body!, "base64")
    : Buffer.from(event.body!, "utf8");

  let stripeEvent;
  try {
    stripeEvent = stripe.webhooks.constructEvent(
      rawBody,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    console.log(`🔔 Webhook received: ${stripeEvent.type}`);
  } catch (err: any) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }

  try {
    if (stripeEvent.type === "checkout.session.completed") {
      const session = stripeEvent.data.object as Stripe.Checkout.Session;
      const metadata = session.metadata || {};
      console.log("📝 Metadata received:", metadata);

      const imageLinks = metadata.images
        ? metadata.images
            .split(",")
            .map((img: string) => `<a href="${img.trim()}" target="_blank">${img.trim()}</a>`)
            .join("<br>")
        : "No images provided";

      const internalEmail = internalOrderNotificationEmail(
        metadata.contact_name,
        metadata.contact_email,
        metadata.contact_phone,
        {
          sneaker: metadata.sneaker,
          packageOption: metadata.packageOption,
          shoeSize: metadata.shoeSize,
          laceColor: metadata.laceColor,
          description: metadata.description,
          images: imageLinks,
        }
      );

      await sendEmailWithFallback({
        to: "kt05.orders@gmail.com",
        from: process.env.SENDGRID_FROM_EMAIL!,
        subject: "New Custom Sneaker Order",
        html: internalEmail.html,
        text: internalEmail.text,
      });

      const customerEmail = customerConfirmationEmail(
        metadata.contact_name,
        process.env.CALENDAR_BOOKING_URL!,
        {
          sneaker: metadata.sneaker,
          packageOption: metadata.packageOption,
          shoeSize: metadata.shoeSize,
          laceColor: metadata.laceColor,
          description: metadata.description,
        }
      );

      await sendEmailWithFallback({
        to: metadata.contact_email,
        from: process.env.SENDGRID_FROM_EMAIL!,
        subject: "Your KT05 Custom Sneaker Order Confirmation",
        html: customerEmail.html,
        text: customerEmail.text,
      });
    }

    return { statusCode: 200, body: JSON.stringify({ received: true }) };
  } catch (error: any) {
    console.error("❌ Error handling webhook logic:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Webhook handler failed" }),
    };
  }
};

export { handler };