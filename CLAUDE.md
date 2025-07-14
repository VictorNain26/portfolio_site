# CLAUDE.md

sszz dzdzedezd eudhzieudhuzedhoizehdoThis file provides guidance to Claude Code
(claude.ai/code) when working with code in this repository.

## Essential Commands

### Development

- `bun install` - Install dependencies (uses Bun as package manager)
- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run lint` - Run ESLint
- `bun run test` - Run all tests with Vitest
- `bun run typecheck` - TypeScript type checking

### Single Test Execution

- `bun test components/ui/__tests__/badge.test.tsx` - Run specific test file
- `bun test --watch` - Run tests in watch mode

## Architecture Overview

### Core Technologies

- **Next.js 15** with App Router - Modern React framework
- **TypeScript** with strict configuration - Type safety
- **Tailwind CSS 4** - Utility-first CSS framework
- **Bun** - JavaScript runtime and package manager
- **React Three Fiber** - 3D graphics with Three.js
- **Content Collections** - MDX content management
- **Vitest** - Testing framework

### Project Structure

```
app/                 # Next.js App Router
├── blog/           # Blog pages with dynamic routes
├── layout.tsx      # Root layout with fonts and metadata
├── page.tsx        # Homepage with component sections
└── globals.css     # Global styles and CSS variables

components/         # React components
├── ui/            # Reusable UI components (shadcn/ui)
├── Hero.tsx       # Main hero section with 3D model
├── ModelHero.tsx  # 3D Three.js component
└── [Other].tsx    # Feature components (About, Skills, etc.)

content/           # MDX content
└── posts/         # Blog posts in MDX format

lib/               # Utilities and shared logic
```

### Key Architecture Patterns

#### 3D Integration

- Hero section uses `dynamic()` import for client-side 3D rendering
- `ModelHero.tsx` loads external GLTF models with Three.js
- React Three Fiber components are wrapped in `Suspense` for loading states

#### Content Management

- Blog posts are managed via Content Collections (`content-collections.ts`)
- MDX files in `content/posts/` are automatically processed
- Schema validation with Zod for post frontmatter

#### Styling System

- CSS variables defined in `globals.css` for consistent theming
- Tailwind CSS with custom utilities like `.gradient-brand-text`
- Component variants using `class-variance-authority`

#### Font Loading

- Google Fonts (Inter, Sora) loaded in `layout.tsx` with CSS variables
- Font display swap for performance optimization

### Development Workflow

#### Content Collections

- Add new blog posts to `content/posts/` as `.mdx` files
- Required frontmatter: `title`, `summary`, `coverImage`, `publishedAt`, `tags`
- Schema is defined in `content-collections.ts`

#### Component Development

- UI components follow shadcn/ui patterns
- Use `clsx` and `tailwind-merge` for conditional classes
- Framer Motion for animations with reduced motion support

#### Testing

- Tests use Vitest with `@testing-library/react`
- Setup file: `vitest.setup.ts` imports Jest DOM matchers
- Component tests in `__tests__/` directories

### Environment Setup

- Environment variables go in `.env.local`
- Optional `HF_TOKEN` for Hugging Face integration
- Bun lockfile (`bun.lockb`) should be committed

### Performance Considerations

- 3D components use dynamic imports to avoid SSR issues
- Images optimized with Next.js Image component
- Font preloading enabled for critical fonts
- Reduced motion preferences respected in animations
