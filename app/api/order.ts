import type { NextApiRequest, NextApiResponse } from "next";

// In-memory order cache (not persistent, good for testing only)
const orderCache: Record<string, unknown> = {};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      // Generate unique order ID
      const orderId = Date.now().toString();

      // Save order data
      orderCache[orderId] = req.body;

      return res.status(200).json({
        success: true,
        orderId,
      });
    } catch (err) {
      console.error("Error saving order:", err);
      return res.status(500).json({
        success: false,
        error: "Failed to save order",
      });
    }
  }

  if (req.method === "GET") {
    const { orderId } = req.query;

    if (orderId && orderCache[orderId as string]) {
      return res.status(200).json(orderCache[orderId as string]);
    } else {
      return res.status(404).json({
        error: "Order not found",
      });
    }
  }

  // If method is neither POST nor GET
  return res.status(405).json({
    error: "Method not allowed",
  });
}