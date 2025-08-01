import type { NextApiRequest, NextApiResponse } from "next"

// Simple in-memory cache
let orderCache: Record<string, any> = {}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        try {
            const orderId = Date.now().toString() // simple unique ID
            orderCache[orderId] = req.body

            return res.status(200).json({ success: true, orderId })
        } catch {
            return res.status(500).json({ success: false, error: "Failed to save order" })
        }
    }

    if (req.method === "GET") {
        const { orderId } = req.query
        if (orderId && orderCache[orderId as string]) {
            return res.status(200).json(orderCache[orderId as string])
        } else {
            return res.status(404).json({ error: "Order not found" })
        }
    }

    return res.status(405).json({ error: "Method not allowed" })
}