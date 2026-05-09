import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex h-screen w-screen flex-col items-center justify-center gap-8 bg-[#0d0a08] text-[#f5f1ea]">
      <div className="flex flex-col items-center gap-2 text-center">
        <p className="text-sm uppercase tracking-[0.4em] text-neutral-500">
          Dunlop. Since 1965.
        </p>
        <h1 className="text-5xl font-semibold tracking-tight">
          Performance is everything.
        </h1>
        <p className="max-w-md text-neutral-400">
          A diegetic 3D shopping experience. Step into the studio and pick
          something up.
        </p>
      </div>
      <Link
        href="/room"
        className="rounded-full border border-[#EF0000] bg-[#EF0000] px-8 py-3 text-sm font-medium uppercase tracking-widest text-white transition hover:bg-transparent hover:text-[#EF0000]"
      >
        Enter the Room
      </Link>
    </main>
  );
}
