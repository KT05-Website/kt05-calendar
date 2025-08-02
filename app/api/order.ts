// app/api/order.ts

import { NextResponse } from "next/server";

interface Order {
  id: string;
  item: string;
  quantity: number;
}

const orderCache: Order[] = []; // use const instead of let

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, item, quantity } = body as Order; // properly type the body

    if (!id || !item || !quantity) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Save order in cache
    orderCache.push({ id, item, quantity });

    return NextResponse.json({ success: true, orders: orderCache });
  } catch (err) {
    // Use error variable properly
    console.error("Error processing order:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}