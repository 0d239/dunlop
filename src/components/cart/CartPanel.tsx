'use client';

import { useEffect } from 'react';
import {
  useCartStore,
  selectItemCount,
  selectSubtotalCents,
} from '@/lib/state/useCartStore';

function formatCents(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export default function CartPanel() {
  const lines = useCartStore((s) => s.lines);
  const open = useCartStore((s) => s.open);
  const view = useCartStore((s) => s.view);
  const setOpen = useCartStore((s) => s.setOpen);
  const setView = useCartStore((s) => s.setView);
  const setQty = useCartStore((s) => s.setQty);
  const remove = useCartStore((s) => s.remove);
  const itemCount = useCartStore(selectItemCount);
  const subtotal = useCartStore(selectSubtotalCents);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (view === 'checkout-stub') setView('cart');
        else setOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, view, setOpen, setView]);

  return (
    <section
      aria-hidden={!open}
      className={`pointer-events-auto fixed bottom-16 left-0 right-0 z-30 flex max-h-[60vh] flex-col border-t border-white/15 bg-black/95 backdrop-blur transition-transform duration-300 ease-out ${
        open ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      {view === 'checkout-stub' ? (
        <CheckoutStub onBack={() => setView('cart')} />
      ) : (
        <>
          <header className="flex items-center justify-between border-b border-white/10 px-6 py-4">
            <div className="flex items-baseline gap-3">
              <h3 className="text-[11px] uppercase tracking-[0.3em] text-white">
                Basket
              </h3>
              <div className="text-[10px] uppercase tracking-[0.2em] text-neutral-600">
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close basket"
              className="rounded-full border border-white/15 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-neutral-400 transition hover:border-[#EF0000] hover:text-[#EF0000]"
            >
              Close
            </button>
          </header>

          {lines.length === 0 ? (
            <div className="flex flex-1 items-center justify-center px-6 py-12 text-center">
              <div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-neutral-600">
                  Empty
                </div>
                <div className="mt-3 text-sm text-neutral-500">
                  Pick something up in the room.
                </div>
              </div>
            </div>
          ) : (
            <ul className="flex-1 divide-y divide-white/5 overflow-y-auto">
              {lines.map((line) => {
                const lineTotal = line.product.priceCents * line.qty;
                return (
                  <li
                    key={line.product.id}
                    className="flex items-center gap-4 px-6 py-3"
                  >
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded border border-white/10 bg-black">
                      {line.product.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={line.product.image}
                          alt={line.product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[13px] text-white">
                        {line.product.name}
                      </div>
                      {line.product.brand ? (
                        <div className="text-[10px] uppercase tracking-[0.2em] text-neutral-600">
                          {line.product.brand}
                        </div>
                      ) : null}
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-neutral-300">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() =>
                          setQty(line.product.id, line.qty - 1)
                        }
                        className="h-7 w-7 rounded border border-white/15 transition hover:border-[#EF0000] hover:text-[#EF0000]"
                      >
                        −
                      </button>
                      <div className="w-6 text-center tabular-nums">
                        {line.qty}
                      </div>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() =>
                          setQty(line.product.id, line.qty + 1)
                        }
                        className="h-7 w-7 rounded border border-white/15 transition hover:border-[#EF0000] hover:text-[#EF0000]"
                      >
                        +
                      </button>
                    </div>

                    <div className="w-16 text-right text-[12px] tabular-nums text-neutral-300">
                      {formatCents(lineTotal)}
                    </div>

                    <button
                      type="button"
                      onClick={() => remove(line.product.id)}
                      aria-label={`Remove ${line.product.name}`}
                      className="text-[14px] text-neutral-600 transition hover:text-[#EF0000]"
                    >
                      ✕
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          <footer className="flex items-center justify-between border-t border-white/10 px-6 py-4">
            <div className="flex items-baseline gap-3">
              <div className="text-[10px] uppercase tracking-[0.3em] text-neutral-500">
                Subtotal
              </div>
              <div className="text-base tabular-nums text-white">
                {formatCents(subtotal)}
              </div>
            </div>
            <button
              type="button"
              disabled={lines.length === 0}
              onClick={() => setView('checkout-stub')}
              className="rounded-full border border-white/20 px-6 py-2 text-[11px] uppercase tracking-[0.3em] text-neutral-200 transition hover:border-[#EF0000] hover:text-[#EF0000] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-white/20 disabled:hover:text-neutral-200"
            >
              Checkout
            </button>
          </footer>
        </>
      )}
    </section>
  );
}

function CheckoutStub({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center justify-between border-b border-white/10 px-6 py-4">
        <button
          type="button"
          onClick={onBack}
          className="text-[10px] uppercase tracking-[0.3em] text-neutral-500 transition hover:text-[#EF0000]"
        >
          ← Back to basket
        </button>
        <div className="text-[10px] uppercase tracking-[0.3em] text-neutral-500">
          Milestone 2
        </div>
      </header>
      <div className="flex flex-1 items-center justify-center px-6 py-12 text-center">
        <div className="max-w-md">
          <div className="text-[10px] uppercase tracking-[0.3em] text-[#EF0000]">
            Coming soon
          </div>
          <h4 className="mt-3 text-2xl uppercase tracking-wide text-white">
            Custom checkout
          </h4>
          <p className="mt-4 text-sm leading-relaxed text-neutral-400">
            Contact, shipping, payment, and order placement will run inline
            in this frame — same BigCommerce backend, our UI. Until then,
            the basket is local and won&apos;t be charged.
          </p>
        </div>
      </div>
    </div>
  );
}
