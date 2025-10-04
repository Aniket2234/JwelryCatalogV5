import { MongoClient, Db } from "mongodb";

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function getDatabase(): Promise<Db> {
  if (cachedDb && cachedClient) {
    return cachedDb;
  }

  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    throw new Error(
      "MONGODB_URI environment variable is not set"
    );
  }

  try {
    cachedClient = new MongoClient(mongoUri);
    await cachedClient.connect();
    
    const dbName = process.env.MONGODB_DB || mongoUri.split('/').pop()?.split('?')[0] || 'jewelry_catalog';
    cachedDb = cachedClient.db(dbName);
    
    // Create indexes on first connection
    await createIndexes(cachedDb);
    
    return cachedDb;
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw error;
  }
}

let indexesCreated = false;

async function createIndexes(database: Db) {
  if (indexesCreated) return;
  
  try {
    await database.collection("products").createIndex({ category: 1 });
    await database.collection("products").createIndex({ featured: 1 });
    await database.collection("products").createIndex({ displayOrder: 1 });
    await database.collection("categories").createIndex({ slug: 1 }, { unique: true });
    await database.collection("categories").createIndex({ displayOrder: 1 });
    await database.collection("carousel_images").createIndex({ displayOrder: 1 });
    await database.collection("carousel_images").createIndex({ active: 1 });
    
    indexesCreated = true;
  } catch (error) {
    console.error("Error creating indexes:", error);
  }
}
