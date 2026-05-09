'use client';

import { useSelectionStore } from '@/lib/state/useSelectionStore';

export default function SelectionOverlay() {
  const selected = useSelectionStore((s) => s.selected);

  return (
    <div className="pointer-events-none absolute bottom-6 left-6 z-10 max-w-xs rounded-md border border-white/10 bg-black/60 px-4 py-3 text-xs text-neutral-300 backdrop-blur">
      <div className="text-[10px] uppercase tracking-[0.3em] text-neutral-500">
        Selection
      </div>
      {selected ? (
        <div className="mt-1">
          <div className="text-base text-white">{selected.name}</div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-[#EF0000]">
            {selected.category}
          </div>
        </div>
      ) : (
        <div className="mt-1 text-neutral-500">
          Click an object in the room.
        </div>
      )}
    </div>
  );
}
