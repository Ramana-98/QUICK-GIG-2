import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Gig } from '../types'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { AnimatedCounter } from '../components/ui/animated-counter'
import FilterPanel, { FilterState } from '../components/FilterPanel'
import PostGigModal from '../components/PostGigModal'
import ApplyModal from '../components/ApplyModal'
import { ApplyButton, ApplyButtonState } from '../components/ApplyButton'
import { ViewApplicationModal } from '../components/ViewApplicationModal'
import { WithdrawConfirmDialog } from '../components/WithdrawConfirmDialog'
import { AnimatedPostGigButton } from '../components/AnimatedPostGigButton'
import { useToast } from '../hooks/use-toast'
import { 
  MapPin, 
  Clock, 
  IndianRupee, 
  Star, 
  Filter,
  Search,
  Plus,
  Briefcase,
  X,
  Tag,
  FileText,
  Eye,
  DollarSign
} from 'lucide-react'
import { Badge } from '../components/ui/badge'

interface DashboardProps {
  user: User | null
  onLoginRequired?: () => void
}

interface PostGigFormData {
  title: string
  description: string
  category: string
  pay: string
  payType: 'hourly' | 'fixed'
  duration: string
  location: string
  startDate: string
  endDate: string
  tags: string
}

// Mock data
const mockGigs: Gig[] = [
  {
    id: '1',
    title: 'Dog Walking Service',
    description: 'Need someone to walk my golden retriever for 1 hour daily',
    category: 'Pet Care',
    pay: 15,
    payType: 'hourly',
    duration: '1 hour',
    location: 'Downtown Area',
    posterId: '2',
    posterName: 'Sarah Johnson',
    posterRating: 4.8,
    status: 'open',
    createdAt: '2024-01-20',
    tags: ['pets', 'walking', 'daily']
  },
  {
    id: '2',
    title: 'Grocery Shopping Assistant',
    description: 'Help with weekly grocery shopping and delivery',
    category: 'Shopping',
    pay: 25,
    payType: 'fixed',
    duration: '2-3 hours',
    location: 'Suburb Mall',
    posterId: '3',
    posterName: 'Mike Chen',
    posterRating: 4.6,
    status: 'open',
    createdAt: '2024-01-19',
    tags: ['shopping', 'delivery', 'weekly']
  },
  {
    id: '3',
    title: 'Event Photography',
    description: 'Photographer needed for birthday party this weekend',
    category: 'Photography',
    pay: 150,
    payType: 'fixed',
    duration: '4 hours',
    location: 'Community Center',
    posterId: '4',
    posterName: 'Lisa Park',
    posterRating: 4.9,
    status: 'open',
    createdAt: '2024-01-18',
    tags: ['photography', 'event', 'weekend']
  }
]

export default function Dashboard({ user, onLoginRequired }: DashboardProps) {
  const [gigs, setGigs] = useState<Gig[]>(mockGigs)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [activeTab, setActiveTab] = useState('all')
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false)
  const [appliedGigs, setAppliedGigs] = useState<Set<string>>(new Set())
  const [applyingGigs, setApplyingGigs] = useState<Set<string>>(new Set())
  const [selectedGig, setSelectedGig] = useState<Gig | null>(null)
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false)
  const [viewApplicationGig, setViewApplicationGig] = useState<Gig | null>(null)
  const [withdrawGig, setWithdrawGig] = useState<Gig | null>(null)
  const [isWithdrawing, setIsWithdrawing] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    paymentType: 'all',
    budgetMin: 0,
    budgetMax: 1000,
    duration: 'all',
    location: 'all',
    minRating: 0
  })
  const [appliedFilters, setAppliedFilters] = useState<FilterState>(filters)
  const [isPostGigModalOpen, setIsPostGigModalOpen] = useState(false)
  const [showPostGigForm, setShowPostGigForm] = useState(false)
  const [postGigFormData, setPostGigFormData] = useState<PostGigFormData>({
    title: '',
    description: '',
    category: '',
    pay: '',
    payType: 'hourly',
    duration: '',
    location: '',
    startDate: '',
    endDate: '',
    tags: ''
  })
  const [showPreview, setShowPreview] = useState(false)
  const { toast } = useToast()

  const categories = ['all', 'Pet Care', 'Shopping', 'Photography', 'Cleaning', 'Delivery', 'Tutoring']
  const postGigCategories = [
    'Pet Care', 'Cleaning', 'Delivery', 'Photography', 'Tutoring',
    'Shopping', 'Gardening', 'Tech Support', 'Moving', 'Other'
  ]
  const tabs = user?.role === 'seeker' 
    ? ['all', 'applied', 'completed'] 
    : ['all', 'active', 'completed']

  const handlePostGigInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setPostGigFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handlePostGigSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock submission - in real app, this would call an API
    console.log('Gig posted:', postGigFormData)
    
    // Reset form
    setPostGigFormData({
      title: '',
      description: '',
      category: '',
      pay: '',
      payType: 'hourly',
      duration: '',
      location: '',
      startDate: '',
      endDate: '',
      tags: ''
    })
    
    setShowPostGigForm(false)
    toast({
      title: "Gig Posted Successfully!",
      description: "Your gig has been posted and is now visible to job seekers.",
    })
  }

  const isPostGigFormValid = postGigFormData.title && postGigFormData.description && postGigFormData.category && 
                             postGigFormData.pay && postGigFormData.location && postGigFormData.startDate

  // Check if any filters are active
  const hasActiveFilters = () => {
    return appliedFilters.category !== 'all' ||
           appliedFilters.paymentType !== 'all' ||
           appliedFilters.budgetMin > 0 ||
           appliedFilters.budgetMax < 1000 ||
           appliedFilters.duration !== 'all' ||
           appliedFilters.location !== 'all' ||
           appliedFilters.minRating > 0
  }

  const filteredGigs = gigs.filter(gig => {
    // Search filter
    const matchesSearch = gig.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         gig.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    // Category filter (from dropdown)
    const matchesCategory = selectedCategory === 'all' || gig.category === selectedCategory
    
    // Advanced filters
    const matchesAdvancedCategory = appliedFilters.category === 'all' || gig.category === appliedFilters.category
    const matchesPaymentType = appliedFilters.paymentType === 'all' || gig.payType === appliedFilters.paymentType
    const matchesBudget = gig.pay >= appliedFilters.budgetMin && gig.pay <= appliedFilters.budgetMax
    
    // Duration matching (simplified)
    const matchesDuration = appliedFilters.duration === 'all' || 
      (appliedFilters.duration === '1-2 hours' && gig.duration.includes('1 hour')) ||
      (appliedFilters.duration === '2-4 hours' && (gig.duration.includes('2-3 hours') || gig.duration.includes('2 hours'))) ||
      (appliedFilters.duration === '4-8 hours' && gig.duration.includes('4 hours')) ||
      (appliedFilters.duration === '8+ hours' && gig.duration.includes('8'))
    
    const matchesLocation = appliedFilters.location === 'all' || gig.location === appliedFilters.location
    const matchesRating = appliedFilters.minRating === 0 || (gig.posterRating && gig.posterRating >= appliedFilters.minRating)
    
    return matchesSearch && matchesCategory && matchesAdvancedCategory && 
           matchesPaymentType && matchesBudget && matchesDuration && 
           matchesLocation && matchesRating
  })

  const handleApplyFilters = () => {
    setAppliedFilters(filters)
  }

  const handleClearFilters = () => {
    const clearedFilters: FilterState = {
      category: 'all',
      paymentType: 'all',
      budgetMin: 0,
      budgetMax: 1000,
      duration: 'all',
      location: 'all',
      minRating: 0
    }
    setFilters(clearedFilters)
    setAppliedFilters(clearedFilters)
  }

  const handleApplyClick = (gig: Gig) => {
    if (!user) {
      toast({
        title: "Please log in to apply for gigs",
        description: "You need to be logged in to submit applications",
        variant: "destructive"
      })
      onLoginRequired?.()
      return
    }
    
    if (user.role !== 'seeker') {
      toast({
        title: "Only job seekers can apply",
        description: "Switch to seeker mode to apply for gigs",
        variant: "destructive"
      })
      return
    }
    
    setApplyingGigs(prev => new Set([...prev, gig.id]))
    setSelectedGig(gig)
    setIsApplyModalOpen(true)
  }

  const handleViewApplication = (gig: Gig) => {
    setViewApplicationGig(gig)
  }

  const handleWithdrawApplication = (gig: Gig) => {
    setWithdrawGig(gig)
  }

  const confirmWithdraw = async () => {
    if (!withdrawGig) return
    
    setIsWithdrawing(true)
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setAppliedGigs(prev => {
        const newSet = new Set(prev)
        newSet.delete(withdrawGig.id)
        return newSet
      })
      
      toast({
        title: "Application withdrawn",
        description: "Your application has been successfully withdrawn.",
      })
      
      setWithdrawGig(null)
    } catch (error) {
      toast({
        title: "Failed to withdraw",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsWithdrawing(false)
    }
  }

  const handleApplicationSubmitted = (gigId: string) => {
    setApplyingGigs(prev => {
      const newSet = new Set(prev)
      newSet.delete(gigId)
      return newSet
    })
    setAppliedGigs(prev => new Set([...prev, gigId]))
    setIsApplyModalOpen(false)
    setSelectedGig(null)
    toast({
      title: "Application submitted!",
      description: "Your application has been sent to the client.",
    })
  }

  const handleApplicationError = (gigId: string) => {
    setApplyingGigs(prev => {
      const newSet = new Set(prev)
      newSet.delete(gigId)
      return newSet
    })
    toast({
      title: "Application failed",
      description: "Something went wrong. Please try again.",
      variant: "destructive"
    })
  }

  const getApplyButtonState = (gigId: string): ApplyButtonState => {
    if (applyingGigs.has(gigId)) return 'applying'
    if (appliedGigs.has(gigId)) return 'applied'
    return 'default'
  }

  const handlePostGigSuccess = () => {
    toast({
      variant: "success",
      title: "Gig Posted Successfully! ",
      description: "Your gig has been posted and is now visible to job seekers.",
    })
  }

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-poppins font-semibold text-foreground">
            Welcome back, {user?.name || 'Guest'}!
          </h1>
          <p className="text-muted-foreground mt-1 font-sans">
            {user?.role === 'seeker' 
              ? 'Find your next gig opportunity' 
              : user?.role === 'poster'
              ? 'Manage your posted gigs'
              : 'Please log in to get started'}
          </p>
        </div>
        
        {user?.role === 'poster' && (
          <AnimatedPostGigButton
            onClick={() => setIsPostGigModalOpen(true)}
            className="mt-4 sm:mt-0"
          >
            Post New Gig
          </AnimatedPostGigButton>
        )}
      </div>


      {/* Search and Filters */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search gigs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 focus:border-primary focus:shadow-lg focus:shadow-primary/20 transition-all duration-300 font-sans"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring font-sans"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
              
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setIsFilterPanelOpen(true)}
                className={`filter-glassmorphism transition-all duration-300 ${
                  hasActiveFilters() 
                    ? 'bg-primary text-primary-foreground border-primary shadow-lg' 
                    : ''
                }`}
              >
                <Filter className={`h-4 w-4 ${hasActiveFilters() ? 'animate-pulse' : ''}`} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm capitalize transition-colors font-sans ${
                activeTab === tab
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Gigs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGigs.map((gig, index) => (
          <motion.div
            key={gig.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ 
              scale: 1.02, 
              y: -4,
              transition: { duration: 0.2, ease: "easeOut" }
            }}
            whileTap={{ scale: 0.98 }}
          >
            <Card className="hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 cursor-default bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-poppins font-semibold">{gig.title}</CardTitle>
                    <CardDescription className="mt-1 font-sans">
                      {gig.description}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="text-xs bg-primary/10 text-primary badge-shimmer-wiggle">
                    {gig.category}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-muted-foreground font-sans">
                      <IndianRupee className="h-4 w-4 mr-1" />
                      <span className="font-poppins font-bold">₹{gig.pay}</span> {gig.payType === 'hourly' ? '/hr' : 'fixed'}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground font-sans">
                      <Clock className="h-4 w-4 mr-1" />
                      {gig.duration}
                    </div>
                  </div>
                  
                  <div className="flex items-center text-sm text-muted-foreground font-sans">
                    <MapPin className="h-4 w-4 mr-1" />
                    {gig.location}
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center">
                      <div className="h-6 w-6 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-xs text-primary-foreground">
                          {gig.posterName.charAt(0)}
                        </span>
                      </div>
                      <span className="ml-2 text-sm font-sans">{gig.posterName}</span>
                      {gig.posterRating && (
                        <div className="ml-2 flex items-center">
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                          <span className="text-xs ml-1 font-sans">{gig.posterRating}</span>
                        </div>
                      )}
                    </div>
                    
                    {user?.role === 'seeker' && (
                      <ApplyButton
                        state={getApplyButtonState(gig.id)}
                        onClick={() => handleApplyClick(gig)}
                        onViewApplication={() => handleViewApplication(gig)}
                        onWithdrawApplication={() => handleWithdrawApplication(gig)}
                        className="transition-all duration-200"
                      />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredGigs.length === 0 && (
        <div className="text-center py-12">
          <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-poppins font-semibold text-foreground mb-2">No gigs found</h3>
          <p className="text-muted-foreground font-sans">
            Try adjusting your search criteria or check back later for new opportunities.
          </p>
        </div>
      )}

      {/* Filter Panel */}
      <FilterPanel
        isOpen={isFilterPanelOpen}
        onClose={() => setIsFilterPanelOpen(false)}
        filters={filters}
        onFiltersChange={setFilters}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
      />

      {/* Post Gig Modal */}
      <PostGigModal
        isOpen={isPostGigModalOpen}
        onClose={() => setIsPostGigModalOpen(false)}
        onSuccess={() => {
          console.log('New gig posted successfully')
          setIsPostGigModalOpen(false)
          toast({
            title: "Gig Posted Successfully!",
            description: "Your gig has been posted and is now live.",
          })
        }}
      />

      {/* Apply Modal */}
      {selectedGig && user && (
        <ApplyModal
          isOpen={isApplyModalOpen}
          onClose={() => {
            setIsApplyModalOpen(false)
            // Reset applying state if modal is closed without submitting
            if (applyingGigs.has(selectedGig.id)) {
              setApplyingGigs(prev => {
                const newSet = new Set(prev)
                newSet.delete(selectedGig.id)
                return newSet
              })
            }
          }}
          gig={selectedGig}
          user={user}
          onApplicationSubmitted={handleApplicationSubmitted}
          onApplicationError={handleApplicationError}
        />
      )}

      {/* View Application Modal */}
      {viewApplicationGig && (
        <ViewApplicationModal
          isOpen={!!viewApplicationGig}
          onClose={() => setViewApplicationGig(null)}
          application={{
            id: `app-${viewApplicationGig.id}`,
            gigTitle: viewApplicationGig.title,
            clientName: viewApplicationGig.posterName,
            coverLetter: "This is a mock cover letter for demonstration purposes. In a real application, this would contain the actual cover letter submitted by the user.",
            expectedPay: viewApplicationGig.pay.toString(),
            availability: "Weekdays 9 AM - 5 PM",
            submittedAt: new Date().toISOString(),
            status: 'pending'
          }}
        />
      )}

      {/* Withdraw Confirmation Dialog */}
      <WithdrawConfirmDialog
        isOpen={!!withdrawGig}
        onClose={() => setWithdrawGig(null)}
        onConfirm={confirmWithdraw}
        gigTitle={withdrawGig?.title || ''}
        isLoading={isWithdrawing}
      />
    </motion.div>
  )
}
