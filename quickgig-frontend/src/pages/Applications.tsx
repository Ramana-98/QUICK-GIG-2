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
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{application.gigTitle}</h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                                {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                              </span>
                            </div>
                            {/* Three dot menu for mobile */}
                            <div className="sm:hidden relative ml-3" ref={dropdownRef}>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0"
                                onClick={() => setOpenDropdown(openDropdown === application.id ? null : application.id)}
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                              
                              {/* Dropdown Menu */}
                              {openDropdown === application.id && (
                                <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-20 min-w-[120px]">
                                  <div className="py-1">
                                    <button 
                                      className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                      onClick={() => handleViewApplication(application)}
                                    >
                                      <Eye className="h-4 w-4 mr-2" />
                                      View
                                    </button>
                                    <button 
                                      className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                      onClick={() => handleChatWithEmployer(application)}
                                    >
                                      <MessageCircle className="h-4 w-4 mr-2" />
                                      Chat
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                            <span>by {application.seekerName}</span>
                            {application.seekerRating && (
                              <div className="flex items-center">
                                <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                                {application.seekerRating}
                              </div>
                            )}
                            <span>₹{application.gigPay}</span>
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
                    
                    {/* Actions - Desktop only */}
                    <div className="hidden sm:flex items-center gap-2 ml-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewApplication(application)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleChatWithEmployer(application)}
                      >
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
