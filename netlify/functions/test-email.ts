import sgMail from "@sendgrid/mail";
import nodemailer from "nodemailer";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

/**
 * Gmail fallback
 */
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

    return `📩 Gmail fallback email sent to ${to}`;
  } catch (gmailErr: any) {
    return `🚨 Gmail fallback also failed: ${gmailErr.message}`;
  }
}

/**
 * Test email endpoint
 */
export async function handler() {
  const to = "kt05.orders@gmail.com"; // Internal test recipient

  try {
    // Attempt SendGrid first
    await sgMail.send({
      to,
      from: process.env.SENDGRID_FROM_EMAIL!,
      subject: "Test Email from Netlify",
      text: "This is a plain text test email via SendGrid → fallback Gmail if failed.",
      html: `<p>This is a <strong>test email</strong> via SendGrid → fallback Gmail if failed.</p>`,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: `✅ SendGrid test email sent to ${to}` }),
    };
  } catch (err: any) {
    console.error(`SendGrid failed: ${err.message}`);

    // Gmail fallback
    const fallbackResult = await sendViaGmailFallback(
      to,
      "Test Email via Gmail Fallback",
      "SendGrid failed — this is Gmail fallback"
    );

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: `SendGrid failed, fallback result: ${fallbackResult}`,
      }),
    };
  }
}