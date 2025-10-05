import { Db, ObjectId } from "mongodb";

export function objectIdToString(id: ObjectId | string): string {
  return id instanceof ObjectId ? id.toHexString() : id;
}

export function stringToObjectId(id: string): ObjectId {
  if (!ObjectId.isValid(id)) {
    throw new Error(`Invalid ObjectId format: ${id}`);
  }
  return new ObjectId(id);
}

export class MongoStorage {
  constructor(private db: Db) {}

  async getCategories() {
    const categories = await this.db
      .collection("categories")
      .find()
      .sort({ displayOrder: 1 })
      .toArray();
    return categories.map((cat) => ({
      ...cat,
      _id: objectIdToString(cat._id),
    }));
  }

  async getCategoryBySlug(slug: string) {
    const category = await this.db.collection("categories").findOne({ slug });
    if (!category) return null;
    return {
      ...category,
      _id: objectIdToString(category._id),
    };
  }

  async createCategory(data: any) {
    const result = await this.db.collection("categories").insertOne(data);
    const category = await this.db
      .collection("categories")
      .findOne({ _id: result.insertedId });
    return {
      ...category,
      _id: objectIdToString(category!._id),
    };
  }

  async updateCategory(slug: string, data: any) {
    const result = await this.db
      .collection("categories")
      .findOneAndUpdate({ slug }, { $set: data }, { returnDocument: "after" });
    if (!result) {
      throw new Error("Category not found");
    }
    return {
      ...result,
      _id: objectIdToString(result._id),
    };
  }

  async getProducts(category?: string) {
    const query = category ? { category } : {};
    const products = await this.db
      .collection("products")
      .find(query)
      .sort({ displayOrder: 1 })
      .toArray();
    return products.map((prod) => ({
      ...prod,
      _id: objectIdToString(prod._id),
    }));
  }

  async getProductById(id: string) {
    const product = await this.db
      .collection("products")
      .findOne({ _id: stringToObjectId(id) });
    if (!product) return null;
    return {
      ...product,
      _id: objectIdToString(product._id),
    };
  }

  async getNewArrivals() {
    const products = await this.db
      .collection("products")
      .find({ featured: true })
      .sort({ displayOrder: 1 })
      .limit(10)
      .toArray();
    return products.map((prod) => ({
      ...prod,
      _id: objectIdToString(prod._id),
    }));
  }

  async getTrendingProducts() {
    const products = await this.db
      .collection("products")
      .find({ featured: true })
      .sort({ displayOrder: -1 })
      .limit(10)
      .toArray();
    return products.map((prod) => ({
      ...prod,
      _id: objectIdToString(prod._id),
    }));
  }

  async getExclusiveProducts() {
    const products = await this.db
      .collection("products")
      .find({ isExclusive: true, inStock: true })
      .sort({ displayOrder: 1 })
      .limit(10)
      .toArray();
    return products
      .filter((prod) => prod._id instanceof ObjectId)
      .map((prod) => ({
        ...prod,
        _id: objectIdToString(prod._id),
      }));
  }

  async createProduct(data: any) {
    const result = await this.db.collection("products").insertOne(data);
    const product = await this.db
      .collection("products")
      .findOne({ _id: result.insertedId });
    return {
      ...product,
      _id: objectIdToString(product!._id),
    };
  }

  async getCarouselImages() {
    const images = await this.db
      .collection("carousel_images")
      .find({ active: true })
      .sort({ displayOrder: 1 })
      .toArray();
    return images.map((img) => ({
      ...img,
      _id: objectIdToString(img._id),
    }));
  }

  async getShopInfo() {
    const info = await this.db.collection("shop_info").findOne();
    if (!info) return null;
    return {
      ...info,
      _id: objectIdToString(info._id),
    };
  }

  async updateShopInfo(data: any) {
    const result = await this.db
      .collection("shop_info")
      .findOneAndUpdate({}, { $set: data }, { upsert: true, returnDocument: "after" });
    if (!result) {
      throw new Error("Shop info not found");
    }
    return {
      ...result,
      _id: objectIdToString(result._id),
    };
  }
}
