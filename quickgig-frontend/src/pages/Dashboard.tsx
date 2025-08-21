import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Gig } from '../types'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Star, 
  Filter,
  Search,
  Plus,
  Briefcase
} from 'lucide-react'

interface DashboardProps {
  user: User
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

export default function Dashboard({ user }: DashboardProps) {
  const [gigs, setGigs] = useState<Gig[]>(mockGigs)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [activeTab, setActiveTab] = useState('all')

  const categories = ['all', 'Pet Care', 'Shopping', 'Photography', 'Cleaning', 'Delivery', 'Tutoring']
  const tabs = user.role === 'seeker' 
    ? ['all', 'applied', 'completed'] 
    : ['all', 'active', 'completed']

  const filteredGigs = gigs.filter(gig => {
    const matchesSearch = gig.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         gig.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || gig.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome back, {user.name}!
          </h1>
          <p className="text-muted-foreground mt-1">
            {user.role === 'seeker' 
              ? 'Find your next gig opportunity' 
              : 'Manage your posted gigs'}
          </p>
        </div>
        
        {user.role === 'poster' && (
          <Button className="mt-4 sm:mt-0">
            <Plus className="w-4 h-4 mr-2" />
            Post New Gig
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {user.role === 'seeker' ? 'Available Gigs' : 'Active Gigs'}
              </CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{gigs.length}</div>
              <p className="text-xs text-muted-foreground">
                +2 from last week
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.rating}</div>
              <p className="text-xs text-muted-foreground">
                Based on {user.completedGigs} gigs
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {user.role === 'seeker' ? 'Earnings' : 'Total Spent'}
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$1,234</div>
              <p className="text-xs text-muted-foreground">
                +15% from last month
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Search and Filters */}
      <Card>
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
                  className="w-full pl-10 pr-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
              
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
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
              className={`py-2 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
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
          >
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{gig.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {gig.description}
                    </CardDescription>
                  </div>
                  <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                    {gig.category}
                  </span>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <DollarSign className="h-4 w-4 mr-1" />
                      ${gig.pay} {gig.payType === 'hourly' ? '/hr' : 'fixed'}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      {gig.duration}
                    </div>
                  </div>
                  
                  <div className="flex items-center text-sm text-muted-foreground">
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
                      <span className="ml-2 text-sm">{gig.posterName}</span>
                      {gig.posterRating && (
                        <div className="ml-2 flex items-center">
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                          <span className="text-xs ml-1">{gig.posterRating}</span>
                        </div>
                      )}
                    </div>
                    
                    {user.role === 'seeker' && (
                      <Button size="sm">Apply</Button>
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
          <h3 className="text-lg font-medium text-foreground mb-2">No gigs found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search criteria or check back later for new opportunities.
          </p>
        </div>
      )}
    </div>
  )
}
