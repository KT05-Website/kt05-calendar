export function internalOrderNotificationEmail(
  name: string,
  email: string,
  phone: string,
  details: {
    sneaker: string;
    packageOption: string;
    shoeSize: string;
    laceColor: string;
    description: string;
    images: string;
  }
) {
  const { sneaker, packageOption, shoeSize, laceColor, description, images } =
    details;

  const html = `
    <h2>New Order Received</h2>
    <p>You’ve got a new booking from <strong>${name}</strong>.</p>
    <hr>
    <h3>Customer Details</h3>
    <ul>
      <li><strong>Name:</strong> ${name}</li>
      <li><strong>Email:</strong> ${email}</li>
      <li><strong>Phone:</strong> ${phone}</li>
    </ul>
    <hr>
    <h3>Order Details</h3>
    <ul>
      <li><strong>Sneaker:</strong> ${sneaker}</li>
      <li><strong>Package:</strong> ${packageOption}</li>
      <li><strong>Shoe Size:</strong> ${shoeSize}</li>
      <li><strong>Lace Color:</strong> ${laceColor}</li>
    </ul>
    <p><strong>Description:</strong><br>${description}</p>
    ${
      images
        ? `<hr><h3>Reference Images</h3><p>${images}</p>`
        : "<p>No reference images provided.</p>"
    }
    <p style="margin-top:20px;font-size:14px;color:#555;">
    This order has also been saved in Stripe. Check the dashboard for payment confirmation.
    </p>
  `;

  const text = `
New order received from ${name}.

Customer Details:
- Name: ${name}
- Email: ${email}
- Phone: ${phone}

Order Details:
- Sneaker: ${sneaker}
- Package: ${packageOption}
- Shoe Size: ${shoeSize}
- Lace Color: ${laceColor}

Description:
${description}

Images:
${images || "No images provided"}

Check Stripe Dashboard for payment confirmation.
  `;

  return { html, text };
}