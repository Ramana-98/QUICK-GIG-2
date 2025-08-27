import { ReactNode, useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { User } from '../types'
import { Button } from './ui/button'
import MobileNavbar from './MobileNavbar'
import { NotificationDropdown } from './NotificationDropdown'
import { SidebarDrawer } from './SidebarDrawer'
import { getBackgroundBrightness, getAdaptiveColors } from '../lib/utils'
import { 
  Home, 
  Briefcase, 
  Plus, 
  FileText, 
  CreditCard, 
  User as UserIcon, 
  Bell,
  LogOut,
  Menu,
  Settings,
  HelpCircle
} from 'lucide-react'

interface LayoutProps {
  children: ReactNode
  user: User
  onLogout: () => void
}

export default function Layout({ children, user, onLogout }: LayoutProps) {
  const location = useLocation()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isDarkBackground, setIsDarkBackground] = useState(false)

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

  const getIconColor = (itemName: string, isActive: boolean) => {
    if (isDarkBackground) {
      const darkColors = {
        'Dashboard': isActive ? 'text-blue-300' : 'text-blue-400 group-hover:text-blue-300',
        'Post Gig': isActive ? 'text-green-300' : 'text-green-400 group-hover:text-green-300',
        'Applications': isActive ? 'text-purple-300' : 'text-purple-400 group-hover:text-purple-300',
        'Payments': isActive ? 'text-yellow-300' : 'text-yellow-400 group-hover:text-yellow-300',
        'Profile': isActive ? 'text-pink-300' : 'text-pink-400 group-hover:text-pink-300',
        'Settings': isActive ? 'text-blue-300' : 'text-blue-400 group-hover:text-blue-300',
        'Help & Support': isActive ? 'text-blue-300' : 'text-blue-400 group-hover:text-blue-300',
      }
      return darkColors[itemName as keyof typeof darkColors] || (isActive ? 'text-white' : 'text-gray-200 group-hover:text-white')
    } else {
      const lightColors = {
        'Dashboard': isActive ? 'text-blue-600' : 'text-blue-500 group-hover:text-blue-600',
        'Post Gig': isActive ? 'text-green-600' : 'text-green-500 group-hover:text-green-600',
        'Applications': isActive ? 'text-purple-600' : 'text-purple-500 group-hover:text-purple-600',
        'Payments': isActive ? 'text-yellow-600' : 'text-yellow-500 group-hover:text-yellow-600',
        'Profile': isActive ? 'text-pink-600' : 'text-pink-500 group-hover:text-pink-600',
        'Settings': isActive ? 'text-blue-600' : 'text-blue-500 group-hover:text-blue-600',
        'Help & Support': isActive ? 'text-blue-600' : 'text-blue-500 group-hover:text-blue-600',
      }
      return lightColors[itemName as keyof typeof lightColors] || (isActive ? 'text-white' : 'text-white/90 group-hover:text-white')
    }
  }

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Applications', href: '/applications', icon: FileText },
    { name: 'Payments', href: '/payments', icon: CreditCard },
    { name: 'Profile', href: '/profile', icon: UserIcon },
  ]

  if (user.role === 'poster') {
    navigation.splice(1, 0, { name: 'Post Gig', href: '/post-gig', icon: Plus })
  }

  const additionalNavigation = [
    { name: 'Settings', href: '/settings', icon: Settings },
    { name: 'Help & Support', href: '/help', icon: HelpCircle },
  ]

  const adaptiveColors = getAdaptiveColors(isDarkBackground)

  return (
    <div className="min-h-screen bg-transparent">
      {/* Mobile header */}
      <div className="lg:hidden">
        <div className={`flex items-center justify-between p-4 border-b ${adaptiveColors.border.primary}`}>
          <div className="relative">
            <h1 className={`text-xl font-bold ${isDarkBackground ? 'text-white' : 'text-primary'} bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent`}>
              QuickGig
            </h1>
            {/* Mobile Sparkles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-0 left-2 text-yellow-300 opacity-0 animate-[sparkle_2s_ease-in-out_infinite]" style={{fontSize: '6px', animationDelay: '0s'}}>✦</div>
              <div className="absolute top-1 right-4 text-blue-300 opacity-0 animate-[sparkle_2.5s_ease-in-out_infinite]" style={{fontSize: '5px', animationDelay: '0.3s'}}>✨</div>
              <div className="absolute bottom-1 left-8 text-pink-300 opacity-0 animate-[sparkle_3s_ease-in-out_infinite]" style={{fontSize: '7px', animationDelay: '0.6s'}}>⭐</div>
              <div className="absolute top-2 left-12 text-purple-300 opacity-0 animate-[sparkle_2.8s_ease-in-out_infinite]" style={{fontSize: '5px', animationDelay: '1s'}}>✦</div>
              <div className="absolute bottom-0 right-2 text-cyan-300 opacity-0 animate-[sparkle_2.2s_ease-in-out_infinite]" style={{fontSize: '6px', animationDelay: '1.3s'}}>✨</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <NotificationDropdown
              isOpen={isNotificationOpen}
              onClose={() => setIsNotificationOpen(false)}
              onToggle={() => setIsNotificationOpen(!isNotificationOpen)}
            />
            <SidebarDrawer
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
              onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
              user={user}
              onLogout={onLogout}
            />
          </div>
        </div>
      </div>

      <div className="lg:flex">
        {/* Expandable Sidebar */}
        <div 
          className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 transition-all duration-300 ease-in-out z-50 ${
            isExpanded ? 'lg:w-64' : 'lg:w-16'
          }`}
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => setIsExpanded(false)}
        >
          <div className={`flex flex-col flex-grow pt-5 overflow-hidden ${
            isDarkBackground 
              ? 'border-r border-gray-600/30' 
              : 'border-r border-white/20'
          }`}>
            <div className="flex items-center flex-shrink-0 px-4">
              <div className="relative">
                <div className="h-8 w-8 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-lg leading-none" style={{fontFamily: 'serif'}}>Qg</span>
                </div>
                <div className="absolute inset-0 h-8 w-8 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-lg opacity-30 blur-sm -z-10"></div>
              </div>
              <div className={`ml-2 relative transition-opacity duration-300 ${
                isExpanded ? 'opacity-100' : 'opacity-0'
              } ${isExpanded ? 'block' : 'hidden'}`}>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent relative z-10">
                  QuickGig
                </span>
                {/* Dynamic Continuous Sparkles */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  {/* Layer 1 - Fast sparkles */}
                  <div className="absolute top-0 left-2 text-yellow-300 opacity-0 animate-[sparkle_2s_ease-in-out_infinite]" style={{fontSize: '8px', animationDelay: '0s'}}>✦</div>
                  <div className="absolute top-1 right-4 text-blue-300 opacity-0 animate-[sparkle_2.5s_ease-in-out_infinite]" style={{fontSize: '6px', animationDelay: '0.3s'}}>✨</div>
                  <div className="absolute bottom-1 left-8 text-pink-300 opacity-0 animate-[sparkle_3s_ease-in-out_infinite]" style={{fontSize: '10px', animationDelay: '0.6s'}}>⭐</div>
                  
                  {/* Layer 2 - Medium sparkles */}
                  <div className="absolute top-2 left-12 text-purple-300 opacity-0 animate-[sparkle_2.8s_ease-in-out_infinite]" style={{fontSize: '7px', animationDelay: '1s'}}>✦</div>
                  <div className="absolute bottom-0 right-2 text-cyan-300 opacity-0 animate-[sparkle_2.2s_ease-in-out_infinite]" style={{fontSize: '9px', animationDelay: '1.3s'}}>✨</div>
                  <div className="absolute top-3 right-8 text-yellow-400 opacity-0 animate-[sparkle_3.2s_ease-in-out_infinite]" style={{fontSize: '6px', animationDelay: '1.6s'}}>⭐</div>
                  
                  {/* Layer 3 - Slow sparkles */}
                  <div className="absolute top-4 left-6 text-indigo-300 opacity-0 animate-[sparkle_3.5s_ease-in-out_infinite]" style={{fontSize: '5px', animationDelay: '2s'}}>✦</div>
                  <div className="absolute bottom-2 left-14 text-rose-300 opacity-0 animate-[sparkle_2.7s_ease-in-out_infinite]" style={{fontSize: '8px', animationDelay: '2.3s'}}>✨</div>
                  <div className="absolute top-1 left-4 text-emerald-300 opacity-0 animate-[sparkle_3.8s_ease-in-out_infinite]" style={{fontSize: '7px', animationDelay: '2.6s'}}>⭐</div>
                  
                  {/* Layer 4 - Additional continuous sparkles */}
                  <div className="absolute bottom-3 right-6 text-amber-300 opacity-0 animate-[sparkle_2.4s_ease-in-out_infinite]" style={{fontSize: '6px', animationDelay: '3s'}}>✦</div>
                  <div className="absolute top-5 right-12 text-violet-300 opacity-0 animate-[sparkle_3.1s_ease-in-out_infinite]" style={{fontSize: '8px', animationDelay: '3.3s'}}>✨</div>
                  <div className="absolute bottom-4 left-10 text-teal-300 opacity-0 animate-[sparkle_2.9s_ease-in-out_infinite]" style={{fontSize: '9px', animationDelay: '3.6s'}}>⭐</div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex-grow flex flex-col">
              <nav className="flex-1 px-2 pb-4 space-y-1">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`group relative flex items-center px-2 py-2 text-sm font-medium rounded-md transition-all duration-300 ease-out transform hover:scale-105 ${
                        isActive
                          ? isDarkBackground
                            ? 'bg-gradient-to-r from-teal-500/30 via-cyan-600/30 to-blue-600/30 text-white shadow-lg shadow-teal-500/30 border border-white/20'
                            : 'bg-gradient-to-r from-teal-400/20 via-cyan-500/20 to-blue-500/20 text-white shadow-lg shadow-teal-500/30 border border-white/20'
                          : isDarkBackground
                            ? 'text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-teal-500/20 hover:via-cyan-600/20 hover:to-blue-600/20 hover:shadow-lg hover:shadow-teal-400/20'
                            : 'text-white/80 hover:text-white hover:bg-gradient-to-r hover:from-teal-400/15 hover:via-cyan-500/15 hover:to-blue-500/15 hover:shadow-lg hover:shadow-teal-400/20'
                      }`}
                      title={!isExpanded ? item.name : undefined}
                    >
                      {/* Animated glow effect */}
                      <div className={`absolute inset-0 rounded-md transition-all duration-300 ease-out ${
                        isActive
                          ? 'shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                          : 'shadow-[0_0_0px_rgba(255,255,255,0)] group-hover:shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                      }`} />
                      
                      <item.icon className={`h-5 w-5 flex-shrink-0 relative z-10 transition-all duration-300 drop-shadow-sm ${
                        getIconColor(item.name, isActive)
                      }`} />
                      
                      <span className={`ml-3 relative z-10 transition-all duration-300 font-medium ${
                        isExpanded ? 'opacity-100' : 'opacity-0'
                      } ${isExpanded ? 'block' : 'hidden'} ${
                        isActive 
                          ? 'text-white drop-shadow-sm' 
                          : isDarkBackground 
                            ? 'text-gray-200 group-hover:text-white'
                            : 'text-white group-hover:text-white'
                      }`}>
                        {item.name}
                      </span>
                      
                      {/* Animated border */}
                      <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-r-full transition-all duration-300 ${
                        isActive 
                          ? 'bg-gradient-to-b from-teal-400 via-cyan-500 to-blue-500 shadow-lg shadow-teal-400/50' 
                          : 'bg-white/0 group-hover:bg-gradient-to-b group-hover:from-teal-400/80 group-hover:via-cyan-500/80 group-hover:to-blue-500/80'
                      }`} />
                    </Link>
                  )
                })}
                
                {/* Additional Navigation Items */}
                <div className="pt-4 mt-4 border-t border-white/10">
                  {additionalNavigation.map((item) => {
                    const isActive = location.pathname === item.href
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`group relative flex items-center px-2 py-2 text-sm font-medium rounded-md transition-all duration-300 ease-out transform hover:scale-105 ${
                          isActive
                            ? isDarkBackground
                              ? 'bg-gradient-to-r from-teal-500/30 via-cyan-600/30 to-blue-600/30 text-white shadow-lg shadow-teal-500/30 border border-white/20'
                              : 'bg-gradient-to-r from-teal-400/20 via-cyan-500/20 to-blue-500/20 text-white shadow-lg shadow-teal-500/30 border border-white/20'
                            : isDarkBackground
                              ? 'text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-teal-500/20 hover:via-cyan-600/20 hover:to-blue-600/20 hover:shadow-lg hover:shadow-teal-400/20'
                              : 'text-white/80 hover:text-white hover:bg-gradient-to-r hover:from-teal-400/15 hover:via-cyan-500/15 hover:to-blue-500/15 hover:shadow-lg hover:shadow-teal-400/20'
                        }`}
                        title={!isExpanded ? item.name : undefined}
                      >
                        {/* Animated glow effect */}
                        <div className={`absolute inset-0 rounded-md transition-all duration-300 ease-out ${
                          isActive
                            ? 'shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                            : 'shadow-[0_0_0px_rgba(255,255,255,0)] group-hover:shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                        }`} />
                        
                        <item.icon className={`h-5 w-5 flex-shrink-0 relative z-10 transition-all duration-300 drop-shadow-sm ${
                          getIconColor(item.name, isActive)
                        }`} />
                        
                        <span className={`ml-3 relative z-10 transition-all duration-300 font-medium ${
                          isExpanded ? 'opacity-100' : 'opacity-0'
                        } ${isExpanded ? 'block' : 'hidden'} ${
                          isActive 
                            ? 'text-white drop-shadow-sm' 
                            : isDarkBackground 
                              ? 'text-gray-200 group-hover:text-white'
                              : 'text-white group-hover:text-white'
                        }`}>
                          {item.name}
                        </span>
                        
                        {/* Animated border */}
                        <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-r-full transition-all duration-300 ${
                          isActive 
                            ? 'bg-gradient-to-b from-teal-400 via-cyan-500 to-blue-500 shadow-lg shadow-teal-400/50' 
                            : 'bg-white/0 group-hover:bg-gradient-to-b group-hover:from-teal-400/80 group-hover:via-cyan-500/80 group-hover:to-blue-500/80'
                        }`} />
                      </Link>
                    )
                  })}
                </div>
              </nav>
              
              <div className="flex-shrink-0 px-2 pb-4">
                <div className={`flex items-center p-2 rounded-md transition-all duration-200 ${
                  isDarkBackground ? 'bg-gray-700/50' : 'bg-white/10'
                } ${isExpanded ? 'justify-start' : 'justify-center'}`}>
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                      <span className="text-sm font-medium text-primary-foreground">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className={`ml-3 flex-1 min-w-0 transition-opacity duration-300 ${
                    isExpanded ? 'opacity-100' : 'opacity-0'
                  } ${isExpanded ? 'block' : 'hidden'}`}>
                    <p className={`text-sm font-medium truncate ${adaptiveColors.text.primary}`}>{user.name}</p>
                    <p className={`text-xs capitalize ${adaptiveColors.text.secondary}`}>{user.role}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onLogout}
                    className={`${adaptiveColors.text.primary} hover:${adaptiveColors.text.primary} ${adaptiveColors.bg.hover} transition-all duration-200 flex items-center justify-center ${
                      isExpanded ? 'ml-2' : 'ml-0'
                    } ${isExpanded ? 'opacity-100' : 'opacity-0'} ${isExpanded ? 'block' : 'hidden'}`}
                    title={!isExpanded ? 'Logout' : undefined}
                  >
                    <LogOut className="h-4 w-4 mx-auto" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className={`lg:flex lg:flex-col lg:flex-1 transition-all duration-300 ease-in-out ${
          isExpanded ? 'lg:pl-64' : 'lg:pl-16'
        }`}>
          <main className="flex-1">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Mobile Navigation with Scroll Behavior */}
      {!isSidebarOpen && <MobileNavbar user={user} />}
    </div>
  )
}
