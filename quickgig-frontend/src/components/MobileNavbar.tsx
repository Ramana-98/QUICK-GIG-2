import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { User } from '../types'
import { Button } from './ui/button'
import { getBackgroundBrightness, getAdaptiveColors } from '../lib/utils'
import { 
  Home, 
  FileText, 
  CreditCard, 
  User as UserIcon,
  Plus
} from 'lucide-react'

interface MobileNavbarProps {
  user: User
}

export default function MobileNavbar({ user }: MobileNavbarProps) {
  const location = useLocation()
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isDarkBackground, setIsDarkBackground] = useState(false)

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Applications', href: '/applications', icon: FileText },
    { name: 'Payments', href: '/payments', icon: CreditCard },
    { name: 'Profile', href: '/profile', icon: UserIcon },
  ]

  // Insert Post Gig for posters
  if (user.role === 'poster') {
    navigation.splice(1, 0, { name: 'Post Gig', href: '/post-gig', icon: Plus })
  }

  // Check background brightness
  useEffect(() => {
    const checkBackground = () => {
      const brightness = getBackgroundBrightness()
      setIsDarkBackground(brightness === 'dark')
    }

    checkBackground()
    
    // Check on resize and scroll
    window.addEventListener('resize', checkBackground)
    window.addEventListener('scroll', checkBackground)
    
    return () => {
      window.removeEventListener('resize', checkBackground)
      window.removeEventListener('scroll', checkBackground)
    }
  }, [])

  // Scroll direction detection
  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY
      
      // Only hide/show on mobile screens
      if (window.innerWidth >= 1024) {
        setIsVisible(true)
        return
      }

      // Show navbar when at top of page
      if (currentScrollY < 10) {
        setIsVisible(true)
      } 
      // Hide when scrolling down, show when scrolling up
      else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    // Throttle scroll events for performance
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          controlNavbar()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll)
    
    // Handle window resize
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsVisible(true)
      }
    }
    
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [lastScrollY])

  const adaptiveColors = getAdaptiveColors(isDarkBackground)

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30,
            duration: 0.3 
          }}
          className="lg:hidden fixed bottom-0 left-0 right-0 z-50"
        >
          <div className="mx-4 mb-4">
            <div className={`${
              isDarkBackground 
                ? 'bg-gray-800/95 border-gray-600/50' 
                : 'bg-white/95 border-gray-200/50'
            } backdrop-blur-md rounded-2xl shadow-lg shadow-black/10`}>
              <nav className="flex justify-around py-3 px-2">
                {navigation.slice(0, 5).map((item, index) => {
                  const isActive = location.pathname === item.href
                  return (
                    <motion.div
                      key={item.name}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative"
                    >
                      <Link
                        to={item.href}
                        className={`flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-200 ${
                          isActive
                            ? isDarkBackground
                              ? 'text-teal-300 bg-teal-400/20'
                              : 'text-teal-700 bg-teal-500/15'
                            : isDarkBackground
                              ? 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                              : 'text-white/70 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <div className="relative">
                          <item.icon className={`h-5 w-5 transition-all duration-200 ${
                            isActive 
                              ? isDarkBackground ? 'text-teal-300' : 'text-teal-700'
                              : ''
                          }`} />
                          
                          {/* Active indicator */}
                          {isActive && (
                            <motion.div
                              layoutId="activeTab"
                              className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${
                                isDarkBackground ? 'bg-teal-300' : 'bg-teal-700'
                              }`}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                          )}
                        </div>
                        
                        <span className={`text-xs mt-1 font-medium transition-all duration-200 ${
                          isActive 
                            ? isDarkBackground ? 'text-teal-300' : 'text-teal-700'
                            : ''
                        }`}>
                          {item.name}
                        </span>
                      </Link>
                    </motion.div>
                  )
                })}
              </nav>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
