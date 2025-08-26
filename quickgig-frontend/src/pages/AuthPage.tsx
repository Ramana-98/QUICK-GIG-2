import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { User } from '../types'
import { Briefcase, UserCheck, Building2 } from 'lucide-react'

interface AuthPageProps {
  onLogin: (user: User) => void
}

export default function AuthPage({ onLogin }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [selectedRole, setSelectedRole] = useState<'seeker' | 'poster' | null>(null)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Mock authentication - in real app, this would call an API
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email: formData.email,
      name: formData.name || formData.email.split('@')[0],
      role: selectedRole || 'seeker',
      rating: 4.5,
      completedGigs: Math.floor(Math.random() * 50)
    }
    
    onLogin(mockUser)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4"
          >
            <Briefcase className="w-8 h-8 text-primary-foreground" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900">QuickGig</h1>
          <p className="text-gray-600 mt-2">Your hyperlocal gig platform</p>
        </div>

        <Card className="w-full max-w-md mx-auto bg-card/50 backdrop-blur-sm border-border/50 shine-border-blue beam-border-blue">
          <CardHeader>
            <CardTitle>{isLogin ? 'Welcome Back' : 'Join QuickGig'}</CardTitle>
            <CardDescription>
              {isLogin ? 'Sign in to your account' : 'Create your account to get started'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && !selectedRole && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-3"
                >
                  <p className="text-sm font-medium">Choose your role:</p>
                  <div className="grid grid-cols-2 gap-3">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedRole('seeker')}
                      className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary transition-colors text-center"
                    >
                      <UserCheck className="w-8 h-8 mx-auto mb-2 text-primary" />
                      <p className="font-medium">Job Seeker</p>
                      <p className="text-xs text-gray-500">Find gigs near you</p>
                    </motion.button>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedRole('poster')}
                      className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary transition-colors text-center"
                    >
                      <Building2 className="w-8 h-8 mx-auto mb-2 text-primary" />
                      <p className="font-medium">Job Poster</p>
                      <p className="text-xs text-gray-500">Post gigs & hire</p>
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {(isLogin || selectedRole) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-4"
                >
                  {!isLogin && (
                    <div>
                      <label className="block text-sm font-medium mb-1">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary shine-border shine-border-blue"
                        required
                      />
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary shine-border shine-border-blue"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary shine-border shine-border-blue"
                      required
                    />
                  </div>

                  {!isLogin && (
                    <div>
                      <label className="block text-sm font-medium mb-1">Confirm Password</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary shine-border shine-border-blue"
                        required
                      />
                    </div>
                  )}

                  <Button type="submit" className="w-full">
                    {isLogin ? 'Sign In' : 'Create Account'}
                  </Button>
                </motion.div>
              )}
            </form>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin)
                  setSelectedRole(null)
                  setFormData({ email: '', password: '', name: '', confirmPassword: '' })
                }}
                className="text-sm text-primary hover:underline"
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
