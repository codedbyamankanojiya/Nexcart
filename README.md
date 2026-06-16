# NexCart — Premium Multi-Vendor Marketplace

NexCart is a comprehensive, modern multi-vendor e-commerce platform featuring a cinematic dark-themed UI/UX, robust role-based access control, a seamless persistent shopping cart, and a mock billing/fulfillment workflow.

This repository is organized as a monorepo containing both the React client (`frontend`) and the Node.js Express server (`backend`).

---

## 📂 Project Structure & Architecture

```
PopKart/ (Root)
├── backend/                  # Node.js + Express API Server (JavaScript)
│   ├── src/
│   │   ├── config/           # Database configuration
│   │   │   └── db.js         # Mongoose MongoDB connection helper
│   │   ├── middleware/       # Custom middlewares (JWT auth, role checks, error handlers)
│   │   │   ├── auth.js       # Authenticates JWT & checks permissions
│   │   │   └── errorHandler.js # Centralized HTTP error response router
│   │   ├── models/           # Mongoose Schemas & Database Models
│   │   │   ├── Cart.js       # User shopping cart schema
│   │   │   ├── Category.js   # Category metadata & hierarchy schema
│   │   │   ├── Order.js      # Customer order invoice schema
│   │   │   ├── Product.js    # Seller products schema with rating stats & reviews count
│   │   │   ├── Review.js     # Product reviews and rating schema
│   │   │   └── User.js       # User accounts schema (CUSTOMER, SELLER, ADMIN)
│   │   ├── routes/           # Express sub-routers mounting API endpoints
│   │   │   ├── auth.js       # Signup, login, logout, and token check
│   │   │   ├── cart.js       # Add/remove items, sync cart
│   │   │   ├── categories.js # Category index & hierarchy tree endpoints
│   │   │   ├── orders.js     # Order placement, list, detail, and mock payments
│   │   │   ├── payments.js   # Simulated payment checkout endpoints
│   │   │   ├── products.js   # Product queries, seller product catalogs
│   │   │   ├── reviews.js    # Review feed posting & querying
│   │   │   ├── upload.js     # Mock file upload routes
│   │   │   └── users.js      # Profiles, addresses, and passwords
│   │   ├── seed.js           # Custom database seeder populating 50+ items
│   │   └── server.js         # Active Express server entry point
│   ├── .env.example          # Server environment configuration template
│   └── package.json          # Server dependencies & scripts
│
├── frontend/                 # React client built with TypeScript & Vite 7
│   ├── src/
│   │   ├── assets/           # Media & style assets
│   │   ├── components/       # Reusable components & UI layout elements
│   │   │   ├── Navbar/       # Application header navigation
│   │   │   ├── cart/         # Shopping cart overlays
│   │   │   ├── layout/       # App layout grids
│   │   │   ├── products/     # Cinematic lists, cards, grids, and sliders
│   │   │   └── ui/           # Custom inputs, buttons, and decorative backgrounds
│   │   ├── data/             # Static mock lists and fallback catalogs
│   │   ├── lib/              # API Client interfaces & interceptor configuration
│   │   │   ├── api.ts        # Axios client with request/response interceptors
│   │   │   ├── auth.ts       # Auth requests interface (login/signup)
│   │   │   ├── cart.ts       # Cart update interfaces
│   │   │   ├── orders.ts     # Order placements interface
│   │   │   ├── products.ts   # Product CRUD calls mapping
│   │   │   └── upload.ts     # Photo upload triggers
│   │   ├── pages/            # View pages (Home, Checkout, Orders, Profiles)
│   │   │   ├── seller/       # Seller dashboard & product form editor pages
│   │   │   └── Home.tsx      # Landing page displaying categories & carousels
│   │   ├── stores/           # Zustand global state stores (Auth, Cart, catalog)
│   │   └── types/            # App-wide TypeScript definitions
│   ├── tailwind.config.js    # Tailwind configuration
│   └── package.json          # Client dependencies & scripts
│
├── package.json              # Monorepo root package.json with script runners
└── vercel.json               # Deployment configurations
```

---

## 🛠️ Tech Stack

### Client (Frontend)
* **Framework**: React 19 (TypeScript configuration)
* **Tooling & Dev Server**: Vite 7
* **Routing**: React Router DOM 7 (supports protected client routes)
* **Global State Management**: Zustand 5 (configured with persistent storage mapping)
* **Server State Management**: TanStack React Query 5 (caching and API data sync)
* **Styling & Presentation**: Tailwind CSS 3.4 + PostCSS (integrates glassmorphism & premium UI designs)
* **Animation Library**: Framer Motion 12 (smooth transitions, floating elements, reveal scrolls)
* **Interactive Sliders**: Swiper 12 (dynamic image carousels with zoom utility)
* **Toast Feedback**: Sonner (rich colored alerts)
* **Icons**: Lucide React

### Server (Backend)
* **Runtime Environment**: Node.js
* **Framework**: Express.js (JavaScript, CommonJS module structure)
* **Database & ODM**: MongoDB with Mongoose
* **Authorization**: JSON Web Tokens (JWT) & `bcryptjs` password hashing
* **Security Middleware**: Helmet, CORS protection, Express Rate Limit
* **Validation**: express-validator (incoming payload filtering)
* **Mock Handlers**: Integrated mock payment endpoints (Razorpay-compatible interface) and mock file uploads (returns placeholder Unsplash image URLs).

---

## 🚀 Key Features

### 🎨 User Experience
* **Cinematic Dark-Themed UI**: Premium dark layout utilizing vibrant gradients, backdrop filters, glassmorphic card layouts, and micro-interactions.
* **Scroll & Showcase Effects**: Features reveal scroll animations, floating product cards, and smooth state transitions.
* **Product Zoom & Slider**: Implements product detail galleries using Swiper with image pagination and zooming capabilities.

### 👥 Role-Based Ecosystem
* **Customers**:
  * Discover products using interactive search, sorting (price, rating, name), and category sidebars.
  * Manage a persistent shopping cart (local cart for guest mode, automatically syncing with MongoDB database upon login).
  * Maintain a persistent wishlist.
  * Navigate a multi-step checkout: Cart Review ➔ Address Selection ➔ Delivery Selection ➔ Payment Selection ➔ Final Order Review.
  * Apply functional coupons (e.g., `NEXCART20` for 20% discount, `FIRST50` for flat ₹50 discount).
  * Write product reviews and view order histories.
* **Sellers**:
  * Onboard with business credentials.
  * Access the **Seller Dashboard** detailing revenue analytics, stock trackers, and active products.
  * Manage product catalog (full CRUD operations, inventory counts, SKU tagging, draft/active statuses).
* **Administrators**:
  * Oversee platform activity, manage user roles, and verify merchant accounts.

---

## 🔒 Configuration & Environment Variables

### Backend (`/backend/.env`)
Create a `.env` file in the `/backend` directory based on `/backend/.env.example`:

| Key | Description | Default / Example |
| :--- | :--- | :--- |
| `PORT` | Local server listening port | `5000` |
| `MONGO_URI` | MongoDB Connection URI (Local or Atlas Cloud) | `mongodb://localhost:27017/nexcart` |
| `JWT_SECRET` | Secret key used for signing JWT login tokens | *Generate a secure key* |
| `JWT_EXPIRES_IN` | Duration before user login sessions expire | `30d` |
| `FRONTEND_URL` | Client origin allowed by CORS configurations | `http://localhost:5173` |
| `NODE_ENV` | Running node environment | `development` |

### Frontend (`/frontend/.env`)
Create a `.env` in the `frontend` folder (optional):

| Key | Description | Default / Example |
| :--- | :--- | :--- |
| `VITE_API_URL` | API server URL (if blank, Vite proxies to backend) | *(Defaults to empty string to use local dev proxy)* |

---

## 📋 Installation & Running Locally

The easiest way to start developing is by running scripts from the root directory.

### Monorepo Setup (Recommended)

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd PopKart
   ```

2. **Install All Dependencies**:
   Installs both client and server packages concurrently from the root folder:
   ```bash
   npm run install:all
   ```

3. **Configure Environment variables**:
   Create a `.env` file in the `/backend` folder using `/backend/.env.example` as a template and provide your database credentials.

4. **Seed the Database**:
   Seeds your MongoDB instance with default categories, a seller profile (`seller@nexcart.in` / `seller123`), and 50+ detailed products:
   ```bash
   npm run seed --prefix backend
   ```

5. **Launch Development Server**:
   Launches the client dev server and API server concurrently:
   ```bash
   npm run dev
   ```
   * Frontend: `http://localhost:5173`
   * Backend: `http://localhost:5000`

---

### Isolated Setup (Optional)

If you prefer to manage the frontend and backend in separate terminals:

#### Running the Backend Isolated
```bash
cd backend
npm install
cp .env.example .env     # Configure database URI and secrets
npm run seed             # Seed Mongoose database
npm run dev              # Starts development server via nodemon on PORT (5000)
```

#### Running the Frontend Isolated
```bash
cd frontend
npm install
npm run dev              # Starts Vite client server on http://localhost:5173
```

---

## 🌐 API Endpoints Reference

All routes are mounted under the `/api` prefix:

### 🔐 Authentication (`/api/auth`)
* `POST /api/auth/signup` - Register a new account (`CUSTOMER` or `SELLER`).
* `POST /api/auth/login` - Login to account and receive a JWT.
* `GET /api/auth/me` - Get profile of the currently logged-in user. *(Requires Auth)*
* `POST /api/auth/logout` - Clear user session tokens.

### 👤 Users & Profiles (`/api/users`)
* `GET /api/users/profile` - Fetch current profile metadata. *(Requires Auth)*
* `PUT /api/users/profile` - Update profile metadata or business settings (for sellers). *(Requires Auth)*
* `PUT /api/users/addresses` - Synchronize user delivery address lists. *(Requires Auth)*
* `PUT /api/users/password` - Change account password. *(Requires Auth)*

### 🛒 Shopping Cart (`/api/cart`)
* `GET /api/cart` - Get user cart items and checkout total. *(Requires Auth)*
* `POST /api/cart/add` - Add a product variant and quantity to the cart. *(Requires Auth)*
* `PUT /api/cart/items/:itemId` - Update the quantity of a specific item. *(Requires Auth)*
* `DELETE /api/cart/items/:itemId` - Remove an item from the cart. *(Requires Auth)*
* `DELETE /api/cart/clear` - Wipe all items from the cart. *(Requires Auth)*

### 📦 Products & Catalog (`/api/products`)
* `GET /api/products` - Fetch active products (supports pagination `page`, `limit`, filter category slug, min/max price, search string, sorting).
* `GET /api/products/:id` - Fetch single product metadata.
* `GET /api/products/seller/my-products` - Fetch products managed by the current authenticated seller. *(Requires Auth + SELLER/ADMIN role)*
* `POST /api/products` - Publish a new product listing. *(Requires Auth + SELLER/ADMIN role)*
* `PUT /api/products/:id` - Update product information. *(Requires Auth + SELLER/ADMIN role)*
* `DELETE /api/products/:id` - Delete product listing. *(Requires Auth + SELLER/ADMIN role)*

### 🏷️ Categories (`/api/categories`)
* `GET /api/categories` - List all category filters and active product counts.
* `GET /api/categories/tree` - Retrieve hierarchy trees for categories.
* `GET /api/categories/:id` - Retrieve individual category documents.

### 📋 Orders & Fulfillment (`/api/orders`)
* `POST /api/orders` - Place a new order (clears cart, updates inventory). *(Requires Auth)*
* `GET /api/orders` - Fetch all orders placed by the current customer. *(Requires Auth)*
* `GET /api/orders/:id` - Fetch detailed metadata of a specific order. *(Requires Auth)*
* `POST /api/orders/:id/confirm-mock-payment` - Simulates payment capture, marking an order as `PAID` and `CONFIRMED`. *(Requires Auth)*

### ⭐ Product Reviews (`/api/reviews`)
* `GET /api/reviews` - Fetch reviews for a specific item (e.g., `?productId=<id>`).
* `POST /api/reviews` - Publish a new product review and rating. *(Requires Auth)*

### 💳 Payments & Media Uploads (Mock)
* `POST /api/payments/create-order` - Generates a mock Razorpay order model. *(Requires Auth)*
* `POST /api/payments/verify` - Returns payment verification success confirmation. *(Requires Auth)*
* `POST /api/upload` - Mock file upload endpoint returning static mock image URL arrays. *(Requires Auth)*

---

## 📄 License
Licensed under the [MIT License](LICENSE).
