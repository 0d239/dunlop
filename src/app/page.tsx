import RoomSceneClient from '@/components/room/RoomSceneClient';
import CartBar from '@/components/cart/CartBar';
import CartPanel from '@/components/cart/CartPanel';
import DivePanel from '@/components/dive/DivePanel';
import ProductPanel from '@/components/dive/ProductPanel';
import ThemeToggle from '@/components/theme/ThemeToggle';
import KeyboardController from '@/components/keyboard/KeyboardController';

export default function HomePage() {
  return (
    <main className="relative flex h-screen w-screen flex-col overflow-hidden bg-white dark:bg-black">
      <div className="relative flex-1">
        <RoomSceneClient />
      </div>
      <ThemeToggle />
      <DivePanel />
      <ProductPanel />
      <CartPanel />
      <CartBar />
      <KeyboardController />
    </main>
  );
}
