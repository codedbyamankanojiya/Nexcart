# NexCart Backend Setup

## Overview
Complete backend implementation for a multi-vendor marketplace with authentication, product management, order processing, and payment integration.

## Features Implemented

### Ã°Å¸â€Â Authentication & Authorization
- JWT-based authentication with signup/login/logout
- Role-based access control (Customer, Seller, Admin)
- Protected routes with middleware

### Ã°Å¸â€˜Â¥ User Management
- Customer profiles with address management
- Seller onboarding with business information
- Admin dashboard for user management
- Profile updates and analytics

### Ã°Å¸â€ºÂÃ¯Â¸Â Product Management
- Full CRUD operations for sellers
- Product variants and inventory tracking
- Advanced search and filtering
- Category management with hierarchy
- Image upload via Cloudinary

### Ã°Å¸â€ºâ€™ Shopping Cart & Orders
- Persistent cart with database storage
- Order processing workflow (Pending Ã¢â€ â€™ Paid Ã¢â€ â€™ Processing Ã¢â€ â€™ Shipped Ã¢â€ â€™ Delivered)
- Stock management and low-stock alerts
- Order history and tracking

### Ã°Å¸â€™Â³ Payment Integration
- Razorpay integration for Indian market
- Secure payment processing
- Transaction history
- Escrow system for marketplace

### Ã¢Â­Â Reviews & Ratings
- Customer reviews for purchased products
- Rating statistics and distribution
- Verified purchase badges

### Ã°Å¸â€œÅ  Analytics & Reporting
- Seller analytics dashboard
- Sales tracking and revenue reports
- Low stock notifications
- Order management

## Tech Stack
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with bcrypt
- **Payments**: Razorpay
- **File Storage**: Cloudinary
- **Validation**: Zod
- **Security**: Helmet, CORS, Rate Limiting

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Products
- `GET /api/products` - List products with filtering
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (seller only)
- `PUT /api/products/:id` - Update product (seller only)
- `DELETE /api/products/:id` - Delete product (seller only)
- `GET /api/products/seller/my-products` - Seller's products

### Categories
- `GET /api/categories` - List categories
- `GET /api/categories/tree` - Category hierarchy
- `GET /api/categories/:id` - Get category details

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/items/:itemId` - Update cart item
- `DELETE /api/cart/items/:itemId` - Remove cart item
- `DELETE /api/cart/clear` - Clear cart

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - List user orders
- `GET /api/orders/:id` - Get order details
- `PATCH /api/orders/:id/status` - Update order status

### Payments
- `POST /api/payments/create-order` - Create Razorpay order
- `POST /api/payments/verify` - Verify payment
- `GET /api/payments/transactions/:orderId` - Get transactions

### Reviews
- `GET /api/reviews/product/:productId` - Get product reviews
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/seller/analytics` - Seller analytics
- `GET /api/users/admin/users` - Admin user management

### Upload
- `POST /api/upload/image` - Upload single image
- `POST /api/upload/images` - Upload multiple images
- `DELETE /api/upload/image/:publicId` - Delete image

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Setup
Copy `.env.example` to `.env` and configure:
- Database URL (PostgreSQL)
- JWT secret
- Razorpay keys
- Cloudinary credentials
- Email settings

### 3. Database Setup
```bash
npx prisma generate
npx prisma migrate dev --name init
npm run seed
```

### 4. Start Development Server
```bash
npm run dev
```

## Database Schema
Complete schema with:
- Users (Customer/Seller/Admin roles)
- Products with variants and inventory
- Categories with hierarchy
- Orders and order items
- Shopping cart
- Reviews and ratings
- Payment transactions
- Image storage

## Security Features
- JWT authentication
- Password hashing
- Rate limiting
- CORS protection
- Input validation
- SQL injection prevention via Prisma

## Next Steps
1. Set up PostgreSQL database
2. Configure environment variables
3. Run migrations and seed data
4. Install dependencies
5. Start development server
6. Integrate frontend with new APIs
