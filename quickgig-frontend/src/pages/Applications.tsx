import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { User, Application } from '../types'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import ApplicationsFilterSheet from '../components/ApplicationsFilterSheet'
import ApplicationViewModal from '../components/ApplicationViewModal'
import ApplicationChatModal from '../components/ApplicationChatModal'
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye,
  MessageCircle,
  Star,
  Filter,
  MoreVertical,
  Search
} from 'lucide-react'

interface ApplicationsProps {
  user: User
}

interface FilterState {
  status: string
  dateSort: string
  payMin: number
  payMax: number
  posterRating: number
}

// Mock data
const mockApplications: (Application & { 
  gigTitle: string; 
  gigPay: number; 
  gigDescription?: string; 
  gigLocation?: string; 
  posterName: string; 
  posterRating?: number 
})[] = [
  {
    id: '1',
    gigId: '1',
    gigTitle: 'Dog Walking Service',
    gigPay: 15,
    gigDescription: 'Need someone to walk my friendly golden retriever Max twice a day.',
    gigLocation: 'Downtown Park Area',
    seekerId: 'seeker1',
    seekerName: 'John Doe',
    seekerRating: 4.7,
    posterName: 'Sarah Johnson',
    posterRating: 4.8,
    status: 'pending',
    appliedAt: '2024-01-20',
    message: 'I have experience with dogs and would love to help with Max!'
  },
  {
    id: '2',
    gigId: '2',
    gigTitle: 'Grocery Shopping Assistant',
    gigPay: 25,
    gigDescription: 'Weekly grocery shopping for elderly couple. List will be provided.',
    gigLocation: 'Westfield Shopping Center',
    seekerId: 'seeker2',
    seekerName: 'Emma Wilson',
    seekerRating: 4.9,
    posterName: 'Robert Smith',
    posterRating: 4.6,
    status: 'accepted',
    appliedAt: '2024-01-19',
    message: 'I can help with your grocery shopping needs.'
  },
  {
    id: '3',
    gigId: '3',
    gigTitle: 'Event Photography',
    gigPay: 150,
    gigDescription: 'Birthday party photography for 3-hour event. Equipment provided.',
    gigLocation: 'Community Center Hall',
    seekerId: 'seeker3',
    seekerName: 'Alex Chen',
    seekerRating: 4.5,
    posterName: 'Maria Garcia',
    posterRating: 4.9,
    status: 'completed',
    appliedAt: '2024-01-18',
    message: 'Professional photographer with 5+ years experience.'
  }
]

export default function Applications({ user }: ApplicationsProps) {
  const [applications, setApplications] = useState(mockApplications)
  const [activeTab, setActiveTab] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState<typeof mockApplications[0] | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isChatModalOpen, setIsChatModalOpen] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    status: 'all',
    dateSort: 'newest',
    payMin: 0,
    payMax: 1000,
    posterRating: 0
  })
  const [appliedFilters, setAppliedFilters] = useState<FilterState>(filters)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Close dropdown when scrolling
  useEffect(() => {
    function handleScroll() {
      setOpenDropdown(null)
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Check if any filters are active
  const hasActiveFilters = () => {
    return appliedFilters.status !== 'all' ||
           appliedFilters.payMin > 0 ||
           appliedFilters.payMax < 1000 ||
           appliedFilters.posterRating > 0
  }

  // Filter and sort applications
  const filteredApplications = applications.filter(app => {
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      if (!app.gigTitle.toLowerCase().includes(searchLower) &&
          !app.posterName.toLowerCase().includes(searchLower)) {
        return false
      }
    }

    // Status filter
    if (appliedFilters.status !== 'all' && app.status !== appliedFilters.status) {
      return false
    }

    // Pay range filter
    if (app.gigPay < appliedFilters.payMin || app.gigPay > appliedFilters.payMax) {
      return false
    }

    // Poster rating filter
    if (appliedFilters.posterRating > 0 && (app.posterRating || 0) < appliedFilters.posterRating) {
      return false
    }

    return true
  }).sort((a, b) => {
    // Date sorting
    if (appliedFilters.dateSort === 'newest') {
      return new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()
    } else {
      return new Date(a.appliedAt).getTime() - new Date(b.appliedAt).getTime()
    }
  })

  // Filter by active tab
  const tabFilteredApplications = filteredApplications.filter(app => {
    if (activeTab === 'all') return true
    return app.status === activeTab
  })

  const handleApplyFilters = () => {
    setAppliedFilters(filters)
  }

  const handleClearFilters = () => {
    const clearedFilters: FilterState = {
      status: 'all',
      dateSort: 'newest',
      payMin: 0,
      payMax: 1000,
      posterRating: 0
    }
    setFilters(clearedFilters)
    setAppliedFilters(clearedFilters)
  }

  const handleViewApplication = (application: typeof mockApplications[0]) => {
    setSelectedApplication(application)
    setIsViewModalOpen(true)
    setOpenDropdown(null)
  }

  const handleChatWithEmployer = (application: typeof mockApplications[0]) => {
    setSelectedApplication(application)
    setIsChatModalOpen(true)
    setOpenDropdown(null)
  }

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
        
        <Button 
          variant="outline"
          onClick={() => setIsFilterSheetOpen(true)}
          className={`transition-colors ${
            hasActiveFilters() 
              ? 'bg-primary text-primary-foreground border-primary shadow-lg' 
              : ''
          }`}
        >
          <Filter className={`h-4 w-4 mr-2 ${hasActiveFilters() ? 'animate-pulse' : ''}`} />
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
        {tabFilteredApplications.length === 0 ? (
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
          tabFilteredApplications.map((application, index) => (
            <motion.div
              key={application.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-md transition-shadow w-full">
                <CardContent className="p-4 sm:p-6">
                  {/* Mobile-First Layout */}
                  <div className="space-y-4">
                    {/* Header: Title + Status */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-bold text-foreground truncate">
                          {application.gigTitle}
                        </h3>
                      </div>
                      <Badge className={`shrink-0 text-xs font-medium ${getStatusColor(application.status)}`}>
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </Badge>
                    </div>

                    {/* Author Row */}
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 sm:h-12 sm:w-12 bg-primary rounded-full flex items-center justify-center shrink-0">
                        <span className="text-primary-foreground font-medium text-sm sm:text-base">
                          {application.seekerName.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm sm:text-base font-medium text-foreground truncate">
                          by {application.seekerName}
                        </p>
                      </div>
                    </div>

                    {/* Details Grid - Responsive */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      {/* Rating */}
                      {application.seekerRating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400 fill-current" />
                          <span className="text-sm sm:text-base font-medium">{application.seekerRating}</span>
                        </div>
                      )}
                      
                      {/* Price */}
                      <div className="flex items-center gap-1">
                        <span className="text-sm sm:text-base font-bold text-green-600">₹{application.gigPay}</span>
                      </div>
                      
                      {/* Applied Date */}
                      <div className="flex items-center">
                        <span className="text-xs sm:text-sm text-muted-foreground">
                          Applied {new Date(application.appliedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    {/* Description Box */}
                    {application.message && (
                      <div className="bg-muted/50 p-3 sm:p-4 rounded-lg border">
                        <p className="text-sm sm:text-base text-foreground leading-relaxed">
                          "{application.message}"
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewApplication(application)}
                        className="w-full sm:w-auto justify-center sm:justify-start"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleChatWithEmployer(application)}
                        className="w-full sm:w-auto justify-center sm:justify-start"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Chat
                      </Button>
                      
                      {user.role === 'poster' && application.status === 'pending' && (
                        <div className="flex gap-2 w-full sm:w-auto">
                          <Button
                            size="sm"
                            onClick={() => handleStatusChange(application.id, 'accepted')}
                            className="bg-green-600 hover:bg-green-700 flex-1 sm:flex-none"
                          >
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleStatusChange(application.id, 'rejected')}
                            className="flex-1 sm:flex-none"
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

      {/* Filter Sheet */}
      <ApplicationsFilterSheet
        isOpen={isFilterSheetOpen}
        onClose={() => setIsFilterSheetOpen(false)}
        filters={filters}
        onFiltersChange={setFilters}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
      />

      {/* View Modal */}
      {selectedApplication && (
        <ApplicationViewModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          application={selectedApplication}
        />
      )}

      {/* Chat Modal */}
      {selectedApplication && (
        <ApplicationChatModal
          isOpen={isChatModalOpen}
          onClose={() => setIsChatModalOpen(false)}
          application={selectedApplication}
        />
      )}
    </div>
  )
}
