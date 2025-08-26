import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu'
import { Button } from './ui/button'
import { Check, Loader2, Eye, X, ChevronDown } from 'lucide-react'
import { cn } from '../lib/utils'

export type ApplyButtonState = 'default' | 'applying' | 'applied' | 'error'

interface ApplyButtonProps {
  state: ApplyButtonState
  onClick: () => void
  onViewApplication?: () => void
  onWithdrawApplication?: () => void
  className?: string
}

const MotionButton = motion(Button)

export function ApplyButton({ 
  state, 
  onClick, 
  onViewApplication, 
  onWithdrawApplication,
  className 
}: ApplyButtonProps) {
  const [showPulse, setShowPulse] = useState(false)

  // Trigger pulse animation when state changes to applied
  React.useEffect(() => {
    if (state === 'applied') {
      setShowPulse(true)
      const timer = setTimeout(() => setShowPulse(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [state])

  if (state === 'applied') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <motion.div
            animate={showPulse ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 0.6, repeat: showPulse ? 2 : 0 }}
          >
            <MotionButton
              variant="outline"
              className={cn(
                "bg-green-50 border-green-200 text-green-700 hover:bg-green-100 hover:border-green-300 hover:shadow-md transition-all duration-200",
                showPulse && "shadow-lg shadow-green-200/50",
                className
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ 
                scale: 0.95,
                transition: { type: "spring", stiffness: 400, damping: 10 }
              }}
            >
              <Check className="w-4 h-4 mr-2" />
              Applied
              <ChevronDown className="w-3 h-3 ml-2" />
            </MotionButton>
          </motion.div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={onViewApplication} className="cursor-pointer">
            <Eye className="w-4 h-4 mr-2" />
            View Application
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={onWithdrawApplication} 
            className="cursor-pointer text-red-600 focus:text-red-600"
          >
            <X className="w-4 h-4 mr-2" />
            Withdraw Application
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <MotionButton
      onClick={onClick}
      disabled={state === 'applying'}
      className={cn(
        "relative overflow-hidden inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2",
        state === 'error' ? 'border border-input bg-background hover:bg-accent hover:text-accent-foreground' : 'bg-primary text-primary-foreground hover:bg-primary/90',
        state === 'applying' && "opacity-70 cursor-not-allowed",
        className
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ 
        scale: 0.95,
        transition: { type: "spring", stiffness: 400, damping: 10 }
      }}
    >
      <AnimatePresence mode="wait">
        {state === 'applying' ? (
          <motion.div
            key="applying"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center"
          >
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Applying...
          </motion.div>
        ) : (
          <motion.span
            key="apply"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            Apply
          </motion.span>
        )}
      </AnimatePresence>
    </MotionButton>
  )
}
