import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { X, Star } from 'lucide-react'

export interface FilterState {
  category: string
  paymentType: string
  budgetMin: number
  budgetMax: number
  duration: string
  location: string
  minRating: number
}

interface FilterPanelProps {
  isOpen: boolean
  onClose: (filters: FilterState) => void
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  onApplyFilters: () => void
  onClearFilters: () => void
}

const categories = ['all', 'Pet Care', 'Shopping', 'Photography', 'Cleaning', 'Delivery', 'Tutoring']
const paymentTypes = ['all', 'hourly', 'fixed']
const durations = ['all', '1-2 hours', '2-4 hours', '4-8 hours', '8+ hours']
const locations = ['all', 'Downtown Area', 'Suburb Mall', 'Community Center', 'Online', 'Home Visit']

export default function FilterPanel({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  onApplyFilters,
  onClearFilters
}: FilterPanelProps) {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])

  const updateFilter = (key: keyof FilterState, value: string | number) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleApply = () => {
    onFiltersChange(localFilters)
    onApplyFilters()
    onClose(localFilters)
  }

  const handleClear = () => {
    const clearedFilters: FilterState = {
      category: 'all',
      paymentType: 'all',
      budgetMin: 0,
      budgetMax: 1000,
      duration: 'all',
      location: 'all',
      minRating: 0
    }
    setLocalFilters(clearedFilters)
    onFiltersChange(clearedFilters)
    onClearFilters()
  }

  const handleBackdropClick = () => {
    onClose(localFilters)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={handleBackdropClick}
          />
          
          {/* Filter Panel */}
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-96 bg-background/50 backdrop-blur-md border-l border-border/50 shadow-xl z-50 overflow-y-auto"
          >
            <Card className="h-full rounded-none border-0 bg-transparent">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Filter Gigs</CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => onClose(localFilters)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="p-6 space-y-6">
                {/* Category Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <select
                    value={localFilters.category}
                    onChange={(e) => updateFilter('category', e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Payment Type Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Payment Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {paymentTypes.map(type => (
                      <button
                        key={type}
                        onClick={() => updateFilter('paymentType', type)}
                        className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                          localFilters.paymentType === type
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-background hover:bg-accent border-input'
                        }`}
                      >
                        {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Budget Range Filter */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Budget Range</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-muted-foreground">Min (₹)</label>
                      <input
                        type="number"
                        value={localFilters.budgetMin}
                        onChange={(e) => updateFilter('budgetMin', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                        min="0"
                        max="1000"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Max (₹)</label>
                      <input
                        type="number"
                        value={localFilters.budgetMax}
                        onChange={(e) => updateFilter('budgetMax', parseInt(e.target.value) || 1000)}
                        className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                        min="0"
                        max="1000"
                      />
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    ₹{localFilters.budgetMin} - ₹{localFilters.budgetMax}
                  </div>
                </div>

                {/* Duration Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Duration</label>
                  <select
                    value={localFilters.duration}
                    onChange={(e) => updateFilter('duration', e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {durations.map(duration => (
                      <option key={duration} value={duration}>
                        {duration === 'all' ? 'Any Duration' : duration}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Location</label>
                  <select
                    value={localFilters.location}
                    onChange={(e) => updateFilter('location', e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {locations.map(location => (
                      <option key={location} value={location}>
                        {location === 'all' ? 'All Locations' : location}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Employer Rating Filter */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Minimum Employer Rating</label>
                  <div className="space-y-2">
                    {[0, 3, 4, 4.5, 5].map(rating => (
                      <button
                        key={rating}
                        onClick={() => updateFilter('minRating', rating)}
                        className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md border transition-colors ${
                          localFilters.minRating === rating
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-background hover:bg-accent border-input'
                        }`}
                      >
                        <span>{rating === 0 ? 'Any Rating' : `${rating}+ Stars`}</span>
                        {rating > 0 && (
                          <div className="flex items-center">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="ml-1">{rating}</span>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>

              {/* Action Buttons */}
              <div className="border-t p-6 space-y-3">
                <Button onClick={handleApply} className="w-full">
                  Apply Filters
                </Button>
                <Button onClick={handleClear} variant="outline" className="w-full">
                  Clear Filters
                </Button>
              </div>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
