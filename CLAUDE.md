# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Essential Commands

### Development

- `bun install` - Install dependencies (uses Bun as package manager)
- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run lint` - Run ESLint
- `bun run lint:fix` - Auto-fix ESLint issues
- `bun run type-check` - TypeScript type checking
- `bun run format` - Format code with Prettier
- `bun run format:check` - Check code formatting

### Testing

- `bun run test` - Run all tests with Vitest
- `bun run test:watch` - Run tests in watch mode
- `bun run test:coverage` - Run tests with coverage report
- `bun test components/ui/__tests__/badge.test.tsx` - Run specific test file

### Analysis and Optimization

- `bun run analyze` - Bundle analysis with webpack-bundle-analyzer
- `bun run clean` - Clean build artifacts

## Architecture Overview

### Core Technologies

- **Next.js 15** with App Router - Modern React framework with experimental features
- **React 19** - Latest React with enhanced concurrent features
- **TypeScript** with strict configuration - Type safety with comprehensive checks
- **Tailwind CSS 4** - Utility-first CSS framework with PostCSS
- **Bun** - JavaScript runtime and package manager (≥1.2.0)
- **React Three Fiber** - 3D graphics with Three.js and @react-three/drei
- **Content Collections** - MDX content management with Zod validation
- **Vitest** - Testing framework with coverage reporting

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

hooks/             # Custom React hooks
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
- Required: Create from `.env.example` if available
- Optional `HF_TOKEN` for Hugging Face integration (AI features)
- Bun lockfile (`bun.lock`) should be committed

### External Integrations

- **GitHub API**: Used for fetching repository data in Projects section
- **Hugging Face**: Optional AI integration for enhanced features
- **Google Fonts**: Inter and Sora fonts loaded with display swap optimization

### Performance Considerations

- 3D components use dynamic imports to avoid SSR issues
- Images optimized with Next.js Image component (AVIF/WebP formats)
- Font preloading enabled for critical fonts
- Reduced motion preferences respected in animations
- Bundle analysis available with `ANALYZE=true bun run build`
- Partial Prerendering (PPR) enabled for enhanced performance
- React Compiler optimization enabled
- Optimized package imports for lucide-react and framer-motion

### Quality Assurance

- **TypeScript**: Extremely strict configuration with comprehensive type checking
- **Testing**: Vitest with 80% coverage thresholds (branches, functions, lines, statements)
- **Linting**: ESLint with TypeScript rules and Prettier integration
- **Build Validation**: TypeScript and ESLint errors fail builds in production
