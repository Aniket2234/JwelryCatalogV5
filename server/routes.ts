import type { Express } from "express";
import { createServer, type Server } from "http";
import { getStorage } from "./storage";
import { connectToMongoDB } from "./mongodb";
import {
  insertCategorySchema,
  insertProductSchema,
  insertCarouselImageSchema,
  insertShopInfoSchema,
} from "@shared/schema";
import { fetchIBJARates } from "./ibja-scraper";

export async function registerRoutes(app: Express): Promise<Server> {
  // Connect to MongoDB before registering routes
  try {
    await connectToMongoDB();
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw error;
  }

  // Categories endpoints
  app.get("/api/categories", async (_req, res) => {
    try {
      const categories = await getStorage().getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.get("/api/categories/:slug", async (req, res) => {
    try {
      const category = await getStorage().getCategoryBySlug(req.params.slug);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch category" });
    }
  });

  app.post("/api/categories", async (req, res) => {
    try {
      const validatedData = insertCategorySchema.parse(req.body);
      const category = await getStorage().createCategory(validatedData);
      res.status(201).json(category);
    } catch (error) {
      res.status(400).json({ message: "Invalid category data" });
    }
  });

  app.patch("/api/categories/:slug", async (req, res) => {
    try {
      const category = await getStorage().updateCategory(req.params.slug, req.body);
      res.json(category);
    } catch (error) {
      res.status(400).json({ message: "Failed to update category" });
    }
  });

  // Products endpoints
  app.get("/api/products", async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const products = await getStorage().getProducts(category);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  // Specific product routes must come before :id route
  app.get("/api/products/new-arrivals", async (_req, res) => {
    try {
      const products = await getStorage().getNewArrivals();
      res.json(products);
    } catch (error) {
      console.error("Error fetching new arrivals:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to fetch new arrivals" 
      });
    }
  });

  app.get("/api/products/trending", async (_req, res) => {
    try {
      const products = await getStorage().getTrendingProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching trending products:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to fetch trending products" 
      });
    }
  });

  app.get("/api/products/exclusive", async (_req, res) => {
    try {
      const products = await getStorage().getExclusiveProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching exclusive products:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to fetch exclusive products" 
      });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await getStorage().getProductById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch product";
      const statusCode = errorMessage.includes("Invalid ObjectId") ? 400 : 500;
      res.status(statusCode).json({ message: errorMessage });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await getStorage().createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ message: "Invalid product data" });
    }
  });

  // Carousel images endpoints
  app.get("/api/carousel", async (_req, res) => {
    try {
      const images = await getStorage().getCarouselImages();
      res.json(images);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch carousel images" });
    }
  });

  app.post("/api/carousel", async (req, res) => {
    try {
      const validatedData = insertCarouselImageSchema.parse(req.body);
      const image = await getStorage().createCarouselImage(validatedData);
      res.status(201).json(image);
    } catch (error) {
      res.status(400).json({ message: "Invalid carousel image data" });
    }
  });

  // Shop info endpoints
  app.get("/api/shop-info", async (_req, res) => {
    try {
      const info = await getStorage().getShopInfo();
      if (!info) {
        return res.status(404).json({ message: "Shop info not found" });
      }
      res.json(info);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch shop info" });
    }
  });

  app.post("/api/shop-info", async (req, res) => {
    try {
      const validatedData = insertShopInfoSchema.parse(req.body);
      const info = await getStorage().createOrUpdateShopInfo(validatedData);
      res.status(200).json(info);
    } catch (error) {
      res.status(400).json({ message: "Invalid shop info data" });
    }
  });

  // Migration endpoint to update existing products with new fields
  app.post("/api/migrate-products", async (_req, res) => {
    try {
      const { getDatabase } = await import('./mongodb');
      const db = getDatabase();
      
      // Get all products
      const products = await db.collection("products").find().toArray();
      
      // Update each product with the new fields if they don't exist
      const updates = products.map(async (product, index) => {
        // Assign isNewArrival, isTrending, and isExclusive based on position
        // First 5 products are new arrivals, next 5 are trending, next 5 are exclusive
        const isNewArrival = index < 5;
        const isTrending = index >= 5 && index < 10;
        const isExclusive = index >= 10 && index < 15;
        
        return db.collection("products").updateOne(
          { _id: product._id },
          { 
            $set: { 
              isNewArrival: product.isNewArrival !== undefined ? product.isNewArrival : isNewArrival,
              isTrending: product.isTrending !== undefined ? product.isTrending : isTrending,
              isExclusive: product.isExclusive !== undefined ? product.isExclusive : isExclusive
            } 
          }
        );
      });
      
      await Promise.all(updates);
      
      res.json({ 
        message: "Products migrated successfully", 
        updated: products.length 
      });
    } catch (error) {
      res.status(500).json({ message: "Migration failed", error: String(error) });
    }
  });

  // IBJA rates endpoint - public endpoint for live gold and silver rates
  app.get("/api/rates", async (req, res) => {
    try {
      // Force refresh if query parameter is set
      const forceRefresh = req.query.refresh === 'true';
      let rates;
      
      if (forceRefresh) {
        const { refreshRates } = await import('./ibja-scraper.js');
        rates = await refreshRates();
      } else {
        rates = await fetchIBJARates();
      }
      
      res.json(rates);
    } catch (error) {
      res.status(500).json({ 
        gold_24k: "Error", 
        gold_22k: "Error", 
        silver: "Error",
        message: "Failed to fetch rates" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
