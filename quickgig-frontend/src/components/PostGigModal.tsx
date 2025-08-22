import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { X, Calendar, MapPin, DollarSign, Clock, Briefcase, FileText } from 'lucide-react'

interface PostGigModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

interface GigFormData {
  title: string
  description: string
  category: string
  budget: string
  duration: string
  location: string
  date: string
  time: string
}

const categories = [
  'Delivery',
  'Event Help', 
  'Cleaning',
  'Photography',
  'Pet Care',
  'Shopping',
  'Tutoring',
  'Home Repair',
  'Moving Help',
  'Other'
]

const durations = [
  '1 hour',
  '2 hours',
  '3 hours',
  '4 hours',
  '1 day',
  '2 days',
  '1 week',
  'Flexible'
]

export default function PostGigModal({ isOpen, onClose, onSuccess }: PostGigModalProps) {
  const [formData, setFormData] = useState<GigFormData>({
    title: '',
    description: '',
    category: '',
    budget: '',
    duration: '',
    location: '',
    date: '',
    time: ''
  })

  const [errors, setErrors] = useState<Partial<GigFormData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateField = (field: keyof GigFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<GigFormData> = {}

    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    if (!formData.category) newErrors.category = 'Category is required'
    if (!formData.budget.trim()) newErrors.budget = 'Budget is required'
    if (!formData.duration) newErrors.duration = 'Duration is required'
    if (!formData.location.trim()) newErrors.location = 'Location is required'
    if (!formData.date) newErrors.date = 'Date is required'
    if (!formData.time) newErrors.time = 'Time is required'

    // Budget validation
    if (formData.budget && isNaN(Number(formData.budget))) {
      newErrors.budget = 'Budget must be a valid number'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Log the gig data
    console.log('New Gig Posted:', {
      ...formData,
      budget: `₹${formData.budget}`,
      createdAt: new Date().toISOString(),
      id: Math.random().toString(36).substr(2, 9)
    })

    setIsSubmitting(false)
    onSuccess()
    handleClose()
  }

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      budget: '',
      duration: '',
      location: '',
      date: '',
      time: ''
    })
    setErrors({})
    onClose()
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
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={handleClose}
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="shadow-2xl border-0">
                <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                        <Briefcase className="h-5 w-5 text-white" />
                      </div>
                      <CardTitle className="text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Post a New Gig
                      </CardTitle>
                    </div>
                    <Button variant="ghost" size="icon" onClick={handleClose}>
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-500" />
                        Gig Title *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => updateField('title', e.target.value)}
                        placeholder="e.g., Need help with event photography"
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                          errors.title ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <FileText className="h-4 w-4 text-green-500" />
                        Description *
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => updateField('description', e.target.value)}
                        placeholder="Describe the work in detail..."
                        rows={4}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none ${
                          errors.description ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                    </div>

                    {/* Category and Budget Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Category */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                          <Briefcase className="h-4 w-4 text-purple-500" />
                          Category *
                        </label>
                        <select
                          value={formData.category}
                          onChange={(e) => updateField('category', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                            errors.category ? 'border-red-500' : 'border-gray-300'
                          }`}
                        >
                          <option value="">Select category</option>
                          {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        </select>
                        {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
                      </div>

                      {/* Budget */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-yellow-500" />
                          Budget (₹) *
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                          <input
                            type="number"
                            value={formData.budget}
                            onChange={(e) => updateField('budget', e.target.value)}
                            placeholder="500"
                            min="0"
                            className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                              errors.budget ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                        </div>
                        {errors.budget && <p className="text-red-500 text-sm">{errors.budget}</p>}
                      </div>
                    </div>

                    {/* Duration and Location Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Duration */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                          <Clock className="h-4 w-4 text-orange-500" />
                          Duration *
                        </label>
                        <select
                          value={formData.duration}
                          onChange={(e) => updateField('duration', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                            errors.duration ? 'border-red-500' : 'border-gray-300'
                          }`}
                        >
                          <option value="">Select duration</option>
                          {durations.map(duration => (
                            <option key={duration} value={duration}>{duration}</option>
                          ))}
                        </select>
                        {errors.duration && <p className="text-red-500 text-sm">{errors.duration}</p>}
                      </div>

                      {/* Location */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-red-500" />
                          Location *
                        </label>
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) => updateField('location', e.target.value)}
                          placeholder="e.g., Downtown Area, Mumbai"
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                            errors.location ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
                      </div>
                    </div>

                    {/* Date and Time Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Date */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-indigo-500" />
                          Date *
                        </label>
                        <input
                          type="date"
                          value={formData.date}
                          onChange={(e) => updateField('date', e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                            errors.date ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
                      </div>

                      {/* Time */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                          <Clock className="h-4 w-4 text-teal-500" />
                          Time *
                        </label>
                        <input
                          type="time"
                          value={formData.time}
                          onChange={(e) => updateField('time', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                            errors.time ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors.time && <p className="text-red-500 text-sm">{errors.time}</p>}
                      </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium py-3"
                      >
                        {isSubmitting ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                          />
                        ) : (
                          <Briefcase className="w-4 h-4 mr-2" />
                        )}
                        {isSubmitting ? 'Posting...' : 'Post Gig'}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="flex-1 sm:flex-none px-6"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
