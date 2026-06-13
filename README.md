# NexCart - Multi-Vendor Marketplace

A comprehensive e-commerce marketplace platform built with React and Node.js, supporting multiple sellers, secure payments, and advanced product management.

## Ã°Å¸Ââ€”Ã¯Â¸Â Project Structure

```
NexCart/
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ backend/          # Node.js + Express API server
Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ src/
Ã¢â€â€š   Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ routes/   # API endpoints
Ã¢â€â€š   Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ middleware/ # Authentication & validation
Ã¢â€â€š   Ã¢â€â€š   Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬ server.ts # Main server file
Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ prisma/       # Database schema & migrations
Ã¢â€â€š   Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬ package.json  # Backend dependencies
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ frontend/         # React + TypeScript client
Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ src/
Ã¢â€â€š   Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ components/ # React components
Ã¢â€â€š   Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ pages/      # Page components
Ã¢â€â€š   Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ stores/     # State management
Ã¢â€â€š   Ã¢â€â€š   Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬ lib/        # Utilities & API calls
Ã¢â€â€š   Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬ package.json  # Frontend dependencies
Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬ README.md
```

## Ã°Å¸Å¡â‚¬ Features

### For Customers
- Browse products by category
- Advanced search and filtering
- Shopping cart management
- Secure checkout with Razorpay
- Order tracking and history
- Product reviews and ratings
- User profile management

### For Sellers
- Product listing management (CRUD)
- Inventory tracking with low-stock alerts
- Order processing and fulfillment
- Sales analytics and reporting
- Store customization
- Payment processing with escrow

### For Administrators
- User management and oversight
- Order monitoring
- Platform analytics
- Seller verification

## Ã°Å¸â€ºÂ Ã¯Â¸Â Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Zustand** for state management
- **React Query** for server state
- **Lucide React** for icons

### Backend
- **Node.js** + **Express** with TypeScript
- **PostgreSQL** with **Prisma ORM**
- **JWT** for authentication
- **Razorpay** for payments
- **Cloudinary** for image storage
- **Zod** for validation
- **bcrypt** for password hashing

## Ã°Å¸â€œâ€¹ Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Razorpay account (for payments)
- Cloudinary account (for images)

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   
   Configure the following in `.env`:
   - `DATABASE_URL` - PostgreSQL connection string
   - `JWT_SECRET` - Secret for JWT tokens
   - `RAZORPAY_KEY_ID` - Razorpay API key
   - `RAZORPAY_KEY_SECRET` - Razorpay secret key
   - `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
   - `CLOUDINARY_API_KEY` - Cloudinary API key
   - `CLOUDINARY_API_SECRET` - Cloudinary API secret

4. Set up database:
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   npm run seed
   ```

5. Start development server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

## Ã°Å¸Å’Â API Endpoints

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

### Categories
- `GET /api/categories` - List categories
- `GET /api/categories/tree` - Category hierarchy

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/items/:itemId` - Update cart item
- `DELETE /api/cart/items/:itemId` - Remove cart item

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - List user orders
- `GET /api/orders/:id` - Get order details

### Payments
- `POST /api/payments/create-order` - Create Razorpay order
- `POST /api/payments/verify` - Verify payment

### Reviews
- `GET /api/reviews/product/:productId` - Get product reviews
- `POST /api/reviews` - Create review

## Ã°Å¸â€Â Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Input validation with Zod
- SQL injection prevention via Prisma
- Secure file upload with Cloudinary

## Ã°Å¸â€œÂ± Responsive Design

The frontend is fully responsive and works across:
- Desktop (1920px+)
- Tablet (768px - 1024px)
- Mobile (320px - 768px)

## Ã°Å¸Å¡â‚¬ Deployment

### Frontend (Vercel)
1. Connect repository to Vercel
2. Set root directory to `frontend`
3. Configure environment variables
4. Deploy

### Backend (Render/Railway)
1. Connect repository to deployment platform
2. Set root directory to `backend`
3. Configure environment variables
4. Deploy with PostgreSQL add-on

## Ã°Å¸Â¤Â Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Ã°Å¸â€œâ€ž License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Ã°Å¸â€œÅ¾ Support

For support and questions, please open an issue in the repository.

