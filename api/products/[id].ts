import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getDatabase } from "../_lib/mongodb.js";
import { MongoStorage } from "../_lib/storage.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { id } = req.query;
    console.log('🔍 [Vercel API] Received request for product ID:', id);
    console.log('🔍 [Vercel API] Request method:', req.method);
    console.log('🔍 [Vercel API] Full query params:', req.query);
    
    const db = await getDatabase();
    const storage = new MongoStorage(db);

    if (req.method === "GET") {
      console.log('✅ [Vercel API] Attempting to fetch product with ID:', id);
      const product = await storage.getProductById(id as string);
      
      if (!product) {
        console.error('❌ [Vercel API] Product not found for ID:', id);
        return res.status(404).json({ message: "Product not found" });
      }
      
      console.log('✅ [Vercel API] Product found:', product._id);
      return res.status(200).json(product);
    }

    console.warn('⚠️ [Vercel API] Method not allowed:', req.method);
    return res.status(405).json({ message: "Method not allowed" });
  } catch (error: any) {
    console.error("❌ [Vercel API] Error in /api/products/[id]:", error);
    console.error("❌ [Vercel API] Error stack:", error.stack);
    return res.status(500).json({ message: error.message || "Internal server error" });
  }
}
