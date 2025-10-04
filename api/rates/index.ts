import type { VercelRequest, VercelResponse } from "@vercel/node";
import { fetchIBJARates } from "../_lib/rates-scraper.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === "GET") {
      const rates = await fetchIBJARates();
      return res.status(200).json(rates);
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (error: any) {
    console.error("Error in /api/rates:", error);
    return res.status(500).json({ message: error.message || "Internal server error" });
  }
}
