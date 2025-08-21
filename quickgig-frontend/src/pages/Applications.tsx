import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Application } from '../types'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye,
  MessageCircle,
  Star,
  Filter
} from 'lucide-react'

interface ApplicationsProps {
  user: User
}

// Mock data
const mockApplications: (Application & { gigTitle: string; gigPay: number })[] = [
  {
    id: '1',
    gigId: '1',
    gigTitle: 'Dog Walking Service',
    gigPay: 15,
    seekerId: 'seeker1',
    seekerName: 'John Doe',
    seekerRating: 4.7,
    status: 'pending',
    appliedAt: '2024-01-20',
    message: 'I have experience with dogs and would love to help with Max!'
  },
  {
    id: '2',
    gigId: '2',
    gigTitle: 'Grocery Shopping Assistant',
    gigPay: 25,
    seekerId: 'seeker2',
    seekerName: 'Emma Wilson',
    seekerRating: 4.9,
    status: 'accepted',
    appliedAt: '2024-01-19',
    message: 'I can help with your grocery shopping needs.'
  },
  {
    id: '3',
    gigId: '3',
    gigTitle: 'Event Photography',
    gigPay: 150,
    seekerId: 'seeker3',
    seekerName: 'Alex Chen',
    seekerRating: 4.5,
    status: 'completed',
    appliedAt: '2024-01-18',
    message: 'Professional photographer with 5+ years experience.'
  }
]

export default function Applications({ user }: ApplicationsProps) {
  const [applications, setApplications] = useState(mockApplications)
  const [activeTab, setActiveTab] = useState('all')
  const [selectedApplication, setSelectedApplication] = useState<string | null>(null)

  const tabs = user.role === 'seeker' 
    ? [
        { id: 'all', label: 'All Applications', count: applications.length },
        { id: 'pending', label: 'Pending', count: applications.filter(a => a.status === 'pending').length },
        { id: 'accepted', label: 'Accepted', count: applications.filter(a => a.status === 'accepted').length },
        { id: 'completed', label: 'Completed', count: applications.filter(a => a.status === 'completed').length }
      ]
    : [
        { id: 'all', label: 'All Applicants', count: applications.length },
        { id: 'pending', label: 'Pending Review', count: applications.filter(a => a.status === 'pending').length },
        { id: 'accepted', label: 'Accepted', count: applications.filter(a => a.status === 'accepted').length },
        { id: 'rejected', label: 'Rejected', count: applications.filter(a => a.status === 'rejected').length }
      ]

  const filteredApplications = activeTab === 'all' 
    ? applications 
    : applications.filter(app => app.status === activeTab)

  const handleStatusChange = (applicationId: string, newStatus: 'accepted' | 'rejected') => {
    setApplications(prev => 
      prev.map(app => 
        app.id === applicationId ? { ...app, status: newStatus } : app
      )
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'accepted':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-blue-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'accepted':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {user.role === 'seeker' ? 'My Applications' : 'Gig Applications'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {user.role === 'seeker' 
              ? 'Track your gig applications and their status'
              : 'Review and manage applications for your gigs'
            }
          </p>
        </div>
        
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {tabs.map((tab) => (
          <motion.div
            key={tab.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card 
              className={`cursor-pointer transition-colors ${
                activeTab === tab.id ? 'ring-2 ring-primary' : 'hover:bg-accent'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{tab.label}</p>
                    <p className="text-2xl font-bold">{tab.count}</p>
                  </div>
                  {getStatusIcon(tab.id)}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No applications found</h3>
                <p>
                  {activeTab === 'all' 
                    ? user.role === 'seeker' 
                      ? "You haven't applied to any gigs yet."
                      : "No one has applied to your gigs yet."
                    : `No ${activeTab} applications.`
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredApplications.map((application, index) => (
            <motion.div
              key={application.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        {/* Avatar */}
                        <div className="h-12 w-12 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-primary-foreground font-medium">
                            {application.seekerName.charAt(0)}
                          </span>
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{application.gigTitle}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                            <span>by {application.seekerName}</span>
                            {application.seekerRating && (
                              <div className="flex items-center">
                                <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                                {application.seekerRating}
                              </div>
                            )}
                            <span>${application.gigPay}</span>
                            <span>Applied {new Date(application.appliedAt).toLocaleDateString()}</span>
                          </div>
                          
                          {application.message && (
                            <p className="text-sm text-foreground bg-muted p-3 rounded-md">
                              "{application.message}"
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-2 ml-4">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      
                      <Button variant="outline" size="sm">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Chat
                      </Button>
                      
                      {user.role === 'poster' && application.status === 'pending' && (
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            onClick={() => handleStatusChange(application.id, 'accepted')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleStatusChange(application.id, 'rejected')}
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
