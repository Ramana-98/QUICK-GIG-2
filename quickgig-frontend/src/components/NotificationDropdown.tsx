import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Bell, Check, CheckCheck, ExternalLink } from 'lucide-react'
import { Button } from './ui/button'
import { Card } from './ui/card'

interface Notification {
  id: string
  title: string
  message: string
  time: string
  read: boolean
  type: 'application' | 'payment' | 'gig' | 'system'
  navigationPath?: string
  actionData?: any
}

interface NotificationDropdownProps {
  isOpen: boolean
  onClose: () => void
  onToggle: () => void
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'New Application',
    message: 'John Doe applied for your Web Development gig',
    time: '2 minutes ago',
    read: false,
    type: 'application',
    navigationPath: '/applications',
    actionData: { gigId: 'web-dev-123', applicantId: 'john-doe' }
  },
  {
    id: '2',
    title: 'Payment Received',
    message: 'You received $500 for Logo Design project',
    time: '1 hour ago',
    read: false,
    type: 'payment',
    navigationPath: '/payments',
    actionData: { transactionId: 'txn-500-logo' }
  },
  {
    id: '3',
    title: 'Gig Approved',
    message: 'Your Mobile App Development gig has been approved',
    time: '3 hours ago',
    read: true,
    type: 'gig',
    navigationPath: '/',
    actionData: { gigId: 'mobile-app-456' }
  },
  {
    id: '4',
    title: 'System Update',
    message: 'New features have been added to your dashboard',
    time: '1 day ago',
    read: true,
    type: 'system',
    navigationPath: '/',
    actionData: null
  }
]

export function NotificationDropdown({ isOpen, onClose, onToggle }: NotificationDropdownProps) {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })))
  }

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ))
  }

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    markAsRead(notification.id)
    
    // Navigate to the appropriate page
    if (notification.navigationPath) {
      navigate(notification.navigationPath)
      onClose() // Close the dropdown after navigation
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'application': return 'bg-blue-100 text-blue-600'
      case 'payment': return 'bg-green-100 text-green-600'
      case 'gig': return 'bg-purple-100 text-purple-600'
      case 'system': return 'bg-gray-100 text-gray-600'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onToggle}
        className="relative"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium"
          >
            {unreadCount}
          </motion.span>
        )}
      </Button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 z-50"
          >
            <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
              {/* Header */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={markAllAsRead}
                      className="text-xs text-blue-600 hover:text-blue-700"
                    >
                      <CheckCheck className="h-3 w-3 mr-1" />
                      Mark all read
                    </Button>
                  </div>
                </div>
              </div>

              {/* Notifications List */}
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No notifications yet</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {notifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                          !notification.read ? 'bg-blue-50/50' : ''
                        }`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                            !notification.read ? 'bg-blue-500' : 'bg-gray-300'
                          }`} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className={`text-sm font-medium ${
                                !notification.read ? 'text-gray-900' : 'text-gray-700'
                              }`}>
                                {notification.title}
                              </p>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                getTypeColor(notification.type)
                              }`}>
                                {notification.type}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-3 border-t border-gray-100">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  <ExternalLink className="h-3 w-3 mr-2" />
                  View all notifications
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
