# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Development Commands

```bash
npm run dev      # Start development server at localhost:3000
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Architecture

This is a Next.js 15 application (App Router) with React 19, using Tailwind CSS v4 for styling.

### Project Structure

- `app/` - Next.js App Router pages and layout
- `components/` - React components
  - `ui/` - Reusable shadcn/ui primitives (Button, Card, Dialog, etc.)
  - Root level - Feature components for the device management dashboard
- `lib/utils.ts` - Utility functions (`cn` for className merging)
- `dashboard.tsx` - Main dashboard component (at project root, imported by `app/page.tsx`)

### Key Patterns

**UI Components**: Uses shadcn/ui component library built on Radix UI primitives. Components are in `components/ui/` and use the `cn()` utility for conditional class merging.

**State Management**: Client-side state with React hooks. Device data uses local state with mock data - no backend integration yet.

**Styling**: Tailwind CSS v4 with CSS variables for theming (light/dark mode support defined in `globals.css`). Uses `tw-animate-css` for animations.

**Path Aliases**: `@/*` maps to project root (e.g., `@/components/ui/button`).

### Main Application Flow

`app/page.tsx` → `dashboard.tsx` → renders either `DeviceDashboard` or `RemoteReach` based on active tab.

The RemoteReach component (`components/remote-reach.tsx`) is the core feature, providing:
- Device list with search/filter
- Drag-and-drop device reordering
- Connection modals for various protocols (SSH, Telnet, HTTP/S, RDP, VNC, Serial/COM)
- Device scanning and quick connect functionality
