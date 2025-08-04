import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export default async function sendEmail(orderData: any) {
  try {
    const msg = {
      to: process.env.NOTIFY_EMAIL as string, // Where you want to receive the order emails
      from: process.env.SENDGRID_FROM_EMAIL as string, // Your verified SendGrid sender email
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
    };

    await sgMail.send(msg);
    console.log("Order email sent successfully");
  } catch (error: any) {
    console.error("Failed to send email:", error.response?.body || error);
  }
}