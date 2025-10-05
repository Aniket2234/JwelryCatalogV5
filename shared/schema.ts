import { z } from "zod";

// Category Schema
export const categorySchema = z.object({
  _id: z.string(),
  name: z.string(),
  slug: z.string(),
  icon: z.string().optional(),
  imageUrl: z.string().optional(),
  displayOrder: z.number().default(0),
});

export const insertCategorySchema = categorySchema.omit({ _id: true });

export type Category = z.infer<typeof categorySchema>;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

// Product Schema
export const productSchema = z.object({
  _id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  originalPrice: z.number().optional(),
  imageUrl: z.string(),
  subImages: z.array(z.string()).default([]),
  category: z.string(),
  tags: z.array(z.string()).default([]),
  inStock: z.boolean().default(true),
  displayOrder: z.number().default(0),
  purity: z.string().optional(),
  weight: z.string().optional(),
  stone: z.string().optional(),
  gender: z.string().optional(),
  occasion: z.string().optional(),
  isNewArrival: z.boolean().default(false),
  isTrending: z.boolean().default(false),
  isExclusive: z.boolean().default(false),
});

export const insertProductSchema = productSchema.omit({ _id: true });

export type Product = z.infer<typeof productSchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;

// Carousel Image Schema
export const carouselImageSchema = z.object({
  _id: z.string(),
  imageUrl: z.string(),
  title: z.string(),
  subtitle: z.string().optional(),
  buttonText: z.string().optional(),
  buttonLink: z.string().optional(),
  displayOrder: z.number().default(0),
  active: z.boolean().default(true),
});

export const insertCarouselImageSchema = carouselImageSchema.omit({ _id: true });

export type CarouselImage = z.infer<typeof carouselImageSchema>;
export type InsertCarouselImage = z.infer<typeof insertCarouselImageSchema>;

// Shop Info Schema
export const shopInfoSchema = z.object({
  _id: z.string(),
  address: z.string(),
  phone: z.string(),
  email: z.string(),
  hours: z.string(),
  facebookUrl: z.string().optional(),
  instagramUrl: z.string().optional(),
  twitterUrl: z.string().optional(),
  pinterestUrl: z.string().optional(),
});

export const insertShopInfoSchema = shopInfoSchema.omit({ _id: true });

export type ShopInfo = z.infer<typeof shopInfoSchema>;
export type InsertShopInfo = z.infer<typeof insertShopInfoSchema>;

// User Schema (keeping for authentication if needed)
export const userSchema = z.object({
  _id: z.string(),
  username: z.string(),
  password: z.string(),
});

export const insertUserSchema = userSchema.omit({ _id: true });

export type User = z.infer<typeof userSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
