---
name: UI Responsive Design
description: Modern responsive design patterns using mobile-first approach, CSS Grid, Flexbox, and fluid layouts for optimal cross-device experiences.
allowed-tools:
  - Read
  - Write
  - Edit
  - Grep
  - Bash
  - WebFetch
tags:
  - ui
  - responsive
  - mobile-first
  - css-grid
  - flexbox
  - breakpoints
mcp-servers:
  - playwright
  - context7
---

# UI Responsive Design Skill

Create fluid, adaptive interfaces that work beautifully across all screen sizes and devices using modern CSS techniques and mobile-first methodology.

## 🎯 Before You Start

**IMPORTANT**: When using this skill, follow these steps:

1. **Build a Todo List**: Use TodoWrite to break down the implementation into clear steps
2. **Gather Clarification**: Ask about requirements, constraints, and expected outcomes
3. **Understand Context**: Read existing code patterns and project conventions
4. **Execute Transparently**: Mark todos in_progress/completed as you work
5. **Validate**: Test your implementation and verify it meets requirements

**Example approach for this skill**:
Design breakpoints, implement mobile-first CSS, use CSS Grid/Flexbox for layouts, test across multiple devices and screen sizes, optimize images and assets for different resolutions.

**Additional tools available**:
- Use Playwright MCP for testing responsive behavior across viewports
- Use Context7 MCP for CSS Grid and Flexbox documentation

## When to Use

- Building responsive web applications
- Supporting multiple device sizes (mobile, tablet, desktop)
- Implementing adaptive layouts with CSS Grid and Flexbox
- Creating fluid typography and spacing systems
- Optimizing for touch and mouse interactions
- Ensuring cross-browser compatibility

## Core Principles

### 1. Mobile-First Approach
Start with mobile design and progressively enhance for larger screens.

**Benefits:**
- Prioritizes content and core functionality
- Better performance on mobile devices
- Easier to scale up than scale down
- Forces focus on essential features

### 2. Fluid Grids
Use relative units (%, rem, em) instead of fixed pixels.

**Key Concepts:**
- Percentage-based widths
- Container queries for component-level responsiveness
- Flexible images and media
- Proportion-based spacing

### 3. Flexible Images
Images and media that scale within their containers.

**Techniques:**
- `max-width: 100%` for responsive images
- `object-fit` for aspect ratio control
- `picture` element for art direction
- Lazy loading for performance

### 4. Media Queries
Conditional CSS based on viewport characteristics.

**Common Breakpoints:**
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: 1024px - 1280px
- Large Desktop: > 1280px

## Breakpoint Strategy

### Mobile-First Media Queries
```css
/* Base styles: Mobile (< 640px) */
.container {
  padding: 1rem;
  width: 100%;
}

/* Small tablets and large phones (≥ 640px) */
@media (min-width: 640px) {
  .container {
    padding: 1.5rem;
    max-width: 640px;
    margin: 0 auto;
  }
}

/* Medium devices (≥ 768px) */
@media (min-width: 768px) {
  .container {
    max-width: 768px;
    padding: 2rem;
  }
}

/* Large devices (≥ 1024px) */
@media (min-width: 1024px) {
  .container {
    max-width: 1024px;
    padding: 2.5rem;
  }
}

/* Extra large devices (≥ 1280px) */
@media (min-width: 1280px) {
  .container {
    max-width: 1280px;
  }
}
```

### TypeScript/Tailwind Breakpoints
```typescript
// Tailwind CSS breakpoints
const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// React hook for responsive behavior
import { useState, useEffect } from 'react';

type Breakpoint = 'mobile' | 'tablet' | 'desktop' | 'wide';

const useBreakpoint = (): Breakpoint => {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('mobile');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setBreakpoint('mobile');
      else if (width < 1024) setBreakpoint('tablet');
      else if (width < 1280) setBreakpoint('desktop');
      else setBreakpoint('wide');
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return breakpoint;
};

// Usage
const Component: React.FC = () => {
  const breakpoint = useBreakpoint();

  return (
    <div>
      {breakpoint === 'mobile' ? (
        <MobileLayout />
      ) : (
        <DesktopLayout />
      )}
    </div>
  );
};
```

## CSS Grid Patterns

### Responsive Grid Layout
```css
/* Auto-fit grid with minimum card width */
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  padding: 1rem;
}

/* Responsive 12-column grid system */
.grid-12 {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1rem;
}

/* Mobile: Full width */
.grid-item {
  grid-column: span 12;
}

/* Tablet: Half width */
@media (min-width: 768px) {
  .grid-item {
    grid-column: span 6;
  }
}

/* Desktop: One-third width */
@media (min-width: 1024px) {
  .grid-item {
    grid-column: span 4;
  }
}
```

### Named Grid Areas
```tsx
// TypeScript component with CSS Grid
const Layout: React.FC = () => (
  <div className="page-layout">
    <header className="header">Header</header>
    <aside className="sidebar">Sidebar</aside>
    <main className="main">Main Content</main>
    <footer className="footer">Footer</footer>
  </div>
);

const styles = `
.page-layout {
  display: grid;
  min-height: 100vh;
  gap: 1rem;

  /* Mobile: Single column */
  grid-template-areas:
    "header"
    "main"
    "sidebar"
    "footer";
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr auto auto;
}

/* Desktop: Sidebar layout */
@media (min-width: 1024px) {
  .page-layout {
    grid-template-areas:
      "header header"
      "sidebar main"
      "footer footer";
    grid-template-columns: 250px 1fr;
    grid-template-rows: auto 1fr auto;
  }
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.footer { grid-area: footer; }
`;
```

### Advanced Grid Techniques
```css
/* Asymmetric grid layout */
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  grid-auto-rows: 200px;
  gap: 1rem;
}

.gallery-item:nth-child(3n) {
  grid-column: span 2;
  grid-row: span 2;
}

/* Responsive masonry-like layout */
.masonry {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-auto-rows: 10px;
  gap: 1rem;
}

.masonry-item {
  grid-row-end: span var(--row-span);
}
```

## Flexbox Patterns

### Responsive Navigation
```tsx
interface NavProps {
  items: Array<{ label: string; href: string }>;
}

const Navigation: React.FC<NavProps> = ({ items }) => (
  <nav className="nav">
    <div className="nav-brand">Logo</div>
    <ul className="nav-links">
      {items.map(item => (
        <li key={item.href}>
          <a href={item.href}>{item.label}</a>
        </li>
      ))}
    </ul>
  </nav>
);

const styles = `
.nav {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
}

.nav-links {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  list-style: none;
}

/* Desktop: Horizontal layout */
@media (min-width: 768px) {
  .nav {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .nav-links {
    flex-direction: row;
    gap: 2rem;
  }
}
`;
```

### Flexible Card Layout
```tsx
interface CardProps {
  title: string;
  description: string;
  image?: string;
}

const Card: React.FC<CardProps> = ({ title, description, image }) => (
  <div className="card">
    {image && <img src={image} alt={title} className="card-image" />}
    <div className="card-content">
      <h3 className="card-title">{title}</h3>
      <p className="card-description">{description}</p>
    </div>
  </div>
);

const styles = `
.card {
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.card-content {
  padding: 1.5rem;
  flex: 1;
}

/* Horizontal layout on larger screens */
@media (min-width: 768px) {
  .card {
    flex-direction: row;
  }

  .card-image {
    width: 40%;
    height: auto;
  }
}
`;
```

## Fluid Typography

### Responsive Font Sizes
```css
/* Clamp function for fluid typography */
:root {
  /* font-size: clamp(min, preferred, max) */
  --font-size-sm: clamp(0.875rem, 0.8rem + 0.25vw, 1rem);
  --font-size-base: clamp(1rem, 0.9rem + 0.5vw, 1.125rem);
  --font-size-lg: clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem);
  --font-size-xl: clamp(1.5rem, 1.3rem + 1vw, 2rem);
  --font-size-2xl: clamp(2rem, 1.5rem + 2vw, 3rem);
  --font-size-3xl: clamp(2.5rem, 2rem + 2.5vw, 4rem);
}

/* Usage */
h1 {
  font-size: var(--font-size-3xl);
  line-height: 1.2;
}

h2 {
  font-size: var(--font-size-2xl);
  line-height: 1.3;
}

body {
  font-size: var(--font-size-base);
  line-height: 1.6;
}
```

### Responsive Line Height and Spacing
```css
:root {
  /* Spacing scale that grows with viewport */
  --space-xs: clamp(0.25rem, 0.2rem + 0.25vw, 0.5rem);
  --space-sm: clamp(0.5rem, 0.4rem + 0.5vw, 1rem);
  --space-md: clamp(1rem, 0.8rem + 1vw, 1.5rem);
  --space-lg: clamp(1.5rem, 1.2rem + 1.5vw, 2.5rem);
  --space-xl: clamp(2rem, 1.5rem + 2.5vw, 4rem);
}

/* Responsive container padding */
.container {
  padding-inline: var(--space-md);
  padding-block: var(--space-lg);
}

/* Responsive section spacing */
section {
  margin-block: var(--space-xl);
}
```

## Responsive Images

### Picture Element for Art Direction
```tsx
interface ResponsiveImageProps {
  mobileImg: string;
  tabletImg: string;
  desktopImg: string;
  alt: string;
}

const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  mobileImg,
  tabletImg,
  desktopImg,
  alt
}) => (
  <picture>
    <source media="(min-width: 1024px)" srcSet={desktopImg} />
    <source media="(min-width: 768px)" srcSet={tabletImg} />
    <img src={mobileImg} alt={alt} loading="lazy" />
  </picture>
);
```

### Responsive Images with srcset
```tsx
const OptimizedImage: React.FC<{ src: string; alt: string }> = ({ src, alt }) => (
  <img
    src={src}
    srcSet={`
      ${src}?w=400 400w,
      ${src}?w=800 800w,
      ${src}?w=1200 1200w
    `}
    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
    alt={alt}
    loading="lazy"
  />
);
```

### Object Fit and Aspect Ratio
```css
/* Maintain aspect ratio */
.image-container {
  aspect-ratio: 16 / 9;
  overflow: hidden;
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

/* Responsive aspect ratios */
.hero-image {
  aspect-ratio: 4 / 3; /* Mobile: Portrait-ish */
}

@media (min-width: 768px) {
  .hero-image {
    aspect-ratio: 16 / 9; /* Desktop: Landscape */
  }
}
```

## Container Queries

### Component-Level Responsiveness
```css
/* Enable container queries */
.card-container {
  container-type: inline-size;
  container-name: card;
}

/* Query the container, not the viewport */
.card {
  display: flex;
  flex-direction: column;
}

@container card (min-width: 400px) {
  .card {
    flex-direction: row;
  }
}

@container card (min-width: 600px) {
  .card {
    gap: 2rem;
    padding: 2rem;
  }
}
```

### TypeScript Container Query Hook
```typescript
import { useEffect, useState, RefObject } from 'react';

interface ContainerSize {
  width: number;
  height: number;
}

const useContainerQuery = (ref: RefObject<HTMLElement>): ContainerSize => {
  const [size, setSize] = useState<ContainerSize>({ width: 0, height: 0 });

  useEffect(() => {
    if (!ref.current) return;

    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setSize({ width, height });
    });

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);

  return size;
};

// Usage
const ResponsiveCard: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useContainerQuery(containerRef);

  return (
    <div ref={containerRef}>
      {width > 600 ? <WideLayout /> : <NarrowLayout />}
    </div>
  );
};
```

## Touch and Mobile Optimization

### Touch-Friendly Targets
```css
/* Minimum 44px x 44px touch targets */
.button,
.link,
.interactive {
  min-height: 44px;
  min-width: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
}

/* Add spacing between touch targets */
.button-group {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}
```

### Mobile Navigation Pattern
```tsx
const MobileNav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="menu-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="Toggle menu"
      >
        <HamburgerIcon />
      </button>

      <nav className={`mobile-nav ${isOpen ? 'open' : ''}`}>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </nav>
    </>
  );
};

const styles = `
.mobile-nav {
  position: fixed;
  top: 60px;
  left: 0;
  right: 0;
  background: white;
  transform: translateY(-100%);
  transition: transform 0.3s ease;
}

.mobile-nav.open {
  transform: translateY(0);
}

@media (min-width: 768px) {
  .menu-toggle {
    display: none;
  }

  .mobile-nav {
    position: static;
    transform: none;
  }
}
`;
```

## Performance Optimization

### Lazy Loading
```tsx
import { lazy, Suspense } from 'react';

// Code splitting by route
const MobileView = lazy(() => import('./MobileView'));
const DesktopView = lazy(() => import('./DesktopView'));

const ResponsiveComponent: React.FC = () => {
  const isMobile = useBreakpoint() === 'mobile';

  return (
    <Suspense fallback={<LoadingSpinner />}>
      {isMobile ? <MobileView /> : <DesktopView />}
    </Suspense>
  );
};
```

### Responsive Loading Strategy
```tsx
// Load different data based on screen size
const useResponsiveData = () => {
  const breakpoint = useBreakpoint();

  useEffect(() => {
    const itemsToLoad = {
      mobile: 6,
      tablet: 12,
      desktop: 24,
      wide: 36,
    }[breakpoint];

    loadItems(itemsToLoad);
  }, [breakpoint]);
};
```

## Best Practices Checklist

### Design
- [ ] Start with mobile design first
- [ ] Use relative units (rem, em, %) over pixels
- [ ] Implement fluid typography with clamp()
- [ ] Create flexible grid systems
- [ ] Design touch-friendly interfaces (44px minimum)
- [ ] Plan for landscape and portrait orientations
- [ ] Test on actual devices, not just browser resize

### Implementation
- [ ] Use semantic HTML elements
- [ ] Implement proper heading hierarchy
- [ ] Optimize images for different screen sizes
- [ ] Use CSS Grid for page layouts
- [ ] Use Flexbox for component layouts
- [ ] Implement container queries for components
- [ ] Lazy load off-screen content
- [ ] Minimize layout shifts (CLS)

### Testing
- [ ] Test on multiple devices and browsers
- [ ] Verify touch interactions work properly
- [ ] Check performance on slow connections
- [ ] Test with browser DevTools device emulation
- [ ] Verify keyboard navigation works
- [ ] Test with screen readers
- [ ] Check color contrast at all sizes

## Common Patterns

### Holy Grail Layout
```css
.holy-grail {
  display: grid;
  min-height: 100vh;
  grid-template-rows: auto 1fr auto;
  gap: 1rem;
}

/* Mobile: Single column */
.holy-grail main {
  display: grid;
  gap: 1rem;
}

/* Desktop: Three columns */
@media (min-width: 1024px) {
  .holy-grail main {
    grid-template-columns: 200px 1fr 200px;
  }
}
```

### Card Grid with Auto-fit
```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(300px, 100%), 1fr));
  gap: clamp(1rem, 2vw, 2rem);
  padding: clamp(1rem, 2vw, 2rem);
}
```

## Resources

- [MDN Responsive Design](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)
- [CSS Tricks - Complete Guide to Grid](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [CSS Tricks - Complete Guide to Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
- [Web.dev - Responsive Images](https://web.dev/responsive-images/)
- [Container Queries Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Container_Queries)
- [Utopia - Fluid Responsive Design](https://utopia.fyi/)
