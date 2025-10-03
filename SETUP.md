# Setup Instructions for Replit

## ✅ What's Already Done

Your jewelry catalog application has been successfully configured for Replit:

- ✅ All npm packages installed
- ✅ Development workflow configured on port 5000
- ✅ Vite server configured to work with Replit's proxy
- ✅ Deployment settings configured for production
- ✅ Server binds to the correct host (0.0.0.0)

## ⚠️ Required: MongoDB Database Setup

The application is ready to run but needs a MongoDB connection to store your jewelry catalog data.

### Step 1: Get a MongoDB Connection String

Choose one of these options:

#### Option A: MongoDB Atlas (Recommended - Free Tier Available)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new cluster (M0 free tier is perfect for this)
4. Click "Connect" → "Connect your application"
5. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/jewelry_catalog`)
6. Replace `<password>` with your actual password

#### Option B: Other MongoDB Providers

- Any MongoDB hosting service works
- Just get your connection string in this format:
  ```
  mongodb+srv://username:password@host.mongodb.net/database_name
  ```

### Step 2: Add to Replit Secrets

1. Click **"Tools"** in the left sidebar
2. Click **"Secrets"** 
3. Add a new secret:
   - **Key**: `MONGODB_URI`
   - **Value**: Your MongoDB connection string
4. Click **"Add Secret"**

### Step 3: Start the Application

Once you've added the MongoDB URI secret:

1. Click the **"Run"** button at the top
2. The application will:
   - Connect to your MongoDB database
   - Create necessary indexes automatically
   - Start the development server
3. Your jewelry catalog will be available in the webview!

## 🗄️ What Gets Stored in MongoDB

The database will store:
- **Products**: Jewelry items with images, prices, descriptions
- **Categories**: Necklaces, rings, earrings, bracelets, etc.
- **Carousel Images**: Homepage slideshow images
- **Shop Information**: Contact details, social media links, business hours

## 🚀 After Setup

Once running, you can:
- Browse the catalog at `/catalog`
- View product details
- Filter by categories
- See live gold rates (IBJA integration)
- Access social media links

## 📝 Development Commands

- **Start dev server**: `npm run dev` (runs automatically when you click Run)
- **Build for production**: `npm run build`
- **Type checking**: `npm run check`

## 🌐 Publishing to Production

When you're ready to publish:

1. Click the **"Publish"** button in the top right
2. The app will automatically build and deploy
3. You'll get a public URL to share

Your deployment is pre-configured to:
- Build the frontend and backend automatically
- Run on autoscale (scales based on traffic)
- Serve from the correct production port

## ❓ Troubleshooting

**If the app doesn't start:**
- Make sure you've added the `MONGODB_URI` secret
- Check that your MongoDB connection string is correct
- Try clicking "Stop" then "Run" again

**If changes don't appear:**
- The dev server has hot module reload - changes should appear automatically
- Try refreshing the browser if needed

## 📖 More Information

See `replit.md` for detailed architecture information and recent updates.
