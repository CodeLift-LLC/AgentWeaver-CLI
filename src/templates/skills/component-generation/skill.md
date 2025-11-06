---
name: Component Generation
description: Generate production-ready UI components using modern frameworks, design systems, and accessibility best practices. Framework-agnostic patterns for creating accessible, responsive, and maintainable components.
allowed-tools:
  - Read
  - Write
  - Edit
  - Grep
  - Bash
  - WebFetch
tags:
  - ui
  - components
  - accessibility
  - responsive
  - design-system
mcp-servers:
  - shadcn-ui-server
  - context7
---

# Component Generation Skill

This skill provides production-ready patterns for generating UI components that follow industry standards for accessibility, responsiveness, and maintainability across any modern UI framework.

## 🎯 Before You Start

**IMPORTANT**: When using this skill, follow these steps:

1. **Build a Todo List**: Use TodoWrite to break down the implementation into clear steps
2. **Gather Clarification**: Ask about requirements, constraints, and expected outcomes
3. **Understand Context**: Read existing code patterns and project conventions
4. **Execute Transparently**: Mark todos in_progress/completed as you work
5. **Validate**: Test your implementation and verify it meets requirements

**Example approach for this skill**:
Understand component requirements and design specs, choose appropriate component pattern, implement with accessibility best practices, ensure responsive behavior, validate WCAG compliance, and document usage examples.

**Additional tools available**:
- Use shadcn/ui MCP for component patterns and design system guidance
- Use Context7 MCP for framework-specific component documentation

## When to Use

- Generating new UI components from scratch
- Creating component variants (button sizes, card styles, theme variations)
- Building accessible, responsive layouts
- Implementing design system components
- Creating reusable component patterns
- Refactoring existing components to improve accessibility or responsiveness

## Core Concepts

### Universal Component Architecture

Every UI component, regardless of framework, should follow this structure:

```
Component
├─> Props/Inputs (with type safety)
├─> State Management (internal component state)
├─> Lifecycle/Effects (mounting, updates, cleanup)
├─> Event Handlers (user interactions)
├─> Computed/Derived Values
├─> Render Logic (template/JSX)
└─> Styling (CSS/utility classes)
```

## Universal Implementation Pattern

### 1. Component Interface Definition (Framework-Agnostic)

#### Button Component Interface

```
Interface ButtonComponent:
  Props:
    - variant: 'primary' | 'secondary' | 'ghost' | 'danger'
    - size: 'sm' | 'md' | 'lg'
    - disabled: boolean
    - loading: boolean
    - type: 'button' | 'submit' | 'reset'
    - ariaLabel: string (optional)
    - onClick: function (optional)
    - children: ReactNode | string

  State:
    - isPressed: boolean (for visual feedback)
    - isFocused: boolean (for focus management)

  Methods:
    - handleClick(event): void
    - handleKeyDown(event): void (for keyboard accessibility)

  Computed:
    - classes: string (computed from variant, size, disabled, loading)
    - isClickable: boolean (not disabled and not loading)
```

#### Card Component Interface

```
Interface CardComponent:
  Props:
    - variant: 'default' | 'bordered' | 'elevated'
    - padding: 'none' | 'sm' | 'md' | 'lg'
    - clickable: boolean
    - header: ReactNode (optional)
    - footer: ReactNode (optional)
    - children: ReactNode

  Methods:
    - handleClick(event): void (if clickable)

  Computed:
    - containerClasses: string
    - shouldRenderHeader: boolean
    - shouldRenderFooter: boolean
```

### 2. Type Safety Pattern (Language-Agnostic)

```
// Define strict types for props
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'
type ButtonType = 'button' | 'submit' | 'reset'

interface ButtonProps:
  variant?: ButtonVariant = 'primary'
  size?: ButtonSize = 'md'
  disabled?: boolean = false
  loading?: boolean = false
  type?: ButtonType = 'button'
  ariaLabel?: string
  onClick?: (event: MouseEvent) => void
  children: ReactNode | string

// Validate prop types at runtime (if language supports it)
function validateButtonProps(props: ButtonProps):
  if props.variant not in ['primary', 'secondary', 'ghost', 'danger']:
    throw Error('Invalid variant')
  if props.size not in ['sm', 'md', 'lg']:
    throw Error('Invalid size')
  // ... more validation
```

### 3. Styling Pattern (Framework-Agnostic)

#### Utility-First Approach (Tailwind/UnoCSS/WindiCSS style)

```
function computeButtonClasses(variant, size, disabled, loading):
  baseClasses = [
    'inline-flex',
    'items-center',
    'justify-center',
    'font-medium',
    'rounded-md',
    'transition-colors',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2'
  ]

  // Variant classes
  variantClasses = {
    'primary': ['bg-blue-600', 'text-white', 'hover:bg-blue-700', 'focus:ring-blue-500'],
    'secondary': ['bg-gray-200', 'text-gray-900', 'hover:bg-gray-300', 'focus:ring-gray-500'],
    'ghost': ['bg-transparent', 'text-gray-700', 'hover:bg-gray-100', 'focus:ring-gray-500'],
    'danger': ['bg-red-600', 'text-white', 'hover:bg-red-700', 'focus:ring-red-500']
  }

  // Size classes
  sizeClasses = {
    'sm': ['text-sm', 'px-3', 'py-1.5', 'min-h-[36px]'],
    'md': ['text-base', 'px-4', 'py-2', 'min-h-[40px]'],
    'lg': ['text-lg', 'px-6', 'py-3', 'min-h-[44px]']
  }

  // State classes
  stateClasses = []
  if disabled or loading:
    stateClasses.push('opacity-50', 'cursor-not-allowed', 'pointer-events-none')

  return joinClasses(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    stateClasses
  )
```

#### CSS Modules / Scoped CSS Approach

```
/* button.module.css */
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  border-radius: 0.375rem;
  transition: all 0.2s;
}

.button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
}

.primary {
  background-color: #3b82f6;
  color: white;
}

.primary:hover:not(:disabled) {
  background-color: #2563eb;
}

.secondary {
  background-color: #e5e7eb;
  color: #1f2937;
}

.sm {
  font-size: 0.875rem;
  padding: 0.375rem 0.75rem;
}

.md {
  font-size: 1rem;
  padding: 0.5rem 1rem;
}

.lg {
  font-size: 1.125rem;
  padding: 0.75rem 1.5rem;
}

.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
```

### 4. Accessibility Pattern (WCAG 2.1 AA Universal)

#### Semantic HTML Structure

```
Component Structure:
├─> Use correct HTML elements (button, nav, article, aside, etc.)
├─> Provide text alternatives for images (alt text)
├─> Use headings in hierarchical order (h1 -> h2 -> h3)
├─> Label all form inputs
├─> Use semantic landmarks (header, main, nav, footer)
└─> Ensure meaningful link text
```

**Example Pattern:**
```html
<!-- Good: Semantic structure -->
<article role="article">
  <header>
    <h2>Article Title</h2>
    <time datetime="2025-11-04">November 4, 2025</time>
  </header>
  <p>Article content...</p>
  <footer>
    <nav aria-label="Article actions">
      <button>Share</button>
      <button>Save</button>
    </nav>
  </footer>
</article>

<!-- Bad: Div soup (avoid this) -->
<div class="article">
  <div class="header">
    <div class="title">Article Title</div>
    <div class="date">November 4, 2025</div>
  </div>
  <div class="content">Article content...</div>
</div>
```

#### ARIA Labels and Roles Pattern

```
function createAccessibleButton(props):
  element = createElement('button')
  element.type = props.type || 'button'

  // Add ARIA label if text is not visible
  if props.iconOnly:
    element.setAttribute('aria-label', props.ariaLabel || props.defaultLabel)

    // Hide decorative icons from screen readers
    iconElement = element.querySelector('svg, img')
    if iconElement:
      iconElement.setAttribute('aria-hidden', 'true')

  // Add disabled state
  if props.disabled:
    element.setAttribute('aria-disabled', 'true')
    element.disabled = true

  // Add loading state
  if props.loading:
    element.setAttribute('aria-busy', 'true')

  return element
```

**Common ARIA Patterns:**
```
Button with icon only:
  <button aria-label="Close dialog">
    <CloseIcon aria-hidden="true" />
  </button>

Tabs widget:
  <div role="tablist" aria-label="Account settings">
    <button
      role="tab"
      aria-selected="true|false"
      aria-controls="panel-id"
      id="tab-id"
    >
      Tab label
    </button>
  </div>
  <div role="tabpanel" id="panel-id" aria-labelledby="tab-id">
    Panel content
  </div>

Search form:
  <form role="search">
    <label for="search-input">Search products</label>
    <input id="search-input" type="search" />
  </form>
```

#### Keyboard Navigation Pattern

```
function handleKeyboardNavigation(event, state):
  key = event.key

  switch key:
    case 'Enter':
    case ' ' (Space):
      event.preventDefault()
      activateCurrentItem(state.selectedIndex)
      break

    case 'Escape':
      closeDropdown()
      returnFocusToTrigger()
      break

    case 'ArrowDown':
      event.preventDefault()
      state.selectedIndex = min(state.selectedIndex + 1, state.items.length - 1)
      scrollIntoView(state.selectedIndex)
      break

    case 'ArrowUp':
      event.preventDefault()
      state.selectedIndex = max(state.selectedIndex - 1, 0)
      scrollIntoView(state.selectedIndex)
      break

    case 'Home':
      event.preventDefault()
      state.selectedIndex = 0
      scrollIntoView(0)
      break

    case 'End':
      event.preventDefault()
      state.selectedIndex = state.items.length - 1
      scrollIntoView(state.items.length - 1)
      break

    case 'Tab':
      // Allow default tab behavior
      closeDropdown()
      break
```

#### Focus Management Pattern

```
// Focus indicator (always visible, never remove outline without replacement)
CSS:
  button:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }

  /* Alternative with ring */
  button:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
  }

// Focus trap for modals
function trapFocus(containerElement):
  focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  focusableElements = containerElement.querySelectorAll(focusableSelectors)
  firstElement = focusableElements[0]
  lastElement = focusableElements[focusableElements.length - 1]

  // Focus first element on open
  firstElement.focus()

  // Handle tab key
  containerElement.addEventListener('keydown', (event) => {
    if event.key !== 'Tab':
      return

    if event.shiftKey: // Shift + Tab
      if document.activeElement === firstElement:
        event.preventDefault()
        lastElement.focus()
    else: // Tab
      if document.activeElement === lastElement:
        event.preventDefault()
        firstElement.focus()
  })

// Skip to main content link
HTML:
  <a
    href="#main-content"
    class="skip-link" // sr-only by default, visible on focus
  >
    Skip to main content
  </a>

  <main id="main-content">
    <!-- Page content -->
  </main>

CSS:
  .skip-link {
    position: absolute;
    top: -40px;
    left: 0;
    background: #000;
    color: #fff;
    padding: 8px;
    text-decoration: none;
    z-index: 100;
  }

  .skip-link:focus {
    top: 0;
  }
```

#### Color Contrast Requirements (WCAG AA)

```
Color Contrast Ratios:
├─> Normal text (< 18pt): 4.5:1 minimum
├─> Large text (≥ 18pt or ≥ 14pt bold): 3:1 minimum
├─> UI components and graphics: 3:1 minimum
└─> Inactive/disabled elements: no requirement

Good Contrast Combinations:
├─> Black (#000000) on White (#FFFFFF): 21:1 ✅
├─> Dark Gray (#1f2937) on White (#FFFFFF): 16.1:1 ✅
├─> Blue (#3b82f6) on White (#FFFFFF): 4.5:1 ✅
├─> White (#FFFFFF) on Blue (#3b82f6): 4.5:1 ✅
└─> Light Gray (#9ca3af) on White (#FFFFFF): 2.8:1 ❌ (fails AA)

Tools for Checking:
├─> WebAIM Contrast Checker (https://webaim.org/resources/contrastchecker/)
├─> Colorable (https://colorable.jxnblk.com/)
├─> Chrome DevTools Accessibility panel
└─> axe DevTools browser extension
```

### 5. Responsive Design Pattern (Universal)

#### Mobile-First Approach

```
Breakpoint System:
├─> xs: 0-639px (mobile phones)
├─> sm: 640px-767px (large phones)
├─> md: 768px-1023px (tablets)
├─> lg: 1024px-1279px (laptops)
├─> xl: 1280px-1535px (desktops)
└─> 2xl: 1536px+ (large desktops)

Mobile-First Pattern:
1. Start with mobile styles (base, no media query)
2. Add complexity at larger breakpoints
3. Use min-width media queries

Example:
  /* Mobile (base) */
  .container {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  /* Tablet (md+) */
  @media (min-width: 768px) {
    .container {
      padding: 24px;
      flex-direction: row;
      gap: 24px;
    }
  }

  /* Desktop (lg+) */
  @media (min-width: 1024px) {
    .container {
      padding: 32px;
      gap: 32px;
      max-width: 1280px;
      margin: 0 auto;
    }
  }
```

#### Responsive Typography

```
Typography Scale:
Mobile → Desktop

Headings:
├─> h1: 24px → 32px → 40px → 48px
├─> h2: 20px → 24px → 30px → 36px
├─> h3: 18px → 20px → 24px → 28px
├─> h4: 16px → 18px → 20px → 22px
├─> h5: 14px → 16px → 18px → 20px
└─> h6: 14px → 14px → 16px → 18px

Body:
├─> base: 14px → 16px
├─> small: 12px → 14px
└─> large: 16px → 18px

Line Height:
├─> Headings: 1.2 - 1.3
├─> Body: 1.5 - 1.75
└─> Small text: 1.4 - 1.6
```

#### Flexible Layouts

```
// Grid Layout Pattern
.grid-container {
  display: grid;
  gap: 16px;

  /* Mobile: 1 column */
  grid-template-columns: 1fr;

  /* Tablet: 2 columns */
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  /* Desktop: 3-4 columns */
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: 1280px) {
    grid-template-columns: repeat(4, 1fr);
  }
}

// Flexbox Layout Pattern
.flex-container {
  display: flex;
  gap: 16px;

  /* Mobile: column (stack) */
  flex-direction: column;

  /* Tablet+: row */
  @media (min-width: 768px) {
    flex-direction: row;
  }
}

// Container with max-width
.container {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 16px;

  @media (min-width: 640px) {
    padding: 0 24px;
  }

  @media (min-width: 1024px) {
    padding: 0 32px;
  }
}
```

#### Touch-Friendly Interactions

```
Touch Target Requirements (WCAG 2.1 Level AAA):
├─> Minimum size: 44x44 pixels
├─> Spacing between targets: 8px minimum
├─> Larger targets on mobile (48x48px recommended)
└─> Visual feedback on tap (active state)

Pattern:
  .button {
    min-height: 44px;
    min-width: 44px;
    padding: 12px 16px;

    /* Larger on mobile */
    @media (max-width: 767px) {
      min-height: 48px;
      min-width: 48px;
      padding: 14px 20px;
    }
  }

  .button:active {
    transform: scale(0.98);
    opacity: 0.9;
  }
```

### 6. Dark Mode Pattern (Universal)

#### CSS Variables Approach

```css
/* Define color tokens */
:root {
  --color-background: #ffffff;
  --color-foreground: #000000;
  --color-primary: #3b82f6;
  --color-secondary: #6b7280;
  --color-border: #e5e7eb;
  --color-accent: #8b5cf6;
}

/* Dark mode overrides */
[data-theme="dark"],
.dark {
  --color-background: #111827;
  --color-foreground: #f9fafb;
  --color-primary: #60a5fa;
  --color-secondary: #9ca3af;
  --color-border: #374151;
  --color-accent: #a78bfa;
}

/* Usage */
.component {
  background-color: var(--color-background);
  color: var(--color-foreground);
  border: 1px solid var(--color-border);
}
```

#### Theme Toggle Implementation

```
function initializeTheme():
  // Check for saved preference
  savedTheme = localStorage.getItem('theme')

  if savedTheme:
    applyTheme(savedTheme)
  else:
    // Use system preference
    prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    applyTheme(prefersDark ? 'dark' : 'light')

function applyTheme(theme):
  if theme === 'dark':
    document.documentElement.classList.add('dark')
    document.documentElement.setAttribute('data-theme', 'dark')
  else:
    document.documentElement.classList.remove('dark')
    document.documentElement.setAttribute('data-theme', 'light')

  localStorage.setItem('theme', theme)

function toggleTheme():
  currentTheme = document.documentElement.getAttribute('data-theme')
  newTheme = currentTheme === 'dark' ? 'light' : 'dark'
  applyTheme(newTheme)

// Listen for system preference changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if !localStorage.getItem('theme'):
    applyTheme(e.matches ? 'dark' : 'light')
})
```

### 7. Component Patterns (Framework-Agnostic)

#### Compound Components Pattern

```
Concept: Parent component manages shared state, child components use that state

Structure:
ParentComponent
├─> Manages: activeTab state
├─> Provides: context with { activeTab, setActiveTab }
└─> Children:
    ├─> TabsList (renders tab buttons)
    ├─> TabsTrigger (individual tab button)
    └─> TabsContent (panel for each tab)

Pseudocode:
  class TabsComponent:
    state:
      activeTab: string

    constructor(defaultTab):
      this.activeTab = defaultTab

    setActiveTab(tab):
      this.activeTab = tab

    render():
      return Context.Provider({
        value: { activeTab: this.activeTab, setActiveTab: this.setActiveTab },
        children: this.props.children
      })

  class TabsTrigger:
    render():
      context = useContext(TabsContext)
      return Button({
        role: 'tab',
        ariaSelected: context.activeTab === this.props.value,
        onClick: () => context.setActiveTab(this.props.value),
        children: this.props.children
      })

Usage:
  <Tabs defaultValue="profile">
    <TabsList>
      <TabsTrigger value="profile">Profile</TabsTrigger>
      <TabsTrigger value="settings">Settings</TabsTrigger>
    </TabsList>
    <TabsContent value="profile">Profile content</TabsContent>
    <TabsContent value="settings">Settings content</TabsContent>
  </Tabs>
```

#### Render Props / Children Function Pattern

```
Concept: Pass rendering control to parent via function

Pseudocode:
  class DataFetcher:
    state:
      data: null
      loading: true
      error: null

    onMount():
      fetch(this.props.url)
        .then(response => response.json())
        .then(data => this.setState({ data, loading: false }))
        .catch(error => this.setState({ error, loading: false }))

    render():
      return this.props.children({
        data: this.state.data,
        loading: this.state.loading,
        error: this.state.error
      })

Usage:
  <DataFetcher url="/api/users">
    {({ data, loading, error }) => {
      if (loading) return <Spinner />
      if (error) return <ErrorMessage error={error} />
      return <UserList users={data} />
    }}
  </DataFetcher>
```

#### Slots Pattern (Web Components style)

```
Concept: Named placeholders for content injection

Structure:
  <Card>
    <slot name="header">
      <!-- Default header content -->
    </slot>

    <slot>
      <!-- Default main content -->
    </slot>

    <slot name="footer">
      <!-- Default footer content -->
    </slot>
  </Card>

Usage:
  <Card>
    <div slot="header">
      <h2>Card Title</h2>
    </div>

    <p>Main content goes here</p>

    <div slot="footer">
      <button>Action</button>
    </div>
  </Card>
```

## Component Development Workflow

### Step-by-Step Process

```
1. Requirements Analysis
   ├─> Identify component purpose and use cases
   ├─> List required props and variants
   ├─> Determine interaction patterns
   └─> Check existing design system

2. Interface Definition
   ├─> Define prop types and defaults
   ├─> Define state variables
   ├─> Define event handlers
   └─> Define computed values

3. Accessibility Planning
   ├─> Choose semantic HTML element
   ├─> Plan ARIA attributes
   ├─> Define keyboard interactions
   ├─> Ensure color contrast
   └─> Plan focus management

4. Responsive Design
   ├─> Design mobile layout (base)
   ├─> Plan tablet adaptations
   ├─> Plan desktop enhancements
   └─> Consider touch vs mouse interactions

5. Implementation
   ├─> Create component structure
   ├─> Implement styling (utility classes or CSS modules)
   ├─> Add event handlers
   ├─> Implement accessibility features
   └─> Add dark mode support

6. Testing
   ├─> Test keyboard navigation
   ├─> Test screen reader compatibility
   ├─> Test responsive breakpoints
   ├─> Test dark mode
   ├─> Verify color contrast (WCAG AA)
   └─> Test with real content

7. Documentation
   ├─> Document prop types
   ├─> Provide usage examples
   ├─> Document accessibility features
   ├─> Note browser compatibility
   └─> Include visual preview
```

## Common Component Templates

### Button Component Checklist

```
- [ ] Define variants (primary, secondary, ghost, danger)
- [ ] Define sizes (sm, md, lg with 44px min height)
- [ ] Support disabled state
- [ ] Support loading state
- [ ] Support icon-only mode with aria-label
- [ ] Support type attribute (button, submit, reset)
- [ ] Implement focus visible indicator
- [ ] Ensure 4.5:1 color contrast
- [ ] Add dark mode support
- [ ] Support keyboard activation (Enter, Space)
- [ ] Forward ref to underlying element
- [ ] Document all props
```

### Card Component Checklist

```
- [ ] Define variants (default, bordered, elevated)
- [ ] Support header slot/section
- [ ] Support footer slot/section
- [ ] Define padding options
- [ ] Support clickable variant (with hover/focus states)
- [ ] Use semantic HTML (article, section, div based on content)
- [ ] Ensure responsive padding
- [ ] Add dark mode support
- [ ] Support custom className for extension
- [ ] Document composition patterns
```

### Form Input Component Checklist

```
- [ ] Support label (always visible or visually hidden)
- [ ] Support required attribute
- [ ] Support disabled state
- [ ] Support error state with message
- [ ] Support helper text
- [ ] Link label to input (htmlFor/id)
- [ ] Ensure visible focus indicator
- [ ] Support multiple input types (text, email, password, etc.)
- [ ] Implement aria-invalid on error
- [ ] Implement aria-describedby for helper/error text
- [ ] Ensure label meets contrast requirements
- [ ] Add dark mode support
```

## Framework-Specific Implementation Examples

For framework-specific code examples, use the Context7 MCP or shadcn/ui MCP to fetch documentation:

**React Ecosystem:**
- React with TypeScript functional components
- React with hooks (useState, useEffect, useRef, custom hooks)
- React with forwardRef for ref passing
- React with Context API for compound components

**Vue Ecosystem:**
- Vue 3 Composition API with `<script setup>`
- Vue 3 with TypeScript
- Vue 3 with defineProps and defineEmits
- Vue 3 with slots and scoped slots

**Svelte Ecosystem:**
- Svelte with TypeScript
- Svelte with reactive declarations ($:)
- Svelte with event dispatchers
- Svelte with transitions and animations

**Web Components:**
- Custom Elements API
- Shadow DOM for encapsulation
- HTML Templates and Slots

**Angular:**
- Angular components with TypeScript
- Angular with @Input and @Output decorators
- Angular with services for shared state
- Angular with ng-content for content projection

**Solid.js:**
- Solid with TypeScript
- Solid with createSignal and createEffect
- Solid with props and children

**Qwik:**
- Qwik components with $
- Qwik with useSignal
- Qwik with Slots API

## Resources

**Query Context7 MCP for:**
- "[Your Framework] component best practices"
- "[Your Framework] TypeScript patterns"
- "[Your Framework] accessibility examples"
- "[Your Framework] responsive design"

**Query shadcn/ui MCP for:**
- Component patterns (button, card, dialog, dropdown, etc.)
- Accessibility implementations
- Tailwind styling patterns

**Standards and Guidelines:**
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Articles](https://webaim.org/articles/)
- [MDN Web Docs - HTML](https://developer.mozilla.org/en-US/docs/Web/HTML)
- [MDN Web Docs - ARIA](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA)

**Tools:**
- axe DevTools (browser extension for accessibility testing)
- Lighthouse (Chrome DevTools for performance and accessibility audits)
- WebAIM Contrast Checker
- Screen readers: NVDA (Windows), JAWS (Windows), VoiceOver (macOS/iOS), TalkBack (Android)
