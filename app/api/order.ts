import { NextResponse } from "next/server";

// Use const instead of let for variables never reassigned
const orderCache: Record<string, string> = {};

// Define a clear type instead of `any`
interface OrderRequestBody {
  productId: string;
  quantity: number;
}

export async function POST(req: Request) {
  try {
    const body: OrderRequestBody = await req.json();

    // Validate input
    if (!body.productId || body.quantity <= 0) {
      return NextResponse.json(
        { success: false, error: "Invalid product ID or quantity" },
        { status: 400 }
      );
    }

    // Simulate order creation
    const orderId = `order-${Date.now()}`;
    orderCache[orderId] = body.productId;

    return NextResponse.json({ success: true, orderId });
  } catch (_error) {
    console.error("Order API Error:", _error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}