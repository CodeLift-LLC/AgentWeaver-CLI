---
name: UI Form Validation
description: Best practices and patterns for accessible, user-friendly form validation in modern web applications with real-time feedback.
allowed-tools:
  - Read
  - Write
  - Edit
  - Grep
  - Bash
  - WebFetch
tags:
  - ui
  - forms
  - validation
  - accessibility
  - ux
mcp-servers:
  - playwright
  - context7
---

# UI Form Validation Skill

Comprehensive patterns for implementing accessible, user-friendly form validation with excellent UX and real-time feedback.

## 🎯 Before You Start

**IMPORTANT**: When using this skill, follow these steps:

1. **Build a Todo List**: Use TodoWrite to break down the implementation into clear steps
2. **Gather Clarification**: Ask about requirements, constraints, and expected outcomes
3. **Understand Context**: Read existing code patterns and project conventions
4. **Execute Transparently**: Mark todos in_progress/completed as you work
5. **Validate**: Test your implementation and verify it meets requirements

**Example approach for this skill**:
Design validation rules, implement client-side validation, add real-time feedback, ensure accessibility (ARIA labels, error messages), test with various inputs including edge cases.

**Additional tools available**:
- Use Playwright MCP for testing form validation workflows
- Use Context7 MCP for form validation library documentation

## When to Use

- Building forms with complex validation rules
- Need accessible form error handling
- Implementing real-time validation feedback
- Want consistent validation UX across application

## Core Principles

### 1. Accessibility First
- **WCAG 2.1 AA Compliance**: All forms must be fully accessible
- **Keyboard Navigation**: Tab order, Enter to submit, Escape to cancel
- **Screen Reader Support**: Proper ARIA labels and error announcements
- **Error Association**: Link errors to inputs with `aria-describedby`

### 2. User Experience
- **Real-Time Feedback**: Validate as user types (with debouncing)
- **Clear Error Messages**: Specific, actionable messages
- **Visual Indicators**: Icons, colors, borders for validation state
- **Prevent Submission**: Disable submit button when form is invalid

### 3. Validation Timing
- **On Blur**: Validate field when user leaves it (first-time)
- **On Change**: Validate as user types after first blur
- **On Submit**: Final validation before submission
- **Debouncing**: Delay validation while typing (300ms)

## Validation States

### Field States
1. **Untouched**: No interaction yet (neutral)
2. **Valid**: Passes all validation rules (green ✓)
3. **Invalid**: Fails validation (red ✗)
4. **Validating**: Async validation in progress (spinner)

### Form States
1. **Pristine**: No fields have been modified
2. **Dirty**: At least one field has been modified
3. **Valid**: All fields pass validation
4. **Invalid**: At least one field fails validation
5. **Submitting**: Form submission in progress

## Implementation Patterns

### React Hook Form + Zod (Recommended)
```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema),
  mode: 'onBlur', // Validate on blur
});
```

### Error Message Patterns
```tsx
// ❌ Bad: Generic error
"Invalid input"

// ✅ Good: Specific and actionable
"Email must be in format: user@example.com"
"Password must be at least 8 characters and include a number"
```

## Accessibility Guidelines

### Required ARIA Attributes
```html
<label for="email">Email *</label>
<input
  id="email"
  type="email"
  aria-required="true"
  aria-invalid="true"
  aria-describedby="email-error"
/>
<span id="email-error" role="alert">
  Please enter a valid email address
</span>
```

### Visual + Semantic Indicators
- Don't rely on color alone (use icons + text)
- Provide focus indicators (visible focus ring)
- Use semantic HTML (`<fieldset>`, `<legend>`)
- Mark required fields visually and semantically

## Common Validation Rules

### Email
```typescript
z.string().email().min(1, 'Email is required')
```

### Password
```typescript
z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
```

### Confirm Password
```typescript
z.object({
  password: z.string().min(8),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});
```

### Phone Number
```typescript
z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number')
```

## Async Validation

```typescript
// Check if username is available (with debouncing)
const checkUsername = async (username: string) => {
  const response = await fetch(`/api/check-username?username=${username}`);
  const { available } = await response.json();
  return available || 'Username already taken';
};

// In Zod schema
z.string().refine(checkUsername, {
  message: 'Username already taken',
});
```

## Framework-Specific Examples

See `templates/` directory for complete implementations in:
- React (React Hook Form + Zod)
- Vue (VeeValidate + Yup)
- Vanilla JS (Custom validation)

## Best Practices Checklist

### UX
- [ ] Show validation only after user interaction
- [ ] Use debouncing for on-change validation (300ms)
- [ ] Disable submit button while form is invalid
- [ ] Show loading state during async validation
- [ ] Provide success feedback after submission
- [ ] Clear errors when user corrects input

### Accessibility
- [ ] All inputs have associated labels
- [ ] Required fields marked with `aria-required`
- [ ] Invalid fields marked with `aria-invalid`
- [ ] Error messages linked with `aria-describedby`
- [ ] Error messages have `role="alert"`
- [ ] Focus moves to first error on submit failure
- [ ] Keyboard navigation works perfectly

### Performance
- [ ] Validation is debounced for expensive operations
- [ ] Async validation is cancellable
- [ ] Form state is memoized to prevent re-renders
- [ ] Validation runs only on changed fields

## Common Pitfalls

❌ **Don't**: Validate on every keystroke without debouncing
✅ **Do**: Debounce validation or wait for blur event

❌ **Don't**: Use generic error messages
✅ **Do**: Provide specific, actionable feedback

❌ **Don't**: Allow form submission with validation errors
✅ **Do**: Disable submit and show clear errors

❌ **Don't**: Forget keyboard and screen reader users
✅ **Do**: Test with keyboard-only and screen readers

## Testing Strategy

```typescript
// Test validation rules
test('validates email format', () => {
  expect(schema.email.parse('invalid')).toThrow();
  expect(schema.email.parse('user@example.com')).toBe('user@example.com');
});

// Test form submission
test('prevents submission with invalid data', async () => {
  render(<Form />);
  fireEvent.submit(screen.getByRole('button', { name: /submit/i }));
  expect(await screen.findByText(/invalid email/i)).toBeInTheDocument();
});

// Test accessibility
test('associates errors with inputs', () => {
  render(<Form />);
  const input = screen.getByLabelText(/email/i);
  expect(input).toHaveAttribute('aria-describedby', expect.stringContaining('error'));
});
```

## References

- [WAI-ARIA Form Examples](https://www.w3.org/WAI/ARIA/apg/patterns/alert/)
- [React Hook Form Documentation](https://react-hook-form.com/)
- [Zod Validation Library](https://zod.dev/)
- [GOV.UK Design System - Error Messages](https://design-system.service.gov.uk/components/error-message/)
