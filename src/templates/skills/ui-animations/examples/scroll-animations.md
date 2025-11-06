# Scroll Animation Examples

Scroll-based animations for engaging user experiences.

## Scroll-Triggered Reveal

```jsx
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

function ScrollReveal({ children }) {
  const ref = useRef(null)
  const isInView = useInView(ref, {
    once: true,
    margin: '-100px'
  })

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

## Staggered Scroll Reveals

```jsx
function StaggeredReveal({ items }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
    >
      {items.map((item, i) => (
        <motion.div key={i} variants={itemVariants}>
          {item}
        </motion.div>
      ))}
    </motion.div>
  )
}
```

## Scroll Progress Bar

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
      style={{
        scaleX,
        transformOrigin: '0%',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
        zIndex: 9999
      }}
    />
  )
}
```

## Parallax Scroll

```jsx
import { useScroll, useTransform } from 'framer-motion'

function ParallaxSection() {
  const { scrollY } = useScroll()

  // Different layers move at different speeds
  const backgroundY = useTransform(scrollY, [0, 1000], [0, -300])
  const middleY = useTransform(scrollY, [0, 1000], [0, -150])
  const foregroundY = useTransform(scrollY, [0, 1000], [0, -50])

  return (
    <section className="parallax-container">
      <motion.div
        className="parallax-layer background"
        style={{ y: backgroundY }}
      />
      <motion.div
        className="parallax-layer middle"
        style={{ y: middleY }}
      />
      <motion.div
        className="parallax-layer foreground"
        style={{ y: foregroundY }}
      >
        <h2>Parallax Content</h2>
      </motion.div>
    </section>
  )
}
```

## Fade Out on Scroll

```jsx
function FadeOnScroll() {
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 300], [1, 0])
  const scale = useTransform(scrollY, [0, 300], [1, 0.8])

  return (
    <motion.div style={{ opacity, scale }}>
      <h1>Scroll to fade out</h1>
    </motion.div>
  )
}
```

## Scroll-Linked Animation

```jsx
function ScrollLinkedAnimation() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  })

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8])
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360])

  return (
    <motion.div
      ref={ref}
      style={{ scale, rotate }}
      className="scroll-linked-element"
    >
      Scroll-linked content
    </motion.div>
  )
}
```
