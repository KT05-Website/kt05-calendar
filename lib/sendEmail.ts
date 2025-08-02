import nodemailer from "nodemailer"
import { google } from "googleapis"

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET as string
const REFRESH_TOKEN = process.env.GOOGLE_SERVICE_ACCOUNT as string // Using service account token
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL as string

// Initialize OAuth2 client
const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET)
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })

export default async function sendEmail(orderData: any) {
  try {
    const accessToken = await oAuth2Client.getAccessToken()

    // Configure nodemailer transport with Gmail OAuth2
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: NOTIFY_EMAIL,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken?.token || "",
      },
    })

    // Email content
    const mailOptions = {
      from: `KT05 Orders <${NOTIFY_EMAIL}>`,
      to: NOTIFY_EMAIL,
      subject: `New Sneaker Deposit — ${orderData.packageOption}`,
      text: `
        Sneaker: ${orderData.sneaker}
        Package: ${orderData.packageOption}
        Shoe Size: ${orderData.shoeSize}
        Lace Color: ${orderData.laceColor}
        Description: ${orderData.description}
        Images: ${orderData.images}

        Contact Info:
        Name: ${orderData.contact.name}
        Email: ${orderData.contact.email}
        Phone: ${orderData.contact.phone}
      `,
    }

    await transport.sendMail(mailOptions)
    console.log("Order email sent successfully")
  } catch (error) {
    console.error("Failed to send email:", error)
  }
}