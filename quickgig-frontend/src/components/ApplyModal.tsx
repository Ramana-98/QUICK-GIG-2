import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Gig } from '../types'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { useToast } from '../hooks/use-toast'
import { 
  Upload,
  Loader2,
  X
} from 'lucide-react'

interface ApplyModalProps {
  isOpen: boolean
  onClose: () => void
  gig: Gig
  user: User
  onApplicationSubmitted: (gigId: string) => void
  onApplicationError?: (gigId: string) => void
}

export default function ApplyModal({ isOpen, onClose, gig, user, onApplicationSubmitted, onApplicationError }: ApplyModalProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    coverLetter: '',
    expectedPay: gig.pay.toString(),
    availability: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select a file smaller than 5MB",
          variant: "destructive"
        })
        return
      }
      
      // Check file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png']
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please select a PDF, DOC, DOCX, JPG, or PNG file",
          variant: "destructive"
        })
        return
      }
      
      setSelectedFile(file)
    }
  }

  const removeFile = () => {
    setSelectedFile(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.coverLetter.trim()) {
      toast({
        title: "Cover letter required",
        description: "Please write a cover letter for your application",
        variant: "destructive"
      })
      return
    }

    if (!formData.availability.trim()) {
      toast({
        title: "Availability required",
        description: "Please specify your availability",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Mock API call - replace with actual API endpoint
      const applicationData = {
        userId: user.id,
        gigId: gig.id,
        coverLetter: formData.coverLetter,
        expectedPay: parseFloat(formData.expectedPay),
        availability: formData.availability,
        attachment: selectedFile
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock success response
      console.log('Application submitted:', applicationData)
      
      toast({
        title: "Application submitted!",
        description: "Your application has been sent to the employer",
      })
      
      onApplicationSubmitted(gig.id)
      onClose()
      
      // Reset form
      setFormData({
        coverLetter: '',
        expectedPay: gig.pay.toString(),
        availability: ''
      })
      setSelectedFile(null)
      
    } catch (error) {
      console.error('Application submission failed:', error)
      toast({
        title: "Something went wrong",
        description: "Please try again later",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      coverLetter: '',
      expectedPay: gig.pay.toString(),
      availability: ''
    })
    setSelectedFile(null)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Apply for this Gig</DialogTitle>
          <div className="text-sm text-muted-foreground">
            <p className="font-medium">{gig.title}</p>
            <p>by {gig.posterName}</p>
          </div>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Cover Letter */}
          <div className="space-y-2">
            <Label htmlFor="coverLetter">Cover Letter *</Label>
            <textarea
              id="coverLetter"
              name="coverLetter"
              value={formData.coverLetter}
              onChange={handleInputChange}
              placeholder="Tell the employer why you're the right person for this gig..."
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring min-h-[100px] resize-y"
              required
            />
          </div>

          {/* Expected Pay */}
          <div className="space-y-2">
            <Label htmlFor="expectedPay">Expected Pay (₹)</Label>
            <Input
              id="expectedPay"
              name="expectedPay"
              type="number"
              value={formData.expectedPay}
              onChange={handleInputChange}
              placeholder="Enter your expected pay"
              min="0"
              step="0.01"
            />
            <p className="text-xs text-muted-foreground">
              Suggested: ₹{gig.pay} ({gig.payType})
            </p>
          </div>

          {/* Availability */}
          <div className="space-y-2">
            <Label htmlFor="availability">Availability *</Label>
            <Input
              id="availability"
              name="availability"
              value={formData.availability}
              onChange={handleInputChange}
              placeholder="e.g., Available weekdays 9 AM - 5 PM"
              required
            />
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label>Resume/Portfolio (Optional)</Label>
            <div className="space-y-2">
              {selectedFile ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-3 bg-muted rounded-md"
                >
                  <div className="flex items-center space-x-2">
                    <div className="p-1 bg-primary/10 rounded">
                      <Upload className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{selectedFile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeFile}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </motion.div>
              ) : (
                <div className="relative">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-md p-6 text-center hover:border-muted-foreground/50 transition-colors">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload resume or portfolio
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PDF, DOC, DOCX, JPG, PNG (max 5MB)
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="min-w-[120px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Application'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
