import { useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { 
  Menu, 
  X, 
  Home, 
  Briefcase, 
  Plus, 
  FileText, 
  CreditCard, 
  User as UserIcon,
  Settings,
  HelpCircle,
  LogOut
} from 'lucide-react'
import { Button } from './ui/button'
import { User } from '../types'

interface SidebarDrawerProps {
  isOpen: boolean
  onClose: () => void
  onToggle: () => void
  user: User
  onLogout: () => void
}

export function SidebarDrawer({ isOpen, onClose, onToggle, user, onLogout }: SidebarDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null)
  const location = useLocation()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Applications', href: '/applications', icon: FileText },
    { name: 'Payments', href: '/payments', icon: CreditCard },
    { name: 'Profile', href: '/profile', icon: UserIcon },
  ]

  if (user.role === 'poster') {
    navigation.splice(1, 0, { name: 'Post Gig', href: '/post-gig', icon: Plus })
  }

  const additionalLinks = [
    { name: 'Settings', href: '/settings', icon: Settings },
    { name: 'Help & Support', href: '/help', icon: HelpCircle },
  ]

  return (
    <>
      {/* Menu Button */}
      <Button variant="ghost" size="icon" onClick={onToggle}>
        <Menu className="h-5 w-5" />
      </Button>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={onClose}
            />
            
            {/* Drawer */}
            <motion.div
              ref={drawerRef}
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30,
                duration: 0.3 
              }}
              className="fixed left-0 top-0 h-full w-80 bg-background border-r shadow-xl z-50 max-h-screen"
            >
              <div className="flex flex-col h-full max-h-screen">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-lg leading-none" style={{fontFamily: 'serif'}}>Qg</span>
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                      QuickGig
                    </span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* User Info */}
                <div className="p-4 border-b border-gray-100 flex-shrink-0">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-600 capitalize">{user.role}</p>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto min-h-0">
                  <nav className="p-4 space-y-2">
                    <div className="mb-4">
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                        Main Navigation
                      </h3>
                      {navigation.map((item, index) => {
                        const isActive = location.pathname === item.href
                        return (
                          <motion.div
                            key={item.name}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <Link
                              to={item.href}
                              onClick={onClose}
                              className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                                isActive
                                  ? 'bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-white shadow-lg'
                                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                              }`}
                            >
                              <item.icon className="h-5 w-5" />
                              <span className="font-medium">{item.name}</span>
                            </Link>
                          </motion.div>
                        )
                      })}
                    </div>

                    <div>
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                        More
                      </h3>
                      {additionalLinks.map((item, index) => (
                        <motion.div
                          key={item.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: (navigation.length + index) * 0.1 }}
                        >
                          <Link
                            to={item.href}
                            onClick={onClose}
                            className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200"
                          >
                            <item.icon className="h-5 w-5" />
                            <span className="font-medium">{item.name}</span>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </nav>
                </div>

                {/* Footer - Always visible */}
                <div className="p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Button
                      variant="ghost"
                      onClick={() => {
                        onLogout()
                        onClose()
                      }}
                      className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 font-medium py-3 px-3 rounded-lg border border-red-200 hover:border-red-300 transition-all duration-200"
                    >
                      <LogOut className="h-5 w-5 mr-3" />
                      Sign Out
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
