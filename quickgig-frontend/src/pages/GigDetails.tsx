import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Gig, Application } from '../types'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Star, 
  ArrowLeft,
  Calendar,
  User as UserIcon,
  MessageCircle,
  CheckCircle
} from 'lucide-react'

interface GigDetailsProps {
  user: User
}

export default function GigDetails({ user }: GigDetailsProps) {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [gig, setGig] = useState<Gig | null>(null)
  const [hasApplied, setHasApplied] = useState(false)
  const [showApplicationModal, setShowApplicationModal] = useState(false)
  const [applicationMessage, setApplicationMessage] = useState('')

  useEffect(() => {
    // Mock gig data - in real app, fetch from API
    const mockGig: Gig = {
      id: id || '1',
      title: 'Dog Walking Service',
      description: 'I need someone reliable to walk my golden retriever, Max, for about 1 hour daily. Max is friendly and well-trained. The route is around the neighborhood park area. Flexible timing between 2-6 PM.',
      category: 'Pet Care',
      pay: 15,
      payType: 'hourly',
      duration: '1 hour',
      location: 'Downtown Area, Park Street',
      coordinates: { lat: 40.7128, lng: -74.0060 },
      posterId: '2',
      posterName: 'Sarah Johnson',
      posterRating: 4.8,
      status: 'open',
      createdAt: '2024-01-20',
      startDate: '2024-01-22',
      tags: ['pets', 'walking', 'daily', 'flexible'],
      applicants: []
    }
    setGig(mockGig)
  }, [id])

  const handleApply = () => {
    if (user.role !== 'seeker') return
    
    // Mock application submission
    setHasApplied(true)
    setShowApplicationModal(false)
    
    // In real app, this would call an API
    console.log('Application submitted:', {
      gigId: gig?.id,
      seekerId: user.id,
      message: applicationMessage
    })
  }

  if (!gig) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{gig.title}</h1>
          <p className="text-muted-foreground">Posted by {gig.posterName}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Gig Details */}
          <Card>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground leading-relaxed">{gig.description}</p>
              
              <div className="flex flex-wrap gap-2">
                {gig.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Job Details */}
          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">₹{gig.pay} {gig.payType === 'hourly' ? 'per hour' : 'fixed'}</p>
                    <p className="text-sm text-muted-foreground">Payment</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{gig.duration}</p>
                    <p className="text-sm text-muted-foreground">Duration</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{gig.location}</p>
                    <p className="text-sm text-muted-foreground">Location</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{gig.startDate}</p>
                    <p className="text-sm text-muted-foreground">Start Date</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Poster Info */}
          <Card>
            <CardHeader>
              <CardTitle>About the Poster</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 bg-primary rounded-full flex items-center justify-center">
                  <UserIcon className="h-6 w-6 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{gig.posterName}</h3>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm ml-1">{gig.posterRating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Active poster • 23 completed gigs
                  </p>
                  <Button variant="outline" size="sm" className="mt-3">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Application Card */}
          <Card>
            <CardHeader>
              <CardTitle>Apply for this Gig</CardTitle>
              <CardDescription>
                {hasApplied ? 'Application submitted!' : 'Submit your application'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {user.role === 'seeker' ? (
                hasApplied ? (
                  <div className="text-center py-4">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                    <p className="font-medium text-green-700">Application Sent!</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      You'll be notified when the poster responds
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        ₹{gig.pay}{gig.payType === 'hourly' ? '/hr' : ''}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {gig.payType === 'hourly' ? 'Hourly Rate' : 'Fixed Price'}
                      </p>
                    </div>
                    
                    <Button 
                      className="w-full" 
                      onClick={() => setShowApplicationModal(true)}
                    >
                      Apply Now
                    </Button>
                    
                    <p className="text-xs text-muted-foreground text-center">
                      Free to apply • No upfront fees
                    </p>
                  </div>
                )
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">
                    Switch to job seeker mode to apply for gigs
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Gig Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Applications</span>
                <span className="font-medium">3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Posted</span>
                <span className="font-medium">2 days ago</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Category</span>
                <span className="font-medium">{gig.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className="font-medium capitalize text-green-600">{gig.status}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Application Modal */}
      {showApplicationModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowApplicationModal(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-background rounded-lg p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">Apply for this Gig</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Message to Poster (Optional)
                </label>
                <textarea
                  value={applicationMessage}
                  onChange={(e) => setApplicationMessage(e.target.value)}
                  placeholder="Tell the poster why you're the right fit for this gig..."
                  className="w-full p-3 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  rows={4}
                />
              </div>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowApplicationModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button onClick={handleApply} className="flex-1">
                  Submit Application
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
