import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, CheckCircle } from "lucide-react"
import { cn } from "../../lib/utils"

interface ToastProps {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  variant?: "default" | "success" | "destructive"
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ id, title, description, variant = "default", open = true, onOpenChange }, ref) => {
    const [isVisible, setIsVisible] = React.useState(open)

    React.useEffect(() => {
      setIsVisible(open)
    }, [open])

    const handleClose = () => {
      setIsVisible(false)
      onOpenChange?.(false)
    }

    const variantStyles = {
      default: "border bg-background text-foreground",
      success: "border-green-500 bg-green-50 text-green-900 dark:border-green-400 dark:bg-green-950 dark:text-green-100",
      destructive: "border-red-500 bg-red-50 text-red-900 dark:border-red-400 dark:bg-red-950 dark:text-red-100"
    }

    return (
      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-lg border p-4 shadow-lg",
              variantStyles[variant]
            )}
          >
            <div className="flex items-center space-x-3">
              {variant === "success" && (
                <CheckCircle className="h-5 w-5 text-green-600" />
              )}
              <div className="grid gap-1">
                {title && <div className="text-sm font-semibold">{title}</div>}
                {description && <div className="text-sm opacity-90">{description}</div>}
              </div>
            </div>
            <button
              onClick={handleClose}
              className="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-70 transition-opacity hover:text-foreground hover:opacity-100 focus:opacity-100 focus:outline-none"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    )
  }
)

Toast.displayName = "Toast"

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

export const ToastViewport = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="fixed top-4 right-4 z-[100] flex max-h-screen w-full flex-col space-y-2 md:max-w-[420px]">
      {children}
    </div>
  )
}

export type ToastActionElement = React.ReactElement
export type { ToastProps }
