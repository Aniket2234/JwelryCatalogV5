import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getDatabase } from "../_lib/mongodb.js";
import { MongoStorage } from "../_lib/storage.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const db = await getDatabase();
    const storage = new MongoStorage(db);

    if (req.method === "GET") {
      const info = await storage.getShopInfo();
      return res.status(200).json(info);
    }

    if (req.method === "PATCH" || req.method === "PUT") {
      const info = await storage.updateShopInfo(req.body);
      return res.status(200).json(info);
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (error: any) {
    console.error("Error in /api/shop-info:", error);
    return res.status(500).json({ message: error.message || "Internal server error" });
  }
}
