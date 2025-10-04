import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getDatabase } from "../_lib/mongodb.js";
import { MongoStorage } from "../_lib/storage.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { slug } = req.query;
    const db = await getDatabase();
    const storage = new MongoStorage(db);

    if (req.method === "GET") {
      const category = await storage.getCategoryBySlug(slug as string);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      return res.status(200).json(category);
    }

    if (req.method === "PATCH") {
      const category = await storage.updateCategory(slug as string, req.body);
      return res.status(200).json(category);
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (error: any) {
    console.error("Error in /api/categories/[slug]:", error);
    return res.status(500).json({ message: error.message || "Internal server error" });
  }
}
