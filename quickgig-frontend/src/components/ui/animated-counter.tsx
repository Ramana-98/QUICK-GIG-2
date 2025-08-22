import { useEffect, useState } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'

interface AnimatedCounterProps {
  value: number
  duration?: number
  delay?: number
  decimals?: number
  prefix?: string
  suffix?: string
  className?: string
}

export function AnimatedCounter({
  value,
  duration = 2,
  delay = 0,
  decimals = 0,
  prefix = '',
  suffix = '',
  className = ''
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const spring = useSpring(0, { 
    stiffness: 100, 
    damping: 30,
    restDelta: 0.001
  })
  
  const display = useTransform(spring, (latest) => {
    return (prefix + latest.toFixed(decimals) + suffix)
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      spring.set(value)
    }, delay * 1000)

    return () => clearTimeout(timer)
  }, [spring, value, delay])

  useEffect(() => {
    const unsubscribe = display.on('change', (latest) => {
      setDisplayValue(parseFloat(latest.replace(prefix, '').replace(suffix, '')))
    })

    return unsubscribe
  }, [display, prefix, suffix])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration: 0.5, 
        delay: delay,
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
      className={className}
    >
      <motion.span
        className="font-bold tabular-nums bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent animate-pulse"
      >
        {display}
      </motion.span>
    </motion.div>
  )
}

// Alternative simpler version without gradient animation
export function SimpleAnimatedCounter({
  value,
  duration = 2,
  delay = 0,
  decimals = 0,
  prefix = '',
  suffix = '',
  className = ''
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      let start = 0
      const end = value
      const increment = end / (duration * 60) // 60fps
      
      const counter = setInterval(() => {
        start += increment
        if (start >= end) {
          setCount(end)
          clearInterval(counter)
        } else {
          setCount(start)
        }
      }, 1000 / 60)

      return () => clearInterval(counter)
    }, delay * 1000)

    return () => clearTimeout(timer)
  }, [value, duration, delay])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay: delay,
        ease: "easeOut"
      }}
      className={className}
    >
      <span className="font-bold tabular-nums">
        {prefix}{count.toFixed(decimals)}{suffix}
      </span>
    </motion.div>
  )
}
