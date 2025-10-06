# Setup Instructions for Replit

## ✅ Configuration Complete

Your Jewellery catalog application has been successfully configured for Replit:

- ✅ All npm packages installed
- ✅ Development workflow configured on port 5000
- ✅ Vite server configured to work with Replit's proxy (`allowedHosts: true`)
- ✅ Deployment settings configured for production (autoscale)
- ✅ Server binds to the correct host (0.0.0.0:5000)

## 🚀 Quick Start

### Required: MongoDB Database Setup

The application needs a MongoDB database connection to run. Follow these steps:

#### Step 1: Get a MongoDB Connection String

**Option A: MongoDB Atlas (Recommended - Free Tier Available)**

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new cluster (M0 free tier is perfect)
4. Click "Connect" → "Connect your application"
5. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/Jewellery_catalog`)
6. Replace `<password>` with your actual password

**Option B: Other MongoDB Providers**
- Any MongoDB hosting service works
- Just get your connection string in this format:
  ```
  mongodb+srv://username:password@host.mongodb.net/database_name
  ```

#### Step 2: Add to Replit Secrets

1. Click **"Tools"** in the left sidebar (or the lock icon 🔒)
2. Click **"Secrets"**
3. Add a new secret:
   - **Key**: `MONGODB_URI`
   - **Value**: Your MongoDB connection string
4. Click **"Add Secret"**

#### Step 3: Start the Application

Once you've added the MongoDB URI secret:

1. Click the **"Run"** button at the top
2. The application will:
   - Connect to your MongoDB database
   - Create necessary indexes automatically
   - Start the development server on port 5000
3. Your Jewellery catalog will be available in the webview!

## 🗄️ Database Collections

The MongoDB database will store:
- **products**: Jewellery items with images, prices, descriptions
- **categories**: Necklaces, rings, earrings, bracelets, etc.
- **carousel_images**: Homepage slideshow images
- **shop_info**: Contact details, social media links, business hours
- **users**: User accounts (if needed)

## 📱 Features

Once running, you can:
- Browse the catalog at `/catalog`
- View product details with image galleries
- Filter by categories
- See live gold rates (IBJA integration)
- Access social media links (Instagram, WhatsApp, YouTube)
- Mobile-responsive design with hamburger menu

## 📝 Development Commands

- **Start dev server**: Already configured - just click "Run"
- **Build for production**: `npm run build`
- **Type checking**: `npm run check`

## 🌐 Publishing to Production

When you're ready to publish:

1. Make sure MongoDB URI is configured
2. Click the **"Deploy"** or **"Publish"** button in the top right
3. The app will automatically:
   - Build the frontend and backend
   - Deploy on autoscale (scales based on traffic)
   - Serve from production port
4. You'll get a public URL to share

## ❓ Troubleshooting

**If the app doesn't start:**
- ✅ Make sure you've added the `MONGODB_URI` secret
- ✅ Check that your MongoDB connection string is correct (no spaces, correct password)
- ✅ Try clicking "Stop" then "Run" again

**If changes don't appear:**
- The dev server has hot module reload - changes appear automatically
- Try refreshing the browser if needed
- Check the console for any errors

**If you see "MONGODB_URI environment variable is not set":**
- This means the MongoDB secret hasn't been configured yet
- Follow Step 2 above to add it to Replit Secrets

## 🎨 Customization

After setup, you can customize:
- **Social Media Links**: Update shop info with your Instagram, WhatsApp, YouTube
- **Google Reviews**: Update the Google Review URL in `client/src/pages/Welcome.tsx`
- **Products & Categories**: Add via API or directly in MongoDB
- **Theme Colors**: Modify `client/src/index.css` for custom colors

## 📖 More Information

See `replit.md` for detailed architecture information, features, and recent updates.
