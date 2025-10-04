import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getDatabase } from "../_lib/mongodb";
import { MongoStorage } from "../_lib/storage";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { id } = req.query;
    const db = await getDatabase();
    const storage = new MongoStorage(db);

    if (req.method === "GET") {
      const product = await storage.getProductById(id as string);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      return res.status(200).json(product);
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (error: any) {
    console.error("Error in /api/products/[id]:", error);
    return res.status(500).json({ message: error.message || "Internal server error" });
  }
}
