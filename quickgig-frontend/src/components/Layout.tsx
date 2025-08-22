import { ReactNode, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { User } from '../types'
import { Button } from './ui/button'
import { 
  Home, 
  Briefcase, 
  Plus, 
  FileText, 
  CreditCard, 
  User as UserIcon, 
  Bell,
  LogOut,
  Menu
} from 'lucide-react'

interface LayoutProps {
  children: ReactNode
  user: User
  onLogout: () => void
}

export default function Layout({ children, user, onLogout }: LayoutProps) {
  const location = useLocation()
  const [isExpanded, setIsExpanded] = useState(false)

  const getIconColor = (itemName: string, isActive: boolean) => {
    const colors = {
      'Dashboard': isActive ? 'text-blue-300' : 'text-blue-400 group-hover:text-blue-300',
      'Post Gig': isActive ? 'text-green-300' : 'text-green-400 group-hover:text-green-300',
      'Applications': isActive ? 'text-purple-300' : 'text-purple-400 group-hover:text-purple-300',
      'Payments': isActive ? 'text-yellow-300' : 'text-yellow-400 group-hover:text-yellow-300',
      'Profile': isActive ? 'text-pink-300' : 'text-pink-400 group-hover:text-pink-300',
    }
    return colors[itemName as keyof typeof colors] || (isActive ? 'text-white' : 'text-white/80 group-hover:text-white')
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

  return (
    <div className="min-h-screen bg-transparent">
      {/* Mobile header */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className="text-xl font-bold text-primary">QuickGig</h1>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
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
          <div className="flex flex-col flex-grow pt-5 bg-white/10 backdrop-blur-md border-r border-white/20 overflow-hidden">
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
                          ? 'bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50 border border-white/20'
                          : 'text-white/80 hover:text-white hover:bg-gradient-to-r hover:from-blue-400/30 hover:via-purple-500/30 hover:to-pink-500/30 hover:shadow-lg hover:shadow-purple-400/30'
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
                        isActive ? 'text-white drop-shadow-sm' : 'group-hover:text-white'
                      }`}>
                        {item.name}
                      </span>
                      
                      {/* Animated border */}
                      <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-r-full transition-all duration-300 ${
                        isActive 
                          ? 'bg-gradient-to-b from-blue-400 via-purple-500 to-pink-500 shadow-lg shadow-purple-400/50' 
                          : 'bg-white/0 group-hover:bg-gradient-to-b group-hover:from-blue-400/80 group-hover:via-purple-500/80 group-hover:to-pink-500/80'
                      }`} />
                    </Link>
                  )
                })}
              </nav>
              
              <div className="flex-shrink-0 px-2 pb-4">
                <div className={`flex items-center p-2 rounded-md bg-white/10 transition-all duration-200 ${
                  isExpanded ? 'justify-start' : 'justify-center'
                }`}>
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
                    <p className="text-sm font-medium truncate text-white">{user.name}</p>
                    <p className="text-xs text-white/60 capitalize">{user.role}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onLogout}
                    className={`text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 ${
                      isExpanded ? 'ml-2' : 'ml-0'
                    } ${isExpanded ? 'opacity-100' : 'opacity-0'} ${isExpanded ? 'block' : 'hidden'}`}
                    title={!isExpanded ? 'Logout' : undefined}
                  >
                    <LogOut className="h-4 w-4" />
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

      {/* Mobile bottom navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t">
        <nav className="flex justify-around py-2">
          {navigation.slice(0, 4).map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs mt-1">{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
