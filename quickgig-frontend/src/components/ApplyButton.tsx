import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from './ui/button'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu'
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
            <Button
              variant="outline"
              className={cn(
                "bg-green-50 border-green-200 text-green-700 hover:bg-green-100 hover:border-green-300 hover:shadow-md transition-all duration-200",
                showPulse && "shadow-lg shadow-green-200/50",
                className
              )}
            >
              <Check className="w-4 h-4 mr-2" />
              Applied
              <ChevronDown className="w-3 h-3 ml-2" />
            </Button>
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
    <Button
      onClick={onClick}
      disabled={state === 'applying'}
      className={cn(
        state === 'applying' && "opacity-70 cursor-not-allowed",
        state === 'error' && "bg-red-50 border-red-200 text-red-700 hover:bg-red-100",
        className
      )}
      variant={state === 'error' ? 'outline' : 'default'}
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
    </Button>
  )
}
