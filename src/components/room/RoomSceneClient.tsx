'use client';

import dynamic from 'next/dynamic';

const RoomScene = dynamic(() => import('./RoomScene'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center text-sm uppercase tracking-[0.4em] text-neutral-500">
      Tuning up.
    </div>
  ),
});

export default function RoomSceneClient() {
  return <RoomScene />;
}
