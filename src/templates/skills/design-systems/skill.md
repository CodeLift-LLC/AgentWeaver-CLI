# Design Systems Skill

## Purpose
Understand, extract, and apply design system tokens, patterns, and components consistently across projects. This skill ensures visual consistency, maintains brand identity, and accelerates development by providing reusable design foundations.

## What is a Design System?

A design system is a collection of reusable components, guided by clear standards, that can be assembled to build applications. It includes:

- **Design Tokens**: Foundational values (colors, spacing, typography)
- **Component Library**: Reusable UI components
- **Patterns**: Common UI patterns and layouts
- **Guidelines**: Usage rules and best practices
- **Documentation**: How to use the system

## Design Token Types

### Color Tokens

#### Semantic Color System
```yaml
# agentweaver.config.yml example
designSystem:
  colors:
    # Brand colors
    primary: "#3B82F6"        # Blue
    secondary: "#10B981"      # Green
    accent: "#F59E0B"         # Amber

    # Neutral colors
    gray:
      50: "#F9FAFB"
      100: "#F3F4F6"
      200: "#E5E7EB"
      300: "#D1D5DB"
      400: "#9CA3AF"
      500: "#6B7280"
      600: "#4B5563"
      700: "#374151"
      800: "#1F2937"
      900: "#111827"

    # Semantic colors
    success: "#10B981"        # Green
    warning: "#F59E0B"        # Amber
    error: "#EF4444"          # Red
    info: "#3B82F6"           # Blue

    # Surface colors
    background: "#FFFFFF"
    surface: "#F9FAFB"
    foreground: "#111827"
```

#### Tailwind CSS Integration
```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3B82F6',
          hover: '#2563EB',
          active: '#1D4ED8'
        },
        brand: {
          blue: '#3B82F6',
          green: '#10B981',
          amber: '#F59E0B'
        }
      }
    }
  }
};
```

#### CSS Variables
```css
:root {
  /* Brand colors */
  --color-primary: #3B82F6;
  --color-secondary: #10B981;
  --color-accent: #F59E0B;

  /* Semantic colors */
  --color-success: #10B981;
  --color-warning: #F59E0B;
  --color-error: #EF4444;
  --color-info: #3B82F6;

  /* Neutral scale */
  --color-gray-50: #F9FAFB;
  --color-gray-900: #111827;

  /* Surface colors */
  --color-background: #FFFFFF;
  --color-foreground: #111827;
}

[data-theme="dark"] {
  --color-background: #111827;
  --color-foreground: #F9FAFB;
}
```

### Typography Tokens

#### Type Scale
```yaml
designSystem:
  typography:
    fontFamily:
      sans: "Inter, system-ui, sans-serif"
      serif: "Georgia, serif"
      mono: "JetBrains Mono, monospace"

    fontSize:
      xs: "0.75rem"      # 12px
      sm: "0.875rem"     # 14px
      base: "1rem"       # 16px
      lg: "1.125rem"     # 18px
      xl: "1.25rem"      # 20px
      2xl: "1.5rem"      # 24px
      3xl: "1.875rem"    # 30px
      4xl: "2.25rem"     # 36px
      5xl: "3rem"        # 48px

    fontWeight:
      normal: 400
      medium: 500
      semibold: 600
      bold: 700

    lineHeight:
      tight: 1.25
      normal: 1.5
      relaxed: 1.75
```

#### Typography Components
```tsx
// Heading component with design system tokens
export function Heading({
  level = 1,
  children,
  className = ''
}: HeadingProps) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  const sizeClasses = {
    1: 'text-4xl md:text-5xl font-bold leading-tight',
    2: 'text-3xl md:text-4xl font-bold leading-tight',
    3: 'text-2xl md:text-3xl font-semibold leading-tight',
    4: 'text-xl md:text-2xl font-semibold leading-normal',
    5: 'text-lg md:text-xl font-medium leading-normal',
    6: 'text-base md:text-lg font-medium leading-normal'
  };

  return (
    <Tag className={`${sizeClasses[level]} ${className}`}>
      {children}
    </Tag>
  );
}
```

### Spacing Tokens

#### Spacing Scale
```yaml
designSystem:
  spacing:
    0: "0"
    1: "0.25rem"    # 4px
    2: "0.5rem"     # 8px
    3: "0.75rem"    # 12px
    4: "1rem"       # 16px
    5: "1.25rem"    # 20px
    6: "1.5rem"     # 24px
    8: "2rem"       # 32px
    10: "2.5rem"    # 40px
    12: "3rem"      # 48px
    16: "4rem"      # 64px
    20: "5rem"      # 80px
    24: "6rem"      # 96px
```

#### Consistent Spacing Usage
```tsx
// Card with design system spacing
export function Card({ children }: CardProps) {
  return (
    <div className="
      p-6          /* Padding: 24px */
      space-y-4    /* Vertical spacing between children: 16px */
      rounded-lg   /* Border radius: 8px */
      gap-4        /* Grid/flex gap: 16px */
    ">
      {children}
    </div>
  );
}
```

### Border Radius Tokens

```yaml
designSystem:
  borderRadius:
    none: "0"
    sm: "0.125rem"    # 2px
    default: "0.25rem" # 4px
    md: "0.375rem"    # 6px
    lg: "0.5rem"      # 8px
    xl: "0.75rem"     # 12px
    2xl: "1rem"       # 16px
    3xl: "1.5rem"     # 24px
    full: "9999px"    # Pill shape
```

### Shadow Tokens

```yaml
designSystem:
  boxShadow:
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)"
    default: "0 1px 3px 0 rgb(0 0 0 / 0.1)"
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1)"
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1)"
    2xl: "0 25px 50px -12px rgb(0 0 0 / 0.25)"
```

## Component Library Patterns

### Querying shadcn/ui MCP

#### List Available Components
```
Use: mcp__shadcn-ui-server__list-components
Returns: List of all available shadcn/ui components

Common components:
- button, card, dialog, input, label
- select, checkbox, radio-group, textarea
- dropdown-menu, popover, tooltip
- tabs, accordion, alert
- badge, avatar, separator
```

#### Get Component Documentation
```
Use: mcp__shadcn-ui-server__get-component-docs
Parameter: component: "button"

Returns:
- Component structure and patterns
- Props and variants
- Usage examples
- Accessibility features
- Best practices
```

### Adapting shadcn/ui Patterns

#### Step 1: Query Pattern
```
Query shadcn/ui for "button" component
```

#### Step 2: Review Structure
```tsx
// shadcn/ui button pattern (example)
interface ButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}
```

#### Step 3: Adapt to Project
```tsx
// Adapt to project's design system
import { cva, type VariantProps } from "class-variance-authority"

const buttonVariants = cva(
  // Base styles
  "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "bg-blue-600 text-white hover:bg-blue-700",      // Project primary color
        secondary: "bg-green-600 text-white hover:bg-green-700",  // Project secondary
        ghost: "hover:bg-gray-100 dark:hover:bg-gray-800",
        outline: "border border-gray-200 hover:bg-gray-100"
      },
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-10 px-4 text-base",
        lg: "h-11 px-8 text-lg"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "md"
    }
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ variant, size, className, ...props }: ButtonProps) {
  return (
    <button
      className={buttonVariants({ variant, size, className })}
      {...props}
    />
  )
}
```

### Component Composition Patterns

#### Compound Components
```tsx
// Card component family
export function Card({ children, className }: CardProps) {
  return (
    <div className={`rounded-lg border bg-white shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children }: CardHeaderProps) {
  return <div className="flex flex-col space-y-1.5 p-6">{children}</div>;
}

export function CardTitle({ children }: CardTitleProps) {
  return <h3 className="text-2xl font-semibold leading-none">{children}</h3>;
}

export function CardContent({ children }: CardContentProps) {
  return <div className="p-6 pt-0">{children}</div>;
}

export function CardFooter({ children }: CardFooterProps) {
  return <div className="flex items-center p-6 pt-0">{children}</div>;
}

// Usage
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
  <CardFooter>
    <button>Action</button>
  </CardFooter>
</Card>
```

## Style Guide Adherence

### Component Naming Conventions

#### PascalCase for Components
```tsx
// Good
export function UserProfile() {}
export function BlogPostCard() {}
export function NavigationMenu() {}

// Bad
export function userProfile() {}
export function blog_post_card() {}
export function navigation-menu() {}
```

#### Descriptive, Specific Names
```tsx
// Good: Clear purpose
export function PrimaryButton() {}
export function DangerAlert() {}
export function UserAvatarDropdown() {}

// Bad: Generic, unclear
export function Component1() {}
export function Thing() {}
export function Box() {}
```

### File Organization

```
src/
├── components/
│   ├── ui/              # Base design system components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── index.ts
│   ├── layout/          # Layout components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Sidebar.tsx
│   └── features/        # Feature-specific components
│       ├── UserProfile.tsx
│       └── BlogPostCard.tsx
├── design-system/
│   ├── tokens.ts        # Design tokens
│   ├── theme.ts         # Theme configuration
│   └── variants.ts      # Component variants
└── styles/
    ├── globals.css      # Global styles
    └── tailwind.css     # Tailwind imports
```

### Prop Naming Patterns

```tsx
// Boolean props: is/has/should prefix
interface ComponentProps {
  isOpen?: boolean;
  hasError?: boolean;
  shouldAutoFocus?: boolean;
  disabled?: boolean;     // Exception: common HTML props
}

// Event handlers: on prefix
interface ComponentProps {
  onClick?: () => void;
  onChange?: (value: string) => void;
  onSubmit?: (data: FormData) => void;
}

// Render props: render prefix or children
interface ComponentProps {
  renderHeader?: () => React.ReactNode;
  renderFooter?: (props: FooterProps) => React.ReactNode;
  children?: React.ReactNode;
}

// Variants and sizes: string union types
interface ComponentProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'green' | 'red';
}
```

## Design System Sources

### 1. agentweaver.config.yml
Always read this file first to understand project-specific design system configuration.

```yaml
# Example configuration
designSystem:
  # Colors
  primaryColor: "#3B82F6"
  secondaryColor: "#10B981"
  accentColor: "#F59E0B"

  # Typography
  fontFamily:
    sans: "Inter, system-ui, sans-serif"
    heading: "Poppins, sans-serif"

  # Component library
  componentLibrary: "shadcn/ui"

  # Accessibility
  wcagLevel: "AA"

  # Responsive breakpoints
  breakpoints:
    sm: "640px"
    md: "768px"
    lg: "1024px"
    xl: "1280px"
```

### 2. shadcn/ui MCP (Primary Source)
Use shadcn/ui MCP for component patterns and best practices.

**When to query:**
- Generating new components
- Need proven accessibility patterns
- Looking for component composition examples
- Want to understand component variants

**How to use:**
1. List components: `mcp__shadcn-ui-server__list-components`
2. Get docs: `mcp__shadcn-ui-server__get-component-docs` with `component: "name"`
3. Adapt pattern to project's framework and design tokens

### 3. Tailwind CSS Design System
Tailwind provides a comprehensive design system out of the box.

**Default Tailwind Tokens:**
- Colors: gray, red, orange, amber, yellow, lime, green, emerald, teal, cyan, sky, blue, indigo, violet, purple, fuchsia, pink, rose
- Spacing: 0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 72, 80, 96
- Font sizes: xs, sm, base, lg, xl, 2xl, 3xl, 4xl, 5xl, 6xl, 7xl, 8xl, 9xl
- Font weights: thin, extralight, light, normal, medium, semibold, bold, extrabold, black

**Extending Tailwind:**
```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      // Add custom tokens without removing defaults
      colors: {
        brand: {
          primary: '#3B82F6',
          secondary: '#10B981'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    }
  }
}
```

### 4. Figma Design System (Read-Only via MCP)
If Figma MCP is configured, use it to read existing designs (but cannot create).

**Use Figma MCP for:**
- Extracting design tokens from existing designs
- Understanding component specs
- Getting asset URLs
- Reading design documentation

**Limitations:**
- Cannot create new designs
- Cannot modify existing designs
- Read-only access

### 5. Custom Design Tokens File
Some projects may have a dedicated tokens file.

```ts
// design-system/tokens.ts
export const colors = {
  brand: {
    primary: '#3B82F6',
    secondary: '#10B981',
    accent: '#F59E0B'
  },
  semantic: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6'
  }
} as const;

export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem'
} as const;

export const typography = {
  fontFamily: {
    sans: 'Inter, system-ui, sans-serif',
    mono: 'JetBrains Mono, monospace'
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem'
  }
} as const;
```

## Workflow

### 1. Discover Design System
```
1. Read .claude/agentweaver.config.yml for design system config
2. Check for design-system/ or tokens/ directory
3. Review existing components for patterns
4. Query shadcn/ui MCP for component library patterns
5. Check Tailwind config for extended tokens
```

### 2. Extract Design Tokens
```
1. Identify colors (primary, secondary, neutral, semantic)
2. Identify typography scale (font families, sizes, weights)
3. Identify spacing scale (padding, margin, gap)
4. Identify border radius values
5. Identify shadow values
6. Document in design system format
```

### 3. Apply Tokens Consistently
```
1. Use design tokens in all components (no magic values)
2. Reference tokens via CSS variables or Tailwind classes
3. Ensure consistency across all components
4. Update tokens file if new tokens are needed
5. Document token usage in component props
```

### 4. Match Component Patterns
```
1. Query shadcn/ui for similar component
2. Review structure and variants
3. Adapt to project's design tokens
4. Maintain accessibility patterns
5. Document component variants
```

## Best Practices

### 1. No Magic Values
```tsx
// Bad: Magic values
<div style={{ padding: '17px', color: '#2a5db0' }}>

// Good: Design tokens
<div className="p-4 text-primary">
```

### 2. Semantic Token Names
```yaml
# Bad: Abstract names
color-1: "#3B82F6"
color-2: "#EF4444"

# Good: Semantic names
primary: "#3B82F6"
error: "#EF4444"
```

### 3. Consistent Component APIs
```tsx
// Good: Consistent variant/size pattern
<Button variant="primary" size="md">Submit</Button>
<Card variant="elevated" size="md">Content</Card>
<Badge variant="success" size="sm">New</Badge>
```

### 4. Theme-Aware Components
```tsx
// Good: Supports both light and dark mode
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
```

### 5. Documentation
```tsx
/**
 * Primary button component following the design system.
 *
 * Variants:
 * - primary: Blue background (brand primary color)
 * - secondary: Green background (brand secondary color)
 * - ghost: Transparent background
 *
 * Sizes:
 * - sm: 36px height, 12px padding
 * - md: 40px height, 16px padding
 * - lg: 44px height, 24px padding
 */
export function Button({ variant, size }: ButtonProps) {}
```

## Resources

- **shadcn/ui Documentation**: Component patterns and best practices
- **Tailwind CSS Documentation**: Design system tokens and utilities
- **Design Tokens W3C Spec**: Standard for design tokens
- **Material Design**: Design system principles
- **Apple Human Interface Guidelines**: Design standards
- **Refactoring UI**: Practical design system advice
