export function customerConfirmationEmail(
  name: string,
  calendarLink: string,
  details: {
    sneaker: string;
    packageOption: string;
    shoeSize: string;
    laceColor: string;
    description: string;
  }
) {
  const { sneaker, packageOption, shoeSize, laceColor, description } = details;

  const html = `
    <h2>Thank you for your order, ${name}!</h2>
    <p>We’ve received your design request and will start preparing your custom sneakers.</p>
    <p>Next step: book your design consultation to finalise details.</p>
    <a href="${calendarLink}" target="_blank" style="display:inline-block;padding:10px 20px;background:#000;color:#fff;text-decoration:none;border-radius:5px;">
      Book Your Consultation
    </a>
    <hr>
    <h3>Order Summary</h3>
    <ul>
      <li><strong>Sneaker:</strong> ${sneaker}</li>
      <li><strong>Package:</strong> ${packageOption}</li>
      <li><strong>Shoe Size:</strong> ${shoeSize}</li>
      <li><strong>Lace Color:</strong> ${laceColor}</li>
    </ul>
    <p><strong>Description:</strong><br>${description}</p>
    <p style="margin-top:20px;font-size:14px;color:#555;">KT05 Custom Kicks</p>
  `;

  const text = `
Thank you for your order, ${name}!
We’ve received your design request and will start preparing your custom sneakers.

Next step: book your design consultation here:
${calendarLink}

Order Summary:
- Sneaker: ${sneaker}
- Package: ${packageOption}
- Shoe Size: ${shoeSize}
- Lace Color: ${laceColor}

Description:
${description}

KT05 Custom Kicks
  `;

  return { html, text };
}