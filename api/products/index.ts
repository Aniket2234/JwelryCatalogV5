import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getDatabase } from "../_lib/mongodb.js";
import { MongoStorage } from "../_lib/storage.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const db = await getDatabase();
    const storage = new MongoStorage(db);

    if (req.method === "GET") {
      const category = req.query.category as string | undefined;
      const products = await storage.getProducts(category);
      return res.status(200).json(products);
    }

    if (req.method === "POST") {
      const product = await storage.createProduct(req.body);
      return res.status(201).json(product);
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (error: any) {
    console.error("Error in /api/products:", error);
    return res.status(500).json({ message: error.message || "Internal server error" });
  }
}
