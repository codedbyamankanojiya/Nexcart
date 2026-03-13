import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import WishlistDrawer from '../wishlist/WishlistDrawer';
import { useUiStore } from '../../stores/uiStore';


import Footer from './Footer';

export default function AppLayout() {


  const isWishlistOpen = useUiStore((s) => s.isWishlistOpen);
  const openWishlist = useUiStore((s) => s.openWishlist);
  const closeWishlist = useUiStore((s) => s.closeWishlist);

  return (
    <div className="min-h-dvh bg-background text-foreground pk-ambient pk-grid pk-surface pk-noise">
      <Navbar />
      <main key={location.pathname} className="pk-page pk-bottom-safe">
        <Outlet />
      </main>
      <Footer />



      <WishlistDrawer open={isWishlistOpen} onOpenChange={(open) => (open ? openWishlist() : closeWishlist())} />
    </div>
  );
}
