# Component Generation Skill

## Purpose
Generate production-ready UI components using modern frameworks, design systems, and accessibility best practices. This skill focuses on creating accessible, responsive, and maintainable components that follow industry standards.

## Capabilities

### Framework Support

#### React with TypeScript
```tsx
// Functional component with TypeScript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled = false,
  type = 'button'
}: ButtonProps) {
  // Component implementation
}
```

**Best Practices:**
- Use functional components with hooks
- Define TypeScript interfaces for all props
- Use React.FC sparingly (prefer explicit typing)
- Implement proper event handling types
- Use React.memo for performance when appropriate

#### Vue 3 with Composition API
```vue
<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: 'primary',
  size: 'md',
  disabled: false
});

const emit = defineEmits<{
  click: [event: MouseEvent]
}>();
</script>

<template>
  <button
    :class="buttonClasses"
    :disabled="disabled"
    @click="emit('click', $event)"
  >
    <slot />
  </button>
</template>
```

**Best Practices:**
- Use Composition API with <script setup>
- Define TypeScript interfaces for props and emits
- Use withDefaults for default prop values
- Leverage Vue's reactivity system properly
- Use slots for flexible content composition

#### Svelte with TypeScript
```svelte
<script lang="ts">
  export let variant: 'primary' | 'secondary' | 'ghost' = 'primary';
  export let size: 'sm' | 'md' | 'lg' = 'md';
  export let disabled: boolean = false;

  function handleClick(event: MouseEvent) {
    dispatch('click', event);
  }
</script>

<button
  class={buttonClasses}
  {disabled}
  on:click={handleClick}
>
  <slot />
</button>
```

**Best Practices:**
- Use TypeScript for type safety
- Export props with type annotations
- Use Svelte's reactive declarations ($:) when needed
- Leverage Svelte's built-in transitions and animations
- Keep components simple and focused

### Styling Approaches

#### Tailwind CSS (Recommended)
```tsx
export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 ${className}`}>
      {children}
    </div>
  );
}
```

**Benefits:**
- Utility-first approach
- Built-in responsive design
- Dark mode support with `dark:` prefix
- No CSS file management
- Purged unused styles in production

**Best Practices:**
- Use template literals for conditional classes
- Extract repeated classes to component variants
- Use arbitrary values sparingly (`[#1da1f2]`)
- Leverage Tailwind's design system (spacing, colors)
- Use @apply in CSS for complex repeated patterns

#### CSS Modules
```tsx
import styles from './Button.module.css';

export function Button({ variant, children }: ButtonProps) {
  return (
    <button className={`${styles.button} ${styles[variant]}`}>
      {children}
    </button>
  );
}
```

**Benefits:**
- Scoped CSS (no global conflicts)
- Traditional CSS syntax
- Works with preprocessors (SCSS, LESS)
- Good IDE support

#### Styled Components (CSS-in-JS)
```tsx
import styled from 'styled-components';

const StyledButton = styled.button<{ variant: string }>`
  padding: ${props => props.variant === 'sm' ? '0.5rem 1rem' : '0.75rem 1.5rem'};
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border-radius: 0.5rem;

  &:hover {
    background-color: ${props => props.theme.colors.primaryHover};
  }
`;

export function Button({ variant, children }: ButtonProps) {
  return <StyledButton variant={variant}>{children}</StyledButton>;
}
```

**Benefits:**
- Dynamic styling based on props
- Theme support
- No class name conflicts
- Co-located with component

### Accessibility (WCAG 2.1 AA)

#### Semantic HTML
Always use the correct semantic HTML elements:

```tsx
// Good: Semantic structure
<article className="blog-post">
  <header>
    <h2>Article Title</h2>
    <time dateTime="2025-11-04">November 4, 2025</time>
  </header>
  <p>Article content...</p>
  <footer>
    <nav aria-label="Article actions">
      <button>Share</button>
      <button>Save</button>
    </nav>
  </footer>
</article>

// Bad: Div soup
<div className="blog-post">
  <div>
    <div>Article Title</div>
    <div>November 4, 2025</div>
  </div>
  <div>Article content...</div>
</div>
```

#### ARIA Labels and Roles
```tsx
// Icon-only button needs label
<button aria-label="Close dialog" onClick={onClose}>
  <XIcon className="h-5 w-5" aria-hidden="true" />
</button>

// Complex widget needs role
<div
  role="tablist"
  aria-label="Account settings"
>
  <button
    role="tab"
    aria-selected={activeTab === 'profile'}
    aria-controls="profile-panel"
    id="profile-tab"
  >
    Profile
  </button>
</div>

// Search landmark
<form role="search" onSubmit={handleSearch}>
  <label htmlFor="search-input" className="sr-only">
    Search products
  </label>
  <input
    id="search-input"
    type="search"
    aria-label="Search products"
  />
</form>
```

#### Keyboard Navigation
```tsx
export function Dropdown({ items, onSelect }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        setIsOpen(!isOpen);
        break;
      case 'Escape':
        setIsOpen(false);
        break;
      case 'ArrowDown':
        event.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, items.length - 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
        break;
    }
  };

  return (
    <div onKeyDown={handleKeyDown}>
      <button
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        onClick={() => setIsOpen(!isOpen)}
      >
        Select option
      </button>
      {isOpen && (
        <ul role="listbox">
          {items.map((item, index) => (
            <li
              key={item.id}
              role="option"
              aria-selected={index === selectedIndex}
              tabIndex={0}
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

#### Focus Management
```tsx
// Visible focus indicator
<button className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
  Click me
</button>

// Skip to main content
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4"
>
  Skip to main content
</a>

// Focus trap in modal
import { useEffect, useRef } from 'react';

export function Modal({ isOpen, onClose, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      firstElement?.focus();
    }
  }, [isOpen]);

  return (
    <div ref={modalRef} role="dialog" aria-modal="true">
      {children}
    </div>
  );
}
```

#### Color Contrast (WCAG AA)
```tsx
// Good: 4.5:1 contrast for normal text
<p className="text-gray-900 dark:text-gray-100">
  This text has sufficient contrast
</p>

// Good: 3:1 contrast for large text (18pt+) and UI elements
<button className="bg-blue-600 text-white hover:bg-blue-700">
  Primary action
</button>

// Bad: Insufficient contrast
<p className="text-gray-400">This text fails WCAG AA</p>

// Use online contrast checkers:
// - WebAIM Contrast Checker
// - Colorable
// - Chrome DevTools Accessibility panel
```

### Responsive Design

#### Mobile-First Approach
```tsx
// Start with mobile, add complexity for larger screens
<div className="
  flex flex-col gap-4 p-4          /* Mobile: stack vertically, 16px spacing */
  md:flex-row md:gap-6 md:p-6     /* Tablet: horizontal, 24px spacing */
  lg:gap-8 lg:p-8                 /* Desktop: 32px spacing */
">
  <aside className="
    w-full                          /* Mobile: full width */
    md:w-64                         /* Tablet+: fixed 256px sidebar */
  ">
    Sidebar
  </aside>

  <main className="
    flex-1                          /* Take remaining space */
  ">
    Main content
  </main>
</div>
```

#### Breakpoint System
Standard Tailwind breakpoints:
- `sm`: 640px (large phones)
- `md`: 768px (tablets)
- `lg`: 1024px (laptops)
- `xl`: 1280px (desktops)
- `2xl`: 1536px (large desktops)

```tsx
// Responsive grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  {items.map(item => <Card key={item.id} {...item} />)}
</div>

// Responsive typography
<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
  Responsive heading
</h1>

// Show/hide elements
<button className="block md:hidden">Mobile menu</button>
<nav className="hidden md:block">Desktop navigation</nav>
```

#### Flexible Layouts
```tsx
// Flexbox for alignment
<div className="flex items-center justify-between">
  <h2>Title</h2>
  <button>Action</button>
</div>

// Grid for complex layouts
<div className="grid grid-cols-12 gap-4">
  <div className="col-span-12 md:col-span-8">Main</div>
  <div className="col-span-12 md:col-span-4">Sidebar</div>
</div>

// Container with max width
<div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
  <h1>Constrained width content</h1>
</div>
```

#### Touch-Friendly Interactions
```tsx
// Minimum 44x44px touch targets (WCAG 2.1)
<button className="min-h-[44px] min-w-[44px] p-3">
  <Icon className="h-5 w-5" />
</button>

// Larger spacing on mobile
<nav className="flex gap-2 md:gap-4">
  <button className="p-3 md:p-2">Option 1</button>
  <button className="p-3 md:p-2">Option 2</button>
</nav>
```

### Dark Mode Support

#### CSS Variables Approach
```css
:root {
  --color-background: #ffffff;
  --color-foreground: #000000;
  --color-primary: #3b82f6;
}

[data-theme="dark"] {
  --color-background: #1f2937;
  --color-foreground: #ffffff;
  --color-primary: #60a5fa;
}
```

```tsx
<div style={{
  backgroundColor: 'var(--color-background)',
  color: 'var(--color-foreground)'
}}>
  Content
</div>
```

#### Tailwind Dark Mode
```tsx
// Class-based (recommended)
// tailwind.config.js: darkMode: 'class'
<div className="bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
  <h1>Content that adapts to dark mode</h1>
</div>

// Media query-based
// tailwind.config.js: darkMode: 'media'
// Automatically uses system preference

// Dark mode toggle
export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
```

### Component Patterns

#### Compound Components
```tsx
// Parent component manages state
export function Tabs({ children, defaultValue }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabsContext.Provider>
  );
}

// Child components use context
export function TabsList({ children }: TabsListProps) {
  return <div role="tablist">{children}</div>;
}

export function TabsTrigger({ value, children }: TabsTriggerProps) {
  const { activeTab, setActiveTab } = useTabsContext();
  return (
    <button
      role="tab"
      aria-selected={activeTab === value}
      onClick={() => setActiveTab(value)}
    >
      {children}
    </button>
  );
}

// Usage
<Tabs defaultValue="profile">
  <TabsList>
    <TabsTrigger value="profile">Profile</TabsTrigger>
    <TabsTrigger value="settings">Settings</TabsTrigger>
  </TabsList>
  <TabsContent value="profile">Profile content</TabsContent>
  <TabsContent value="settings">Settings content</TabsContent>
</Tabs>
```

#### Render Props
```tsx
export function DataFetcher<T>({ url, children }: DataFetcherProps<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [url]);

  return children({ data, loading, error });
}

// Usage
<DataFetcher<User> url="/api/user">
  {({ data, loading, error }) => {
    if (loading) return <Spinner />;
    if (error) return <Error message={error.message} />;
    return <UserProfile user={data} />;
  }}
</DataFetcher>
```

#### Custom Hooks
```tsx
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener('change', listener);

    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}

// Usage
export function ResponsiveComponent() {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return isMobile ? <MobileView /> : <DesktopView />;
}
```

## Usage Guidelines

### When to Use This Skill
- Generating new UI components from scratch
- Creating component variants (button sizes, card styles)
- Building accessible, responsive layouts
- Implementing design system components
- Creating reusable component patterns

### Workflow
1. **Understand Requirements**: Read component requirements, use cases, design specs
2. **Check Design System**: Query shadcn/ui MCP or read agentweaver.config.yml
3. **Choose Pattern**: Select appropriate component pattern (simple, compound, hooks)
4. **Generate Code**: Create component with framework, styling, accessibility
5. **Add Responsive**: Ensure mobile-first responsive behavior
6. **Test Accessibility**: Verify WCAG AA compliance (semantic HTML, ARIA, keyboard, contrast)
7. **Document**: Add TypeScript types, prop documentation, usage examples
8. **Preview**: Generate visual preview for approval

### Component Template

```tsx
/**
 * [Component Name]
 *
 * [Brief description of component purpose and use cases]
 *
 * @example
 * ```tsx
 * <ComponentName
 *   prop1="value"
 *   prop2={true}
 * >
 *   Content
 * </ComponentName>
 * ```
 */

import { ComponentPropsWithoutRef, forwardRef } from 'react';

export interface ComponentNameProps extends ComponentPropsWithoutRef<'div'> {
  /** Description of prop1 */
  prop1: string;
  /** Description of prop2 (optional) */
  prop2?: boolean;
  /** Component children */
  children: React.ReactNode;
}

export const ComponentName = forwardRef<HTMLDivElement, ComponentNameProps>(
  ({ prop1, prop2 = false, children, className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`base-classes ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ComponentName.displayName = 'ComponentName';
```

## Resources

- **shadcn/ui**: Component patterns and best practices
- **WCAG 2.1 Guidelines**: https://www.w3.org/WAI/WCAG21/quickref/
- **WebAIM**: Accessibility articles and tools
- **MDN Web Docs**: HTML semantics and ARIA reference
- **Tailwind CSS Docs**: Utility classes and responsive design
- **React TypeScript Cheatsheet**: Type patterns for React
