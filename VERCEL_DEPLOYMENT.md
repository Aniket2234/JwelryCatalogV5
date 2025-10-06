# Vercel Deployment Guide

This project has been refactored for Vercel deployment with separate frontend (Vite) and backend (Express API) under serverless functions.

## Project Structure

```
Jewellery-catalog/
├── api/                          # Vercel Serverless API Functions
│   ├── _lib/                     # Shared API utilities
│   │   ├── mongodb.ts            # MongoDB connection (cached for serverless)
│   │   ├── storage.ts            # MongoDB storage operations
│   │   └── rates-scraper.ts      # Gold/silver rates scraper
│   ├── categories/
│   │   ├── index.ts              # GET/POST /api/categories
│   │   └── [slug].ts             # GET/PATCH /api/categories/:slug
│   ├── products/
│   │   ├── index.ts              # GET/POST /api/products
│   │   ├── [id].ts               # GET /api/products/:id
│   │   ├── new-arrivals.ts       # GET /api/products/new-arrivals
│   │   └── trending.ts           # GET /api/products/trending
│   ├── carousel/
│   │   └── index.ts              # GET /api/carousel
│   ├── shop-info/
│   │   └── index.ts              # GET/PATCH /api/shop-info
│   └── rates/
│       └── index.ts              # GET /api/rates
├── client/                       # Vite Frontend Application
│   ├── src/
│   │   ├── pages/                # Application pages
│   │   ├── components/           # React components
│   │   ├── lib/                  # Utilities (queryClient with API logging)
│   │   └── hooks/                # Custom React hooks
│   └── public/                   # Static assets
├── shared/                       # Shared TypeScript types/schemas
│   └── schema.ts                 # Data models and validation schemas
├── server/                       # Original Express server (for local dev)
├── vercel.json                   # Vercel configuration
├── package.json                  # Build scripts and dependencies
├── tsconfig.json                 # TypeScript configuration
└── .env.example                  # Environment variables template
```

## Key Features

### 1. Serverless API Functions
- Each API endpoint is a separate serverless function in the `/api` folder
- MongoDB connection is cached between function invocations for performance
- TypeScript files are automatically compiled by Vercel

### 2. API Logging
- All API calls are logged in the browser console with:
  - Request method and URL
  - Response status and timing (in milliseconds)
  - Success (✅) or failure (❌) indicators
  - Request body data for POST/PATCH/PUT requests

### 3. MongoDB Configuration
- Uses cached MongoDB client to reuse connections across serverless invocations
- Indexes are created automatically on first connection
- Supports both MongoDB Atlas and self-hosted MongoDB

## Deployment Steps

### 1. Prerequisites
- Vercel account (sign up at https://vercel.com)
- MongoDB database (MongoDB Atlas recommended)
- Vercel CLI installed: `npm i -g vercel`

### 2. Environment Variables

Set these in Vercel dashboard (Project Settings → Environment Variables):

```bash
# Required
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority

# Optional
MONGODB_DB=Jewellery_catalog
NODE_ENV=production
SCRAPE_CACHE_TTL=3600000
SESSION_SECRET=your-secure-random-secret-key
```

### 3. Deploy to Vercel

#### Option A: Using Vercel Dashboard (Recommended)
1. Go to https://vercel.com/new
2. Import your Git repository (GitHub, GitLab, or Bitbucket)
3. Configure environment variables
4. Click "Deploy"

#### Option B: Using Vercel CLI
```bash
# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Or deploy to preview
vercel
```

### 4. Verify Deployment

After deployment:
1. Open your Vercel URL
2. Open browser console (F12)
3. You should see API logs like:
   ```
   🔍 API GET /api/rates
   ✅ API GET /api/rates - 200 (250ms)
   ```

## Local Development

### Option 1: Using Original Express Server (Current)
```bash
npm run dev
```
This runs the original unified Express + Vite setup.

### Option 2: Using Vercel CLI (Simulates Production)
```bash
npm run dev:vercel
```
This runs Vercel's development server locally, simulating the production environment.

## Build Commands

```bash
# Build frontend only (for Vercel)
npm run build

# Build server only (for traditional deployment)
npm run build:server

# Check TypeScript types
npm run check
```

## Configuration Files

### vercel.json
Configures:
- Node.js 20.x runtime for API functions
- API routes under `/api/*`
- Static file serving from `/dist`
- CORS headers for API endpoints
- Memory and timeout limits for functions

### package.json Scripts
- `dev` - Start local development server (Express + Vite)
- `dev:vercel` - Start Vercel development server
- `build` - Build frontend for production (Vite)
- `vercel-build` - Vercel's build command
- `check` - TypeScript type checking

### tsconfig.json
Includes all folders: `client`, `server`, `api`, and `shared`

## API Endpoints

All endpoints are available at `/api/*`:

### Categories
- `GET /api/categories` - List all categories
- `POST /api/categories` - Create category
- `GET /api/categories/:slug` - Get category by slug
- `PATCH /api/categories/:slug` - Update category

### Products
- `GET /api/products` - List products (optional ?category= filter)
- `POST /api/products` - Create product
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/new-arrivals` - Get featured new arrivals
- `GET /api/products/trending` - Get trending products

### Other
- `GET /api/carousel` - Get carousel images
- `GET /api/shop-info` - Get shop information
- `PATCH /api/shop-info` - Update shop information
- `GET /api/rates` - Get live gold/silver rates from Moneycontrol

## API Logging Format

### Successful Request
```
🔍 API GET /api/categories
✅ API GET /api/categories - 200 (125ms)
```

### Failed Request
```
🚀 API POST /api/products { body: {...} }
❌ API POST /api/products - 400 (89ms)
```

### Mutation Request
```
🚀 API PATCH /api/categories/necklaces { body: {...} }
✅ API PATCH /api/categories/necklaces - 200 (234ms)
```

## Troubleshooting

### API Functions Not Working
1. Check Vercel function logs in dashboard
2. Verify MongoDB_URI is set correctly
3. Check MongoDB network access allows Vercel IPs

### Frontend Not Loading
1. Verify build completed successfully
2. Check browser console for errors
3. Ensure API endpoints are accessible

### MongoDB Connection Issues
1. Whitelist all IPs (0.0.0.0/0) in MongoDB Atlas
2. Verify connection string format
3. Check database user permissions

### Cold Start Performance
- First request may be slower (1-3 seconds) due to serverless cold start
- Cached MongoDB connection improves subsequent requests
- Consider upgrading to Vercel Pro for reduced cold starts

## Performance Optimization

1. **MongoDB Connection Caching**: Reduces connection time from ~2s to <100ms
2. **Hourly Rate Caching**: Gold/silver rates cached for 1 hour
3. **Static Asset Caching**: Vite build outputs optimized, cached assets
4. **Lazy Loading**: Components load on demand
5. **API Request Deduplication**: TanStack Query prevents duplicate requests

## Security Considerations

1. **Environment Variables**: Never commit `.env` to Git
2. **MongoDB Access**: Use strong passwords and IP whitelisting
3. **CORS Headers**: Configured in vercel.json
4. **API Validation**: All inputs validated with Zod schemas
5. **Session Security**: Use strong SESSION_SECRET in production

## Monitoring

### Vercel Dashboard
- View function invocations
- Monitor response times
- Check error rates
- Analyze bandwidth usage

### Browser Console
- All API requests logged with timing
- Success/failure status visible
- Request/response data available

## Cost Estimation

### Vercel Free Tier
- 100GB bandwidth/month
- 100 hours serverless function execution
- Unlimited API requests
- Perfect for small to medium traffic

### Vercel Pro ($20/month)
- 1TB bandwidth
- 1000 hours execution
- Faster cold starts
- Custom domains
- Better performance

## Next Steps

1. ✅ Deploy to Vercel
2. ✅ Configure environment variables
3. ✅ Test all API endpoints
4. ✅ Monitor logs and performance
5. 🔄 Set up custom domain (optional)
6. 🔄 Configure CI/CD (automatic with Git integration)
7. 🔄 Add monitoring/analytics (optional)

## Support

For issues or questions:
1. Check Vercel documentation: https://vercel.com/docs
2. Review MongoDB Atlas docs: https://docs.atlas.mongodb.com
3. Check browser console for API logs
4. Review Vercel function logs in dashboard
