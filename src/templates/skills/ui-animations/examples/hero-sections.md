# Hero Section Animation Examples

Complete, production-ready hero section animations using Framer Motion.

## 1. Modern SaaS Hero

Classic fade-in with staggered children pattern.

```jsx
import { motion } from 'framer-motion'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.6, 0.05, 0.01, 0.9]
    }
  }
}

export function SaaSHero() {
  return (
    <motion.section
      className="hero"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1 variants={itemVariants} className="hero-title">
        Build Better Products
      </motion.h1>

      <motion.p variants={itemVariants} className="hero-subtitle">
        The all-in-one platform for modern teams
      </motion.p>

      <motion.div variants={itemVariants} className="hero-cta">
        <motion.button
          className="btn-primary"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Get Started
        </motion.button>

        <motion.button
          className="btn-secondary"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Watch Demo
        </motion.button>
      </motion.div>

      <motion.div variants={itemVariants} className="hero-image">
        <img src="/dashboard.png" alt="Dashboard" />
      </motion.div>
    </motion.section>
  )
}
```

**CSS:**
```css
.hero {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
}

.hero-title {
  font-size: clamp(2.5rem, 5vw, 4.5rem);
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 1.5rem;
}

.hero-subtitle {
  font-size: clamp(1.125rem, 2vw, 1.5rem);
  color: #64748b;
  margin-bottom: 2.5rem;
  max-width: 600px;
}

.hero-cta {
  display: flex;
  gap: 1rem;
  margin-bottom: 3rem;
}

.hero-image {
  max-width: 900px;
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}
```

---

## 2. Split-Screen Hero with Reveal

Image reveals from behind an overlay.

```jsx
import { motion } from 'framer-motion'

export function SplitScreenHero() {
  return (
    <div className="split-hero">
      {/* Left side - Content */}
      <motion.div
        className="split-content"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: [0.6, 0.05, 0.01, 0.9] }}
      >
        <h1>Creative Agency for the Digital Age</h1>
        <p>We craft unforgettable digital experiences</p>
        <button>View Our Work</button>
      </motion.div>

      {/* Right side - Image with overlay reveal */}
      <div className="split-image-container">
        <img
          src="/hero-image.jpg"
          alt="Hero"
          className="split-image"
        />

        {/* Sliding overlay */}
        <motion.div
          className="split-overlay"
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0 }}
          transition={{
            duration: 1.2,
            ease: [0.76, 0, 0.24, 1],
            delay: 0.2
          }}
          style={{ originX: 0 }}
        />
      </div>
    </div>
  )
}
```

**CSS:**
```css
.split-hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 100vh;
  gap: 4rem;
  padding: 2rem;
}

.split-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2rem;
}

.split-image-container {
  position: relative;
  overflow: hidden;
  border-radius: 12px;
}

.split-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.split-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

@media (max-width: 768px) {
  .split-hero {
    grid-template-columns: 1fr;
  }
}
```

---

## 3. Typing Effect Hero

Animated typing effect for dynamic headlines.

```jsx
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

export function TypingHero() {
  const words = ['Innovators', 'Creators', 'Designers', 'Developers']
  const [currentWord, setCurrentWord] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="typing-hero">
      <h1>
        We Are{' '}
        <motion.span
          key={currentWord}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="typed-word"
        >
          {words[currentWord]}
        </motion.span>
      </h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        Building the future, one line of code at a time
      </motion.p>
    </section>
  )
}
```

---

## 4. Parallax Background Hero

Background moves at different speed than content.

```jsx
import { motion, useScroll, useTransform } from 'framer-motion'

export function ParallaxHero() {
  const { scrollY } = useScroll()

  // Background moves slower (parallax effect)
  const backgroundY = useTransform(scrollY, [0, 500], [0, 150])

  // Content fades out on scroll
  const opacity = useTransform(scrollY, [0, 300], [1, 0])

  return (
    <section className="parallax-hero">
      {/* Background layer */}
      <motion.div
        className="parallax-background"
        style={{ y: backgroundY }}
      >
        <img src="/mountain-bg.jpg" alt="" />
      </motion.div>

      {/* Content layer */}
      <motion.div
        className="parallax-content"
        style={{ opacity }}
      >
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          Adventure Awaits
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Explore the world with us
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Start Your Journey
        </motion.button>
      </motion.div>
    </section>
  )
}
```

**CSS:**
```css
.parallax-hero {
  position: relative;
  height: 100vh;
  overflow: hidden;
}

.parallax-background {
  position: absolute;
  top: -150px;
  left: 0;
  width: 100%;
  height: calc(100% + 300px);
  z-index: 0;
}

.parallax-background img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.parallax-content {
  position: relative;
  z-index: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
}
```

---

## 5. Animated Gradient Hero

Gradient background with animated mesh.

```jsx
import { motion } from 'framer-motion'

export function GradientMeshHero() {
  return (
    <section className="gradient-hero">
      {/* Animated gradient background */}
      <motion.div
        className="gradient-mesh"
        animate={{
          background: [
            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          ]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: 'reverse'
        }}
      />

      {/* Content */}
      <div className="gradient-content">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Experience the Future
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Where innovation meets imagination
        </motion.p>

        <motion.div
          className="cta-group"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <button className="btn-white">Get Started</button>
          <button className="btn-outline">Learn More</button>
        </motion.div>
      </div>
    </section>
  )
}
```

**CSS:**
```css
.gradient-hero {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
}

.gradient-mesh {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.gradient-content {
  position: relative;
  z-index: 1;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
  padding: 2rem;
}

.btn-white {
  background: white;
  color: #667eea;
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.btn-outline {
  background: transparent;
  color: white;
  padding: 1rem 2rem;
  border: 2px solid white;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}
```

---

## 6. Video Background Hero

Auto-playing video with overlay and content.

```jsx
import { motion } from 'framer-motion'

export function VideoHero() {
  return (
    <section className="video-hero">
      {/* Video background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="video-background"
      >
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay for readability */}
      <div className="video-overlay" />

      {/* Content */}
      <motion.div
        className="video-content"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: [0.6, 0.05, 0.01, 0.9] }}
      >
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Your Story Starts Here
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Create unforgettable moments
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="cta-button"
        >
          Discover More
        </motion.button>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="scroll-indicator"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.6, repeat: Infinity, repeatType: 'reverse' }}
      >
        <span>Scroll</span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      </motion.div>
    </section>
  )
}
```

**CSS:**
```css
.video-hero {
  position: relative;
  height: 100vh;
  overflow: hidden;
}

.video-background {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  z-index: 0;
}

.video-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1;
}

.video-content {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
}

.scroll-indicator {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: white;
}
```

---

## Accessibility Considerations

All hero sections should respect `prefers-reduced-motion`:

```jsx
import { useReducedMotion } from 'framer-motion'

export function AccessibleHero() {
  const shouldReduceMotion = useReducedMotion()

  const variants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 30
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.8
      }
    }
  }

  return (
    <motion.section
      variants={variants}
      initial="hidden"
      animate="visible"
    >
      {/* Hero content */}
    </motion.section>
  )
}
```
