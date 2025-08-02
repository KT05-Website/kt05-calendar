import { NextResponse } from "next/server";

type OrderCacheType = {
  [key: string]: unknown; // Adjust this type later if you know the structure
};

const orderCache: OrderCacheType = {};

export async function GET() {
  try {
    // Example logic: return cached orders or empty object
    return NextResponse.json({ success: true, data: orderCache });
  } catch (error: unknown) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body: unknown = await req.json();

    // If you know structure, replace `unknown` with proper type (e.g., { orderId: string; ... })
    orderCache["lastOrder"] = body;

    return NextResponse.json({ success: true, message: "Order saved" });
  } catch (error: unknown) {
    console.error("Error saving order:", error);
    return NextResponse.json({ success: false, error: "Failed to save order" }, { status: 500 });
  }
}