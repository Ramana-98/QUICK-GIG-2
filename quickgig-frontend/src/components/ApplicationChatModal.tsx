import { useState, useRef, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Send, User } from 'lucide-react'
import { Application } from '../types'

interface Message {
  id: string
  sender: 'user' | 'employer'
  content: string
  timestamp: Date
  senderName: string
}

interface ApplicationChatModalProps {
  isOpen: boolean
  onClose: () => void
  application: (Application & { gigTitle: string; posterName: string }) | null
}

export default function ApplicationChatModal({
  isOpen,
  onClose,
  application
}: ApplicationChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Mock initial messages
  useEffect(() => {
    if (application && isOpen) {
      const mockMessages: Message[] = [
        {
          id: '1',
          sender: 'employer',
          content: `Hi! Thank you for applying to the ${application.gigTitle} position. I'd like to discuss the details with you.`,
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          senderName: application.posterName
        },
        {
          id: '2',
          sender: 'user',
          content: 'Hello! Thank you for considering my application. I\'m very interested in this opportunity and would love to discuss the details.',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
          senderName: 'You'
        },
        {
          id: '3',
          sender: 'employer',
          content: 'Great! When would be a good time for you to start? Also, do you have any questions about the requirements?',
          timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
          senderName: application.posterName
        }
      ]
      setMessages(mockMessages)
    }
  }, [application, isOpen])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isLoading) return

    const message: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: newMessage.trim(),
      timestamp: new Date(),
      senderName: 'You'
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')
    setIsLoading(true)

    // Simulate employer response (in real app, this would be real-time messaging)
    setTimeout(() => {
      const responses = [
        "Thanks for your message! I'll get back to you soon.",
        "That sounds good to me. Let's proceed with the next steps.",
        "I appreciate your quick response. Looking forward to working with you!",
        "Perfect! I'll send you more details shortly."
      ]
      
      const employerResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'employer',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
        senderName: application?.posterName || 'Employer'
      }
      
      setMessages(prev => [...prev, employerResponse])
      setIsLoading(false)
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  if (!application) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[600px] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="flex items-center space-x-2">
            <span>Chat with {application.posterName}</span>
            <span className="text-sm font-normal text-muted-foreground">
              • {application.gigTitle}
            </span>
          </DialogTitle>
        </DialogHeader>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg px-4 py-2 ${
                  message.sender === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                }`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  {message.sender === 'employer' && (
                    <div className="h-6 w-6 bg-secondary rounded-full flex items-center justify-center">
                      <User className="h-3 w-3" />
                    </div>
                  )}
                  <span className="text-xs font-medium">{message.senderName}</span>
                  <span className="text-xs opacity-70">{formatTime(message.timestamp)}</span>
                </div>
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg px-4 py-2 max-w-[70%]">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="border-t p-4">
          <div className="flex space-x-2">
            <Input
              ref={inputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={!newMessage.trim() || isLoading}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
