import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getDatabase } from "../_lib/mongodb";
import { MongoStorage } from "../_lib/storage";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const db = await getDatabase();
    const storage = new MongoStorage(db);

    if (req.method === "GET") {
      const images = await storage.getCarouselImages();
      return res.status(200).json(images);
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (error: any) {
    console.error("Error in /api/carousel:", error);
    return res.status(500).json({ message: error.message || "Internal server error" });
  }
}
