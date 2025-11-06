# Micro-Interaction Examples

Small, delightful animations that improve user experience.

## Button Animations

### Hover & Tap
```jsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
>
  Click Me
</motion.button>
```

### Loading Button
```jsx
function LoadingButton({ isLoading, onClick, children }) {
  return (
    <motion.button
      onClick={onClick}
      disabled={isLoading}
      whileHover={!isLoading ? { scale: 1.05 } : {}}
      whileTap={!isLoading ? { scale: 0.95 } : {}}
    >
      {isLoading ? (
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          ⟳
        </motion.span>
      ) : (
        children
      )}
    </motion.button>
  )
}
```

## Card Animations

### Hover Lift
```jsx
<motion.div
  className="card"
  whileHover={{
    y: -8,
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
  }}
  transition={{ type: 'spring', stiffness: 300 }}
>
  Card Content
</motion.div>
```

### Expandable Card
```jsx
function ExpandableCard() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <motion.div
      layout
      onClick={() => setIsExpanded(!isExpanded)}
      className="card"
    >
      <h3>Title</h3>
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

## Input Focus Animation

```jsx
function AnimatedInput() {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className="input-wrapper">
      <motion.input
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="animated-input"
      />
      <motion.div
        className="input-underline"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isFocused ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ originX: 0 }}
      />
    </div>
  )
}
```

## Toast Notifications

```jsx
const toastVariants = {
  initial: { opacity: 0, y: 50, scale: 0.3 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, scale: 0.5, transition: { duration: 0.2 } }
}

function Toast({ message, onClose }) {
  return (
    <motion.div
      variants={toastVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="toast"
    >
      <p>{message}</p>
      <button onClick={onClose}>×</button>
    </motion.div>
  )
}
```

## Loading Skeletons

```jsx
function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <motion.div
        className="skeleton-avatar"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      <motion.div
        className="skeleton-line"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
      />
      <motion.div
        className="skeleton-line"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
      />
    </div>
  )
}
```
