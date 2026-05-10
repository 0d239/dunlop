import RoomSceneClient from '@/components/room/RoomSceneClient';
import CartBar from '@/components/cart/CartBar';
import CartPanel from '@/components/cart/CartPanel';
import DivePanel from '@/components/dive/DivePanel';
import ProductPanel from '@/components/dive/ProductPanel';

export default function HomePage() {
  return (
    <main className="relative flex h-screen w-screen flex-col overflow-hidden bg-black">
      <div className="relative flex-1">
        <RoomSceneClient />
      </div>
      <DivePanel />
      <ProductPanel />
      <CartPanel />
      <CartBar />
    </main>
  );
}
