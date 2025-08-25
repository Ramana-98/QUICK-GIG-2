import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { User } from '../types'
import { Button } from './ui/button'
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
            <div className="bg-white/95 backdrop-blur-md border border-gray-200/50 rounded-2xl shadow-lg shadow-black/10">
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
                            ? 'text-primary bg-primary/10'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                        }`}
                      >
                        <div className="relative">
                          <item.icon className={`h-5 w-5 transition-all duration-200 ${
                            isActive ? 'text-primary' : ''
                          }`} />
                          
                          {/* Active indicator */}
                          {isActive && (
                            <motion.div
                              layoutId="activeTab"
                              className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                          )}
                        </div>
                        
                        <span className={`text-xs mt-1 font-medium transition-all duration-200 ${
                          isActive ? 'text-primary' : ''
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
