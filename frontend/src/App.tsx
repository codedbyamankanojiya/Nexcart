import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useEffect } from 'react';
import { useAuthStore } from './stores/authStore';
import type React from 'react';
import AppLayout from './components/layout/AppLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Orders from './pages/Orders';
import ProductDetails from './pages/ProductDetails';
import Wishlist from './pages/Wishlist';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import SellerDashboard from './pages/seller/SellerDashboard';
import SellerProducts from './pages/seller/SellerProducts';
import ProductForm from './pages/seller/ProductForm';
import Settings from './pages/Settings';
import Profile from './pages/Profile';

function RequireAuth({ children }: { children: React.ReactElement }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function RequireSeller({ children }: { children: React.ReactElement }) {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'SELLER') return <Navigate to="/" replace />;
  return children;
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'product/:id', element: <ProductDetails /> },
      { path: 'wishlist', element: <Wishlist /> },
      { path: 'cart', element: <Cart /> },
      { path: 'checkout', element: <RequireAuth><Checkout /></RequireAuth> },
      { path: 'orders', element: <RequireAuth><Orders /></RequireAuth> },
      { path: 'settings', element: <RequireAuth><Settings /></RequireAuth> },
      { path: 'profile', element: <RequireAuth><Profile /></RequireAuth> },
      { path: 'seller/dashboard', element: <RequireSeller><SellerDashboard /></RequireSeller> },
      { path: 'seller/products', element: <RequireSeller><SellerProducts /></RequireSeller> },
      { path: 'seller/products/new', element: <RequireSeller><ProductForm /></RequireSeller> },
      { path: 'seller/products/edit/:id', element: <RequireSeller><ProductForm /></RequireSeller> },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
]);

function AppContent() {
  const { checkAuth, isLoading } = useAuthStore();

  useEffect(() => {
    checkAuth().catch(console.error);
  }, [checkAuth]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <RouterProvider router={router} />
      <Toaster richColors closeButton position="top-right" />
    </>
  );
}

export default function App() {
  return <AppContent />;
}
