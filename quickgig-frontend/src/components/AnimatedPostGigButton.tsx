import { Plus } from 'lucide-react'
import { cn } from '../lib/utils'

interface AnimatedPostGigButtonProps {
  onClick: () => void
  children: React.ReactNode
  className?: string
}

export function AnimatedPostGigButton({ onClick, children, className }: AnimatedPostGigButtonProps) {
  return (
    <div className="relative group w-full sm:w-fit">
      {/* Hover Border Gradient */}
      <div className="absolute inset-0 -m-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <button
        onClick={onClick}
        className={cn(
          "relative w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 rounded-full flex items-center justify-center space-x-2 transition-all duration-200 font-semibold text-white",
          className
        )}
      >
        <Plus className="w-4 h-4" />
        <span className="relative whitespace-nowrap overflow-hidden">
          <span className="relative z-10">{children}</span>
          
          {/* Primary Shine Effect */}
          <span 
            className="absolute inset-0 -top-1 -bottom-1 bg-gradient-to-r from-transparent via-white/40 to-transparent transform -skew-x-12"
            style={{
              animation: 'shine 2.5s ease-in-out infinite',
              animationDelay: '1s'
            }}
          ></span>
          
          {/* Secondary Reverse Shine Effect */}
          <span 
            className="absolute inset-0 -top-1 -bottom-1 bg-gradient-to-r from-transparent via-blue-200/30 to-transparent transform skew-x-12"
            style={{
              animation: 'shine-reverse 3s ease-in-out infinite',
              animationDelay: '2.5s'
            }}
          ></span>
          
          {/* Pulse Shine Effect */}
          <span 
            className="absolute inset-0 bg-gradient-to-r from-purple-300/20 via-pink-300/30 to-purple-300/20 rounded-full"
            style={{
              animation: 'shine-pulse 4s ease-in-out infinite',
              animationDelay: '0.5s'
            }}
          ></span>
        </span>
      </button>
    </div>
  )
}
