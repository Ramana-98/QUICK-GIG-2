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
      <div className="absolute inset-0 -m-0.5 bg-gradient-to-r from-blue-400/60 via-purple-400/60 to-pink-400/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <button
        onClick={onClick}
        className={cn(
          "relative w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-500/80 via-purple-500/80 to-pink-500/80 hover:from-blue-600/80 hover:via-purple-600/80 hover:to-pink-600/80 rounded-full flex items-center justify-center space-x-2 transition-all duration-200 font-semibold text-white",
          className
        )}
      >
        <Plus className="w-4 h-4" />
        <span className="relative whitespace-nowrap overflow-hidden">
          <span className="relative z-10 bg-gradient-to-r from-yellow-200 via-white to-cyan-200 bg-clip-text text-transparent animate-gradient-x">
            {children}
          </span>
        </span>
      </button>
    </div>
  )
}
