import dynamic from 'next/dynamic';
import Link from 'next/link';
import SelectionOverlay from '@/components/room/SelectionOverlay';

const RoomScene = dynamic(() => import('@/components/room/RoomScene'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center text-sm uppercase tracking-[0.4em] text-neutral-500">
      Tuning up.
    </div>
  ),
});

export default function RoomPage() {
  return (
    <main className="relative h-screen w-screen overflow-hidden bg-[#0d0a08]">
      <RoomScene />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between p-6">
        <Link
          href="/"
          className="pointer-events-auto rounded-full border border-white/10 bg-black/40 px-4 py-2 text-xs uppercase tracking-[0.3em] text-neutral-300 backdrop-blur transition hover:border-white/30"
        >
          Back
        </Link>
        <div className="pointer-events-auto rounded-full border border-white/10 bg-black/40 px-4 py-2 text-xs uppercase tracking-[0.3em] text-neutral-300 backdrop-blur">
          Dunlop. Since 1965.
        </div>
      </div>
      <SelectionOverlay />
    </main>
  );
}
