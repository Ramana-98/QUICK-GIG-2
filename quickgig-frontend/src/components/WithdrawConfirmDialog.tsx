import { motion } from 'framer-motion'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog.tsx'
import { AlertTriangle } from 'lucide-react'

interface WithdrawConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  gigTitle: string
  isLoading?: boolean
}

export function WithdrawConfirmDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  gigTitle,
  isLoading = false
}: WithdrawConfirmDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="flex items-center space-x-2"
          >
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <AlertDialogTitle>Withdraw Application</AlertDialogTitle>
          </motion.div>
          <AlertDialogDescription className="text-left">
            Are you sure you want to withdraw your application for{' '}
            <span className="font-semibold">"{gigTitle}"</span>?
            <br />
            <br />
            This action cannot be undone. You'll need to reapply if you change your mind.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isLoading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center"
              >
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Withdrawing...
              </motion.div>
            ) : (
              'Withdraw Application'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
