import { Db, ObjectId } from "mongodb";
import { getDatabase, objectIdToString, stringToObjectId } from "./mongodb";
import type {
  Category,
  InsertCategory,
  Product,
  InsertProduct,
  CarouselImage,
  InsertCarouselImage,
  ShopInfo,
  InsertShopInfo,
  User,
  InsertUser,
} from "@shared/schema";

export interface IStorage {
  // Category methods
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | null>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(slug: string, updates: Partial<InsertCategory>): Promise<Category>;

  // Product methods
  getProducts(category?: string): Promise<Product[]>;
  getProductById(id: string): Promise<Product | null>;
  createProduct(product: InsertProduct): Promise<Product>;
  getNewArrivals(): Promise<Product[]>;
  getTrendingProducts(): Promise<Product[]>;

  // Carousel methods
  getCarouselImages(): Promise<CarouselImage[]>;
  createCarouselImage(image: InsertCarouselImage): Promise<CarouselImage>;

  // Shop Info methods
  getShopInfo(): Promise<ShopInfo | null>;
  createOrUpdateShopInfo(info: InsertShopInfo): Promise<ShopInfo>;

  // User methods
  getUser(id: string): Promise<User | null>;
  getUserByUsername(username: string): Promise<User | null>;
  createUser(user: InsertUser): Promise<User>;
}

export class MongoDBStorage implements IStorage {
  private db: Db;

  constructor(database?: Db) {
    this.db = database || getDatabase();
  }

  // Category methods
  async getCategories(): Promise<Category[]> {
    const categories = await this.db
      .collection("categories")
      .find()
      .sort({ displayOrder: 1 })
      .toArray();

    return categories.map((cat) => ({
      ...cat,
      _id: objectIdToString(cat._id),
    })) as Category[];
  }

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    const category = await this.db.collection("categories").findOne({ slug });
    
    if (!category) return null;

    return {
      ...category,
      _id: objectIdToString(category._id),
    } as Category;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const result = await this.db.collection("categories").insertOne({
      ...category,
      displayOrder: category.displayOrder || 0,
    });

    return {
      ...category,
      _id: objectIdToString(result.insertedId),
    } as Category;
  }

  async updateCategory(slug: string, updates: Partial<InsertCategory>): Promise<Category> {
    const result = await this.db.collection("categories").findOneAndUpdate(
      { slug },
      { $set: updates },
      { returnDocument: "after" }
    );

    if (!result) {
      throw new Error("Category not found");
    }

    return {
      ...result,
      _id: objectIdToString(result._id),
    } as Category;
  }

  // Product methods
  async getProducts(category?: string): Promise<Product[]> {
    const filter = category && category !== "all" ? { category } : {};
    
    const products = await this.db
      .collection("products")
      .find(filter)
      .sort({ displayOrder: 1 })
      .toArray();

    return products.map((prod) => ({
      ...prod,
      _id: objectIdToString(prod._id),
    })) as Product[];
  }

  async getProductById(id: string): Promise<Product | null> {
    const product = await this.db
      .collection("products")
      .findOne({ _id: stringToObjectId(id) });

    if (!product) return null;

    return {
      ...product,
      _id: objectIdToString(product._id),
    } as Product;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const result = await this.db.collection("products").insertOne({
      ...product,
      tags: product.tags || [],
      featured: product.featured || false,
      inStock: product.inStock !== false,
      displayOrder: product.displayOrder || 0,
      isNewArrival: product.isNewArrival || false,
      isNewTrend: product.isNewTrend || false,
    });

    return {
      ...product,
      _id: objectIdToString(result.insertedId),
    } as Product;
  }

  async getNewArrivals(): Promise<Product[]> {
    const products = await this.db
      .collection("products")
      .find({ isNewArrival: true, inStock: true })
      .sort({ displayOrder: 1 })
      .limit(10)
      .toArray();

    return products.map((prod) => ({
      ...prod,
      _id: objectIdToString(prod._id),
    })) as Product[];
  }

  async getTrendingProducts(): Promise<Product[]> {
    const products = await this.db
      .collection("products")
      .find({ isNewTrend: true, inStock: true })
      .sort({ displayOrder: 1 })
      .limit(10)
      .toArray();

    return products.map((prod) => ({
      ...prod,
      _id: objectIdToString(prod._id),
    })) as Product[];
  }

  // Carousel methods
  async getCarouselImages(): Promise<CarouselImage[]> {
    const images = await this.db
      .collection("carousel_images")
      .find({ active: true })
      .sort({ displayOrder: 1 })
      .toArray();

    return images.map((img) => ({
      ...img,
      _id: objectIdToString(img._id),
    })) as CarouselImage[];
  }

  async createCarouselImage(image: InsertCarouselImage): Promise<CarouselImage> {
    const result = await this.db.collection("carousel_images").insertOne({
      ...image,
      displayOrder: image.displayOrder || 0,
      active: image.active !== false,
    });

    return {
      ...image,
      _id: objectIdToString(result.insertedId),
    } as CarouselImage;
  }

  // Shop Info methods
  async getShopInfo(): Promise<ShopInfo | null> {
    const info = await this.db.collection("shop_info").findOne({});

    if (!info) return null;

    return {
      ...info,
      _id: objectIdToString(info._id),
    } as ShopInfo;
  }

  async createOrUpdateShopInfo(info: InsertShopInfo): Promise<ShopInfo> {
    const existing = await this.db.collection("shop_info").findOne({});

    if (existing) {
      await this.db.collection("shop_info").updateOne(
        { _id: existing._id },
        { $set: info }
      );

      return {
        ...info,
        _id: objectIdToString(existing._id),
      } as ShopInfo;
    } else {
      const result = await this.db.collection("shop_info").insertOne(info);

      return {
        ...info,
        _id: objectIdToString(result.insertedId),
      } as ShopInfo;
    }
  }

  // User methods
  async getUser(id: string): Promise<User | null> {
    const user = await this.db
      .collection("users")
      .findOne({ _id: stringToObjectId(id) });

    if (!user) return null;

    return {
      ...user,
      _id: objectIdToString(user._id),
    } as User;
  }

  async getUserByUsername(username: string): Promise<User | null> {
    const user = await this.db.collection("users").findOne({ username });

    if (!user) return null;

    return {
      ...user,
      _id: objectIdToString(user._id),
    } as User;
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await this.db.collection("users").insertOne(user);

    return {
      ...user,
      _id: objectIdToString(result.insertedId),
    } as User;
  }
}

let storageInstance: MongoDBStorage | null = null;

export function getStorage(): MongoDBStorage {
  if (!storageInstance) {
    storageInstance = new MongoDBStorage();
  }
  return storageInstance;
}
