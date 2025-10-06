import { MongoClient, Db, ObjectId } from "mongodb";

let client: MongoClient | null = null;
let db: Db | null = null;

export async function connectToMongoDB(): Promise<Db> {
  if (db) {
    return db;
  }

  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    throw new Error(
      "MONGODB_URI environment variable is not set. Please add it to your .env file."
    );
  }

  try {
    client = new MongoClient(mongoUri);
    await client.connect();
    
    // Extract database name from URI or use default
    const dbName = mongoUri.split('/').pop()?.split('?')[0] || 'Jewellery_catalog';
    db = client.db(dbName);
    
    console.log(`Connected to MongoDB database: ${dbName}`);
    
    // Create indexes for better query performance
    await createIndexes(db);
    
    return db;
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw error;
  }
}

async function createIndexes(database: Db) {
  try {
    // Products indexes
    await database.collection("products").createIndex({ category: 1 });
    await database.collection("products").createIndex({ isNewArrival: 1 });
    await database.collection("products").createIndex({ isTrending: 1 });
    await database.collection("products").createIndex({ isExclusive: 1 });
    await database.collection("products").createIndex({ displayOrder: 1 });
    
    // Categories indexes
    await database.collection("categories").createIndex({ slug: 1 }, { unique: true });
    await database.collection("categories").createIndex({ displayOrder: 1 });
    
    // Carousel images indexes
    await database.collection("carousel_images").createIndex({ displayOrder: 1 });
    await database.collection("carousel_images").createIndex({ active: 1 });
    
    console.log("MongoDB indexes created successfully");
  } catch (error) {
    console.error("Error creating indexes:", error);
  }
}

export function getDatabase(): Db {
  if (!db) {
    throw new Error("Database not connected. Call connectToMongoDB first.");
  }
  return db;
}

export async function closeConnection() {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log("MongoDB connection closed");
  }
}

// Utility to convert MongoDB ObjectId to string
export function objectIdToString(id: ObjectId | string): string {
  return id instanceof ObjectId ? id.toHexString() : id;
}

// Utility to convert string to MongoDB ObjectId
export function stringToObjectId(id: string): ObjectId {
  // Validate that the ID is a valid 24-character hex string
  if (!ObjectId.isValid(id)) {
    throw new Error(`Invalid ObjectId format: ${id}`);
  }
  return new ObjectId(id);
}
