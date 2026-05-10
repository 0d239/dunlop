'use client';

import {
  useCartStore,
  selectItemCount,
} from '@/lib/state/useCartStore';

export default function CartBar() {
  const itemCount = useCartStore(selectItemCount);
  const open = useCartStore((s) => s.open);
  const toggleOpen = useCartStore((s) => s.toggleOpen);
  const setOpen = useCartStore((s) => s.setOpen);
  const setView = useCartStore((s) => s.setView);

  return (
    <div className="pointer-events-auto relative z-40 flex h-16 w-full shrink-0 items-center justify-between border-t border-black/15 bg-white px-6 text-xs uppercase tracking-[0.3em] dark:border-white/15 dark:bg-black">
      <button
        type="button"
        onClick={toggleOpen}
        aria-expanded={open}
        aria-label={open ? 'Close basket' : 'Open basket'}
        className="flex items-center gap-3 text-neutral-700 transition hover:text-[#EF0000] dark:text-neutral-300"
      >
        <BasketIcon />
        <span>Basket</span>
        {itemCount > 0 && (
          <span className="rounded-full bg-[#EF0000] px-2 py-[2px] text-[10px] tracking-normal text-white">
            {itemCount}
          </span>
        )}
        <span className="text-neutral-400 dark:text-neutral-600">·</span>
        <span className="text-neutral-500">
          {itemCount} {itemCount === 1 ? 'item' : 'items'}
        </span>
        <span className="ml-2 text-[10px] text-neutral-400 dark:text-neutral-600">
          {open ? '▼' : '▲'}
        </span>
      </button>
      <button
        type="button"
        disabled={itemCount === 0}
        onClick={() => {
          setOpen(true);
          setView('checkout-stub');
        }}
        className="rounded-full border border-black/20 px-5 py-2 text-neutral-700 transition hover:border-[#EF0000] hover:text-[#EF0000] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-black/20 disabled:hover:text-neutral-700 dark:border-white/20 dark:text-neutral-300 dark:disabled:hover:border-white/20 dark:disabled:hover:text-neutral-300"
      >
        Checkout
      </button>
    </div>
  );
}

function BasketIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 8 H20 L18.4 20.2 a1.2 1.2 0 0 1 -1.2 1 H6.8 a1.2 1.2 0 0 1 -1.2 -1 Z" />
      <path d="M4 8 L8 4 H16 L20 8" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
