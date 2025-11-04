---
name: UI Accessibility
description: Comprehensive accessibility patterns for building inclusive web applications following WCAG guidelines, ARIA best practices, and semantic HTML standards.
allowed-tools:
  - Read
  - Write
  - Edit
tags:
  - ui
  - accessibility
  - a11y
  - wcag
  - aria
  - inclusive-design
---

# UI Accessibility Skill

Build inclusive, accessible web applications that work for all users, including those using assistive technologies like screen readers, keyboard navigation, and alternative input devices.

## When to Use

- Building any user-facing web application
- Ensuring compliance with WCAG 2.1 AA standards
- Supporting users with disabilities
- Improving keyboard navigation and focus management
- Implementing screen reader-friendly interfaces
- Creating accessible forms, modals, and interactive components

## Core Principles (POUR)

### 1. Perceivable
Information and UI components must be presentable to users in ways they can perceive.

**Key Requirements:**
- Text alternatives for non-text content
- Captions and alternatives for multimedia
- Content can be presented in different ways without losing information
- Sufficient color contrast (4.5:1 for normal text, 3:1 for large text)

### 2. Operable
UI components and navigation must be operable.

**Key Requirements:**
- All functionality available from keyboard
- Users have enough time to read and use content
- Content doesn't cause seizures (no flashing more than 3 times per second)
- Users can easily navigate and find content

### 3. Understandable
Information and operation of UI must be understandable.

**Key Requirements:**
- Text is readable and understandable
- Web pages appear and operate in predictable ways
- Users are helped to avoid and correct mistakes

### 4. Robust
Content must be robust enough to be interpreted by assistive technologies.

**Key Requirements:**
- Maximize compatibility with current and future user tools
- Use valid, semantic HTML
- Proper ARIA implementation when HTML semantics aren't sufficient

## WCAG 2.1 AA Compliance Checklist

### Level A (Must Have)
- [ ] Non-text content has text alternatives
- [ ] Audio and video content has alternatives
- [ ] Content is keyboard accessible
- [ ] Users can control time limits
- [ ] No content flashes more than 3 times per second
- [ ] Skip navigation links provided
- [ ] Page titles are descriptive
- [ ] Focus order is logical
- [ ] Link purpose is clear from context
- [ ] Default language is identified

### Level AA (Should Have)
- [ ] Live captions for video
- [ ] Audio description for video
- [ ] Color contrast ratio of at least 4.5:1 (3:1 for large text)
- [ ] Text can be resized to 200% without loss of functionality
- [ ] Images of text are avoided (except logos)
- [ ] Visual presentation has sufficient line spacing and paragraph width
- [ ] Headings and labels are descriptive
- [ ] Focus is visible
- [ ] Multiple ways to find pages (search, sitemap, navigation)
- [ ] Section headings organize content

## Semantic HTML Patterns

### Document Structure
```tsx
// ✅ Good: Semantic HTML
const Layout: React.FC = () => (
  <>
    <header>
      <nav aria-label="Main navigation">
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
        </ul>
      </nav>
    </header>

    <main id="main-content">
      <article>
        <h1>Page Title</h1>
        <section>
          <h2>Section Heading</h2>
          <p>Content...</p>
        </section>
      </article>

      <aside aria-label="Related content">
        <h2>Related Articles</h2>
      </aside>
    </main>

    <footer>
      <p>&copy; 2025 Company Name</p>
    </footer>
  </>
);

// ❌ Bad: Div soup
const BadLayout: React.FC = () => (
  <div className="header">
    <div className="nav">...</div>
  </div>
);
```

### Heading Hierarchy
```tsx
// ✅ Good: Proper heading hierarchy
const Page: React.FC = () => (
  <>
    <h1>Main Page Title</h1>
    <section>
      <h2>Section 1</h2>
      <h3>Subsection 1.1</h3>
      <h3>Subsection 1.2</h3>
    </section>
    <section>
      <h2>Section 2</h2>
    </section>
  </>
);

// ❌ Bad: Skipping heading levels
const BadPage: React.FC = () => (
  <>
    <h1>Title</h1>
    <h4>Subsection</h4> {/* Skipped h2 and h3 */}
  </>
);
```

## ARIA Landmarks and Labels

### Landmark Roles
```tsx
// Use semantic HTML when possible, ARIA when needed
const App: React.FC = () => (
  <>
    <header role="banner"> {/* role="banner" is implicit on <header> */}
      <nav aria-label="Main navigation">
        <ul>...</ul>
      </nav>
      <nav aria-label="Breadcrumb navigation">
        <ol>...</ol>
      </nav>
    </header>

    <main role="main"> {/* role="main" is implicit on <main> */}
      <section aria-labelledby="section-1-heading">
        <h2 id="section-1-heading">Section Title</h2>
      </section>
    </main>

    <aside role="complementary" aria-label="Related content">
      {/* Sidebar content */}
    </aside>

    <footer role="contentinfo"> {/* role="contentinfo" is implicit on <footer> */}
      <p>Footer content</p>
    </footer>
  </>
);
```

### ARIA Labels vs. aria-labelledby
```tsx
// aria-label: Direct string label
<button aria-label="Close dialog">
  <XIcon />
</button>

// aria-labelledby: Reference to existing element
<section aria-labelledby="products-heading">
  <h2 id="products-heading">Our Products</h2>
  {/* ... */}
</section>

// aria-describedby: Additional description
<input
  type="email"
  id="email"
  aria-describedby="email-hint email-error"
/>
<div id="email-hint">We'll never share your email</div>
<div id="email-error" role="alert">Invalid email format</div>
```

## Keyboard Navigation

### Focus Management
```tsx
import { useRef, useEffect } from 'react';

// Focus trap for modal dialogs
const Modal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
  children
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Save currently focused element
      previousActiveElement.current = document.activeElement as HTMLElement;

      // Focus first focusable element in modal
      const firstFocusable = modalRef.current?.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      firstFocusable?.focus();
    } else {
      // Restore focus when modal closes
      previousActiveElement.current?.focus();
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }

    // Tab key handling for focus trap
    if (e.key === 'Tab') {
      const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (!focusableElements || focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      ref={modalRef}
      onKeyDown={handleKeyDown}
    >
      <h2 id="modal-title">Modal Title</h2>
      {children}
      <button onClick={onClose}>Close</button>
    </div>
  );
};
```

### Skip Links
```tsx
// Allow keyboard users to skip navigation
const SkipLink: React.FC = () => (
  <a
    href="#main-content"
    className="skip-link"
  >
    Skip to main content
  </a>
);

// CSS
const styles = `
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
`;
```

### Keyboard Event Handling
```tsx
// Custom interactive component with keyboard support
interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

const CustomButton: React.FC<ButtonProps> = ({ onClick, children }) => (
  <div
    role="button"
    tabIndex={0}
    onClick={onClick}
    onKeyDown={(e) => {
      // Enter or Space activates button
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick();
      }
    }}
  >
    {children}
  </div>
);

// ✅ Better: Use native <button> when possible
const NativeButton: React.FC<ButtonProps> = ({ onClick, children }) => (
  <button onClick={onClick}>
    {children}
  </button>
);
```

## Screen Reader Patterns

### Live Regions
```tsx
// Announce dynamic content changes
const SearchResults: React.FC = () => {
  const [results, setResults] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  return (
    <div>
      <input
        type="search"
        aria-label="Search products"
        onChange={handleSearch}
      />

      {/* Announce search status */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {isSearching && 'Searching...'}
        {!isSearching && results.length > 0 &&
          `Found ${results.length} results`}
      </div>

      {/* Results list */}
      <ul aria-label="Search results">
        {results.map(result => (
          <li key={result}>{result}</li>
        ))}
      </ul>
    </div>
  );
};

// CSS for screen reader only content
const srOnlyStyles = `
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
`;
```

### ARIA States and Properties
```tsx
// Expandable/collapsible content
const Accordion: React.FC = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <button
        aria-expanded={expanded}
        aria-controls="accordion-content"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? 'Collapse' : 'Expand'} Section
      </button>

      <div
        id="accordion-content"
        hidden={!expanded}
        role="region"
        aria-labelledby="accordion-button"
      >
        <p>Accordion content goes here</p>
      </div>
    </div>
  );
};

// Loading states
const LoadingButton: React.FC<{ isLoading: boolean }> = ({ isLoading }) => (
  <button
    disabled={isLoading}
    aria-busy={isLoading}
  >
    {isLoading ? (
      <>
        <span aria-hidden="true">⏳</span>
        <span>Loading...</span>
      </>
    ) : (
      'Submit'
    )}
  </button>
);
```

## Color and Visual Design

### Color Contrast
```tsx
// Calculate contrast ratio
function getContrastRatio(foreground: string, background: string): number {
  // Implementation of WCAG contrast ratio formula
  // Minimum ratios:
  // - Normal text: 4.5:1
  // - Large text (18pt+ or 14pt+ bold): 3:1
  // - UI components and graphics: 3:1
}

// ✅ Good: Sufficient contrast
const GoodButton = () => (
  <button style={{
    color: '#000',      // Black text
    background: '#fff'  // White background
    // Contrast ratio: 21:1
  }}>
    Click me
  </button>
);

// ❌ Bad: Insufficient contrast
const BadButton = () => (
  <button style={{
    color: '#777',      // Gray text
    background: '#999'  // Gray background
    // Contrast ratio: 1.8:1 (fails WCAG AA)
  }}>
    Click me
  </button>
);
```

### Don't Rely on Color Alone
```tsx
// ❌ Bad: Color-only indicators
const BadStatus = ({ status }: { status: 'success' | 'error' }) => (
  <div style={{ color: status === 'success' ? 'green' : 'red' }}>
    Status
  </div>
);

// ✅ Good: Color + icon + text
const GoodStatus = ({ status }: { status: 'success' | 'error' }) => (
  <div className={`status-${status}`}>
    {status === 'success' ? (
      <>
        <CheckIcon aria-hidden="true" />
        <span>Success</span>
      </>
    ) : (
      <>
        <ErrorIcon aria-hidden="true" />
        <span>Error</span>
      </>
    )}
  </div>
);
```

## Forms and Input Validation

### Accessible Form Fields
```tsx
interface TextFieldProps {
  label: string;
  id: string;
  error?: string;
  required?: boolean;
  helpText?: string;
}

const TextField: React.FC<TextFieldProps> = ({
  label,
  id,
  error,
  required,
  helpText
}) => {
  const errorId = `${id}-error`;
  const helpId = `${id}-help`;
  const describedBy = [
    error && errorId,
    helpText && helpId
  ].filter(Boolean).join(' ');

  return (
    <div>
      <label htmlFor={id}>
        {label}
        {required && <span aria-label="required"> *</span>}
      </label>

      {helpText && (
        <div id={helpId} className="help-text">
          {helpText}
        </div>
      )}

      <input
        type="text"
        id={id}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={describedBy || undefined}
      />

      {error && (
        <div id={errorId} role="alert" className="error-message">
          {error}
        </div>
      )}
    </div>
  );
};
```

## Testing for Accessibility

### Automated Testing
```typescript
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('page is accessible', async () => {
  const { container } = render(<App />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### Manual Testing Checklist
- [ ] Navigate entire site using only keyboard (Tab, Enter, Space, Arrows)
- [ ] Test with screen reader (NVDA, JAWS, VoiceOver)
- [ ] Zoom to 200% and verify all content is still accessible
- [ ] Check color contrast with DevTools or WebAIM Contrast Checker
- [ ] Verify all images have appropriate alt text
- [ ] Ensure all form fields have associated labels
- [ ] Test focus indicators are visible
- [ ] Verify skip links work
- [ ] Check heading hierarchy is logical
- [ ] Test with Windows High Contrast mode

### Browser DevTools
```typescript
// Chrome Lighthouse accessibility audit
// Run in DevTools > Lighthouse > Accessibility

// Firefox Accessibility Inspector
// DevTools > Accessibility tab

// axe DevTools browser extension
// https://www.deque.com/axe/devtools/
```

## Common Patterns

### Accessible Card Component
```tsx
interface CardProps {
  title: string;
  description: string;
  linkUrl: string;
  linkText: string;
  imageUrl?: string;
  imageAlt?: string;
}

const Card: React.FC<CardProps> = ({
  title,
  description,
  linkUrl,
  linkText,
  imageUrl,
  imageAlt
}) => (
  <article className="card">
    {imageUrl && (
      <img
        src={imageUrl}
        alt={imageAlt || ''}
        loading="lazy"
      />
    )}
    <h3>{title}</h3>
    <p>{description}</p>
    <a href={linkUrl}>
      {linkText}
      <span className="sr-only">about {title}</span>
    </a>
  </article>
);
```

## Best Practices

### Do's
- Use semantic HTML elements
- Provide text alternatives for images
- Ensure keyboard navigation works
- Maintain sufficient color contrast
- Use ARIA attributes correctly
- Test with assistive technologies
- Include skip links
- Make focus indicators visible
- Provide clear error messages
- Use proper heading hierarchy

### Don'ts
- Don't use `div` and `span` for everything
- Don't use `role="button"` on `<button>` (redundant)
- Don't hide focus indicators
- Don't use positive tabindex values
- Don't rely on color alone
- Don't autoplay audio or video
- Don't use flashing content
- Don't use ARIA when HTML semantics suffice

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
