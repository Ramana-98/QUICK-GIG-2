import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from './ui/sheet'
import { Star } from 'lucide-react'

interface FilterState {
  status: string
  dateSort: string
  payMin: number
  payMax: number
  posterRating: number
}

interface ApplicationsFilterSheetProps {
  isOpen: boolean
  onClose: () => void
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  onApplyFilters: () => void
  onClearFilters: () => void
}

export default function ApplicationsFilterSheet({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  onApplyFilters,
  onClearFilters
}: ApplicationsFilterSheetProps) {
  const handleFilterChange = (key: keyof FilterState, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    })
  }

  const handleApply = () => {
    onApplyFilters()
    onClose()
  }

  const handleClear = () => {
    onClearFilters()
    onClose()
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px] bg-background/80 backdrop-blur-md border-border/50">
        <SheetHeader>
          <SheetTitle>Filter Applications</SheetTitle>
          <SheetDescription>
            Narrow down your applications using the filters below
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Status Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select
              value={filters.status}
              onValueChange={(value) => handleFilterChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Sort */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Date Applied</label>
            <Select
              value={filters.dateSort}
              onValueChange={(value) => handleFilterChange('dateSort', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Pay Range */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Pay Range (₹)</label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.payMin || ''}
                  onChange={(e) => handleFilterChange('payMin', Number(e.target.value) || 0)}
                />
              </div>
              <div>
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.payMax || ''}
                  onChange={(e) => handleFilterChange('payMax', Number(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>

          {/* Poster Rating */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Minimum Poster Rating</label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => handleFilterChange('posterRating', rating)}
                  className="p-1"
                >
                  <Star
                    className={`h-6 w-6 ${
                      rating <= filters.posterRating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
              <span className="text-sm text-muted-foreground ml-2">
                {filters.posterRating > 0 ? `${filters.posterRating}+ stars` : 'Any rating'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 mt-8">
          <Button onClick={handleApply} className="flex-1">
            Apply Filters
          </Button>
          <Button onClick={handleClear} variant="outline" className="flex-1">
            Clear Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
