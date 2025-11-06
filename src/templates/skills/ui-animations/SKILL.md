---
name: ui-animations
description: Production-ready patterns for implementing smooth animations, transitions, and motion design with Framer Motion, CSS animations, and accessibility considerations. Includes hero sections, page transitions, micro-interactions, and scroll-based animations.
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - WebFetch
tags:
  - ui
  - animations
  - motion
  - framer-motion
  - transitions
  - performance
  - accessibility
  - hero-sections
mcp-servers:
  - context7
  - playwright
---

# UI Animations & Motion Design

This skill provides production-ready patterns for implementing smooth, performant, and accessible animations in modern web applications, with a focus on Framer Motion for React applications.

## 🎯 When to Use This Skill

- Adding animations to UI components (buttons, cards, modals)
- Creating animated hero sections and landing pages
- Implementing page transitions
- Building interactive gestures (drag, swipe, hover)
- Adding scroll-based reveal animations
- Creating loading states and skeleton screens
- Implementing micro-interactions for better UX

## 📚 Core Principles

### 1. Performance First
**GPU-Accelerated Properties Only:**
```javascript
// ✅ GOOD - GPU-accelerated
transform: "translateX(100px)"
opacity: 0.5
scale: 1.2

// ❌ BAD - Triggers layout/paint
width: "500px"
height: "300px"
top: "100px"
background: "red"
```

**Use `will-change` Sparingly:**
```css
/* Only for critical animations */
.hero-title {
  will-change: transform, opacity;
}

/* Remove after animation completes */
.hero-title.animated {
  will-change: auto;
}
```

### 2. Accessibility First
**Always Support `prefers-reduced-motion`:**
```javascript
import { useReducedMotion } from 'framer-motion'

function AnimatedComponent() {
  const shouldReduceMotion = useReducedMotion()

  const variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.6
      }
    }
  }

  return <motion.div variants={variants} />
}
```

### 3. Animation Timing
**Follow Natural Motion Curves:**
```javascript
// Default easing (recommended)
ease: [0.6, 0.05, 0.01, 0.9]  // Custom ease-out

// Spring animations (for interactive elements)
type: "spring"
stiffness: 100
damping: 15

// Duration guidelines
0.2s  // Micro-interactions (button hover)
0.4s  // Component transitions (modal open)
0.6s  // Page transitions
0.8s+ // Hero animations, reveals
```

## 🚀 Framer Motion Fundamentals

### Basic Animation
```jsx
import { motion } from 'framer-motion'

function FadeInComponent() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      Content
    </motion.div>
  )
}
```

### Variants (Recommended Pattern)
```jsx
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

function StaggeredList({ items }) {
  return (
    <motion.ul
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {items.map(item => (
        <motion.li key={item.id} variants={itemVariants}>
          {item.text}
        </motion.li>
      ))}
    </motion.ul>
  )
}
```

### AnimatePresence (Enter/Exit Animations)
```jsx
import { AnimatePresence } from 'framer-motion'

function Modal({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          Modal Content
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

## 🎨 Hero Section Animations

### Pattern 1: Fade + Slide Hero Text
```jsx
const heroVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.6, 0.05, 0.01, 0.9]
    }
  }
}

function HeroSection() {
  return (
    <motion.section
      className="hero"
      initial="hidden"
      animate="visible"
    >
      <motion.h1 variants={heroVariants}>
        Welcome to Our Platform
      </motion.h1>
      <motion.p
        variants={heroVariants}
        transition={{ delay: 0.2 }}
      >
        Subheading text
      </motion.p>
      <motion.button
        variants={heroVariants}
        transition={{ delay: 0.4 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Get Started
      </motion.button>
    </motion.section>
  )
}
```

### Pattern 2: Staggered Word Animation
```jsx
function StaggeredHeroTitle({ text }) {
  const words = text.split(' ')

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 }
    }
  }

  const wordVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100
      }
    }
  }

  return (
    <motion.h1
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="hero-title"
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={wordVariants}
          style={{ display: 'inline-block', marginRight: '0.25em' }}
        >
          {word}
        </motion.span>
      ))}
    </motion.h1>
  )
}
```

### Pattern 3: Parallax Background Hero
```jsx
import { useScroll, useTransform } from 'framer-motion'

function ParallaxHero() {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, 150])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])

  return (
    <section className="hero-parallax">
      <motion.div
        className="hero-background"
        style={{ y }}
      >
        <img src="/hero-bg.jpg" alt="" />
      </motion.div>

      <motion.div
        className="hero-content"
        style={{ opacity }}
      >
        <h1>Parallax Hero Section</h1>
        <p>Scroll to see the effect</p>
      </motion.div>
    </section>
  )
}
```

### Pattern 4: Split-Screen Reveal Hero
```jsx
const splitVariants = {
  hidden: { scaleX: 1 },
  visible: {
    scaleX: 0,
    transition: {
      duration: 1.2,
      ease: [0.76, 0, 0.24, 1]
    }
  }
}

function SplitRevealHero() {
  return (
    <div className="hero-split">
      <img src="/hero.jpg" alt="Hero" className="hero-image" />

      {/* Overlay that slides away */}
      <motion.div
        className="hero-overlay"
        variants={splitVariants}
        initial="hidden"
        animate="visible"
        style={{ originX: 0 }}
      />

      <motion.div
        className="hero-text"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <h1>Revealed Content</h1>
      </motion.div>
    </div>
  )
}
```

## 🔄 Page Transitions

### Basic Page Transition
```jsx
// App.jsx
import { AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'

function App() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </AnimatePresence>
  )
}

// PageWrapper.jsx
const pageVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 }
}

function PageWrapper({ children }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.div>
  )
}
```

### Slide Transition
```jsx
const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1
  },
  exit: (direction) => ({
    x: direction < 0 ? 1000 : -1000,
    opacity: 0
  })
}

function SlideTransition({ page, direction }) {
  return (
    <motion.div
      custom={direction}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ type: 'tween', ease: 'anticipate', duration: 0.5 }}
    >
      {page}
    </motion.div>
  )
}
```

## ⚡ Micro-Interactions

### Button Hover & Tap
```jsx
function AnimatedButton({ children, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      {children}
    </motion.button>
  )
}
```

### Card Hover Effect
```jsx
function AnimatedCard({ title, description }) {
  return (
    <motion.div
      className="card"
      whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <h3>{title}</h3>
      <p>{description}</p>
    </motion.div>
  )
}
```

### Loading Spinner
```jsx
function Spinner() {
  return (
    <motion.div
      className="spinner"
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'linear'
      }}
    />
  )
}
```

### Pulse Animation
```jsx
function PulsingDot() {
  return (
    <motion.div
      className="dot"
      animate={{
        scale: [1, 1.2, 1],
        opacity: [1, 0.5, 1]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    />
  )
}
```

## 📜 Scroll-Based Animations

### Scroll-Triggered Reveal
```jsx
import { useInView } from 'framer-motion'
import { useRef } from 'react'

function ScrollReveal({ children }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
```

### Scroll Progress Bar
```jsx
import { useScroll, useSpring } from 'framer-motion'

function ScrollProgressBar() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  return (
    <motion.div
      className="progress-bar"
      style={{ scaleX, transformOrigin: '0%' }}
    />
  )
}
```

### Parallax Scroll Effect
```jsx
import { useScroll, useTransform } from 'framer-motion'

function ParallaxSection() {
  const { scrollY } = useScroll()

  // Different elements move at different speeds
  const y1 = useTransform(scrollY, [0, 1000], [0, -300])
  const y2 = useTransform(scrollY, [0, 1000], [0, -150])

  return (
    <section>
      <motion.div style={{ y: y1 }} className="background-layer" />
      <motion.div style={{ y: y2 }} className="foreground-layer" />
    </section>
  )
}
```

## 🎭 Gesture Animations

### Draggable Component
```jsx
function DraggableBox() {
  return (
    <motion.div
      drag
      dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
      dragElastic={0.2}
      whileDrag={{ scale: 1.1, cursor: 'grabbing' }}
    >
      Drag me!
    </motion.div>
  )
}
```

### Swipeable Card
```jsx
import { useState } from 'react'

function SwipeableCard({ onSwipeLeft, onSwipeRight }) {
  const [exitX, setExitX] = useState(0)

  const handleDragEnd = (event, info) => {
    if (info.offset.x > 100) {
      setExitX(1000)
      onSwipeRight()
    } else if (info.offset.x < -100) {
      setExitX(-1000)
      onSwipeLeft()
    }
  }

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      animate={{ x: exitX }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      Swipe me
    </motion.div>
  )
}
```

## 📐 Layout Animations

### Auto-Animate Layout Changes
```jsx
function ExpandableCard() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <motion.div
      layout
      onClick={() => setIsExpanded(!isExpanded)}
      style={{
        borderRadius: 12,
        background: 'white',
        padding: 20
      }}
    >
      <motion.h2 layout="position">Title</motion.h2>
      {isExpanded && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          Expanded content
        </motion.p>
      )}
    </motion.div>
  )
}
```

### Shared Layout Animation
```jsx
import { LayoutGroup } from 'framer-motion'

function TabNavigation({ tabs, activeTab, setActiveTab }) {
  return (
    <LayoutGroup>
      <ul className="tabs">
        {tabs.map(tab => (
          <li key={tab.id} onClick={() => setActiveTab(tab.id)}>
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="active-indicator"
              />
            )}
          </li>
        ))}
      </ul>
    </LayoutGroup>
  )
}
```

## 🎯 Vue & Svelte Alternatives

### Vue Transition
```vue
<template>
  <Transition name="fade">
    <div v-if="show">Content</div>
  </Transition>
</template>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
```

### Svelte Transition
```svelte
<script>
  import { fade, slide } from 'svelte/transition'
  let visible = true
</script>

{#if visible}
  <div in:fade="{{ duration: 300 }}" out:slide>
    Content
  </div>
{/if}
```

## ⚡ Performance Guidelines

### Animation Budget
- **60 FPS target**: Each frame has ~16.67ms budget
- **Keep animations under 300ms** for micro-interactions
- **Limit concurrent animations** to 3-4 elements max
- **Use `transform` and `opacity`** only for smooth 60fps

### Optimization Checklist
- [ ] Only animate `transform` and `opacity`
- [ ] Use `will-change` sparingly (add before, remove after)
- [ ] Avoid animating during scroll (use CSS `transform` instead)
- [ ] Test on low-end devices
- [ ] Respect `prefers-reduced-motion`
- [ ] Lazy load animation libraries (code-split Framer Motion)

### Bundle Size Optimization
```javascript
// ❌ BAD - Imports entire library
import { motion } from 'framer-motion'

// ✅ GOOD - Lazy load when needed
const motion = lazy(() => import('framer-motion').then(mod => ({ default: mod.motion })))

// Or use dynamic import for route-specific animations
const AnimatedPage = lazy(() => import('./AnimatedPage'))
```

## 🧪 Testing Animations

### Visual Regression Testing
```javascript
// playwright.config.js
test('hero section animation', async ({ page }) => {
  await page.goto('/hero')

  // Wait for animation to complete
  await page.waitForTimeout(1000)

  // Screenshot comparison
  await expect(page).toHaveScreenshot('hero-animated.png')
})
```

### Accessibility Testing
```javascript
test('respects prefers-reduced-motion', async ({ page }) => {
  // Set reduced motion preference
  await page.emulateMedia({ reducedMotion: 'reduce' })

  await page.goto('/animated-page')

  // Verify no motion occurs
  const element = page.locator('.animated-element')
  await expect(element).toHaveCSS('animation-duration', '0s')
})
```

## 🔗 Additional Resources

- **Framer Motion Docs**: https://www.framer.com/motion/
- **CSS Triggers**: https://csstriggers.com/ (know what triggers layout/paint)
- **Easing Functions**: https://easings.net/
- **Animation Inspiration**: https://www.hoverstates.com/
- **Web Animations API**: https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API

## 📝 Related Skills

- [ui-responsive-design](../ui-responsive-design/skill.md) - Ensure animations work across breakpoints
- [ui-accessibility](../ui-accessibility/skill.md) - Accessibility best practices
- [test-e2e-workflows](../test-e2e-workflows/skill.md) - Testing animated components
- [component-generation](../component-generation/skill.md) - Generating animated components
