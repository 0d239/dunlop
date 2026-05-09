# dunlop

A Next.js 15 + React Three Fiber project.

## Toolchain

This project uses [**Bun**](https://bun.sh) as the standard package manager and runtime. Do **not** use `npm`, `yarn`, or `pnpm` — only `bun.lock` is committed and only Bun is supported in CI.

- Bun: `>=1.3.0` (pinned via `packageManager` in `package.json`)
- Node target: matches Next.js 15 requirements (Node 18.18+ if running a non-Bun runtime)

### Install Bun

```sh
curl -fsSL https://bun.sh/install | bash
```

Or with Homebrew:

```sh
brew install oven-sh/bun/bun
```

## Setup

```sh
bun install
```

## Scripts

| Command         | What it does                          |
| --------------- | ------------------------------------- |
| `bun dev`       | Start the Next.js dev server on :3000 |
| `bun run build` | Production build                      |
| `bun start`     | Serve the production build on :3000   |
| `bun lint`      | Run `next lint`                       |

> Use `bun run build` (not `bun build`) — `bun build` is Bun's own bundler and will not invoke Next.js.

## Adding dependencies

```sh
bun add <pkg>           # runtime dep
bun add -d <pkg>        # dev dep
bun remove <pkg>
bun update              # update within ranges
```

## Stack

- Next.js 15 (App Router)
- React 18
- React Three Fiber + drei + three
- Zustand
- Tailwind CSS 3
- TypeScript 5
