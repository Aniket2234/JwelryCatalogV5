# Jewelry Catalog Application

## Overview

This is a modern jewelry catalog web application built with React and Express. The application displays a beautiful, elegant catalog of jewelry products with categories, featured items, and a carousel showcase. Users can browse different jewelry categories (necklaces, rings, earrings, bracelets, etc.), search for products, and view detailed product information. The application features a responsive design with a golden jewelry theme, smooth animations, and integrated social media connectivity.

## Recent Updates (October 2025)

### Latest Features (October 3, 2025 - Updated)

#### Back Button Navigation Fix
- **Browser History**: Back button now follows proper browser history navigation
- **User Experience**: Users can navigate back through viewed product pages instead of jumping to home
- **Implementation**: Changed from custom navigation to `window.history.back()` for native browser behavior

#### Enhanced Category Section Design
- **Golden Scrolling Lines**: Added slim (2px) animated golden lines at top and bottom of category section
- **Continuous Animation**: Top line scrolls left-to-right, bottom line scrolls right-to-left (3s loop)
- **Visual Appeal**: Gradient effect (transparent → yellow-600 → transparent) for elegant look

#### Stylish Section Titles
- **Gradient Effect**: "New Arrival" and "Trending Collection" titles now feature golden gradient
- **Color Scheme**: Yellow-600 → Amber-500 → Yellow-600 for premium appearance
- **Typography**: Larger font sizes (3xl/4xl) with drop shadow and wider letter spacing
- **Responsive**: Adapts to screen sizes with mobile and desktop variants

### Latest Features (October 3, 2025)

#### Google Review System
- **5-Star Rating Widget**: Added interactive star rating system on the Welcome page
- **Placement**: Located below the "Explore Catalog" button
- **Functionality**: Stars fill with yellow color on hover/click and redirect to Google Review page
- **Configuration Required**: Update the `googleReviewUrl` in `/client/src/pages/Welcome.tsx` with your actual Google Review link
  - Get your Google Place ID from Google Business Profile
  - Replace `YOUR_PLACE_ID` in the URL with your actual Place ID

#### Product Details Enhancements
- **Full Image Display**: Product images now fill the entire image box (changed from contain to cover)
- **Collapsible Details**: Product specifications accordion now uses single-select mode - only one detail section open at a time for better UX

#### WhatsApp Integration
- **Header Icon**: Added WhatsApp icon in header for quick customer contact
- **Phone Number**: Integrated +91 75072 19775 for direct WhatsApp chat
- **Consistent Links**: Updated all WhatsApp links throughout the app (Welcome, Header, SideDrawer)

#### UI/UX Improvements
- **Social Media Icons**: All social media icons now use authentic brand colors:
  - Instagram: Purple-pink-orange gradient
  - WhatsApp: Official green (#25D366)
  - YouTube: Red (#FF0000)
- **Curved Drawer Animation**: Hamburger menu opens with smooth curved animation effect using cubic-bezier easing
- **Product Sharing**: Enhanced sharing options with Instagram, Facebook, and WhatsApp integration

## Recent Updates (October 2025)

### Social Media Integration
- **Welcome Page**: Added Instagram, WhatsApp, and YouTube social media icons above the "Explore Catalog" button with glassmorphism design
- **Header**: Integrated WhatsApp quick-access icon in the navigation header for instant customer communication
- **Side Drawer Menu**: Added dedicated "Connect With Us" section with Instagram, WhatsApp, and YouTube icons with hover effects

### Enhanced Filter Design
- Redesigned filter bar with gradient backgrounds and modern styling
- Added visual checkmarks for selected filter options
- Implemented glow effects and smooth transitions for better user experience
- Improved accessibility with better color contrast and focus states

### Product Display Improvements
- **Auto-Scroll Feature**: New Arrival and Trending Collection sections now feature continuous slow auto-scroll
- Scroll automatically pauses on hover for better user interaction
- Infinite loop scrolling for seamless product browsing experience

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React 18 with TypeScript for type safety
- Vite as the build tool and development server
- Wouter for client-side routing (lightweight alternative to React Router)
- TanStack Query (React Query) for server state management and caching
- Framer Motion for animations and transitions
- Tailwind CSS for styling with shadcn/ui component library

**Design Decisions:**
- **Component-based UI**: Uses shadcn/ui (Radix UI primitives) for accessible, customizable components
- **Custom theming**: Golden jewelry theme with CSS custom properties for colors and fonts
- **Responsive layout**: Mobile-first approach with hamburger menu and side drawer navigation
- **State management**: TanStack Query handles all server state, eliminating need for global state management
- **File organization**: Components are modular with clear separation (pages, components, UI components)

### Backend Architecture

**Technology Stack:**
- Express.js with TypeScript
- MongoDB with native MongoDB driver for data persistence
- Zod for runtime validation and schema definition
- Drizzle ORM configuration (present but MongoDB is the active database)

**API Structure:**
- RESTful API endpoints under `/api` prefix
- Categories: CRUD operations for jewelry categories
- Products: CRUD operations with filtering by category
- Carousel: Manages homepage carousel images
- Shop Info: Store information and contact details
- User management: Basic user operations

**Design Decisions:**
- **Validation**: Zod schemas in shared directory ensure type safety between client and server
- **Error handling**: Centralized error responses with appropriate HTTP status codes
- **Logging**: Request/response logging middleware for API routes
- **Database abstraction**: Storage interface pattern allows for potential database swapping

### Data Storage

**Database Choice: MongoDB**
- Document-based storage fits the product catalog use case well
- Collections: products, categories, carouselImages, shopInfo, users
- Indexed fields for performance: category, slug, displayOrder, featured
- ObjectId used for primary keys, converted to strings for client consumption

**Schema Design:**
- Categories: name, slug (unique), icon, displayOrder
- Products: name, description, price, imageUrl, category reference, tags, featured flag, stock status
- CarouselImages: imageUrl, title, subtitle, button text/link, displayOrder, active flag
- ShopInfo: Contact details, social media links, business hours

**Why MongoDB over PostgreSQL:**
- Flexible schema suitable for varying product attributes
- Better fit for catalog data with nested structures
- Simpler deployment in Replit environment
- Note: Drizzle configuration exists for potential PostgreSQL migration

### External Dependencies

**UI Component Library:**
- @radix-ui/* components for accessible UI primitives (dialogs, dropdowns, popovers, etc.)
- shadcn/ui configuration for consistent component styling

**Database Service:**
- MongoDB Atlas or compatible MongoDB service (via MONGODB_URI environment variable)
- @neondatabase/serverless package present (suggests Neon Postgres as alternative)

**Third-party Services (configured in shop info):**
- Social media integrations: Facebook, Instagram, Pinterest
- Contact methods: Phone, email, physical address
- Google Fonts: Playfair Display, Poppins, Cormorant Garamond for typography
- **IBJA Rates Integration**: Live gold rates (24K & 22K per 10g) scraped from IBJA.co
  - Hourly caching with cache metadata (isCached, cacheAge)
  - Silver shows "Not Available" (IBJA doesn't publish silver rates)
  - Error fallback to cached data with proper cache status indication
  - Frontend displays cache age when serving stale data

**Development Tools:**
- Replit-specific plugins for development experience
- Vite plugins: error overlay, cartographer, dev banner
- TypeScript for type checking across the stack

**Build and Deployment:**
- Vite builds the frontend to `dist/public`
- esbuild bundles the backend to `dist/index.js`
- Environment variables: DATABASE_URL (Drizzle), MONGODB_URI (active database)

## Replit Environment Setup

### Initial Setup (Fresh Import)

**Date**: October 3, 2025

This project was successfully imported into Replit and configured for the Replit environment.

#### Setup Status
✅ Node.js 20 installed
✅ All npm dependencies installed  
✅ Workflow configured for port 5000 with webview output
✅ Vite dev server configured with `allowedHosts: true` for Replit proxy
✅ Server binds to `0.0.0.0:5000` (required for Replit)
✅ Deployment configuration set for autoscale
⚠️ **Action Required**: MongoDB URI needs to be configured (see below)

#### Required MongoDB Setup

This application requires a MongoDB database to store:
- Product catalog (jewelry items)
- Categories (necklaces, rings, earrings, etc.)
- Carousel images for homepage
- Shop information

**To set up MongoDB:**

1. **Option A - MongoDB Atlas (Recommended for production)**:
   - Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a new cluster (free tier available)
   - Get your connection string
   - Add it to Replit Secrets as `MONGODB_URI`

2. **Option B - Any MongoDB Provider**:
   - Use any MongoDB hosting service
   - Get your connection string (format: `mongodb+srv://username:password@cluster.mongodb.net/database_name`)
   - Add it to Replit Secrets as `MONGODB_URI`

**Adding to Replit Secrets:**
1. Click on "Tools" in the left sidebar
2. Click on "Secrets"
3. Add a new secret:
   - Key: `MONGODB_URI`
   - Value: Your MongoDB connection string
4. Save and restart the application

Once the MongoDB URI is set, the application will:
- Automatically connect to the database
- Create necessary indexes for performance
- Be ready to store and retrieve data

### Configuration Details
- **Workflow**: "Start application" runs `npm run dev` on port 5000
- **Deployment**: Configured for autoscale deployment with build and production start commands
- **Host Configuration**: 
  - Server listens on `0.0.0.0:5000` (required for Replit)
  - Vite dev server has `allowedHosts: true` (required for Replit's proxy)

### Required Secrets
- `MONGODB_URI`: MongoDB connection string (stored in Replit Secrets) - **MUST BE CONFIGURED**

### Development Commands
- `npm run dev`: Start development server (Express + Vite HMR)
- `npm run build`: Build for production
- `npm run start`: Run production server
- `npm run check`: TypeScript type checking
- `npm run db:push`: Push Drizzle schema to database (for PostgreSQL alternative)

### Key Features Configured for Replit
1. Single port (5000) serves both API and frontend
2. Vite middleware mode integrates with Express
3. HMR (Hot Module Replacement) works over websockets
4. Static assets served from Express in production
5. MongoDB connection with automatic index creation