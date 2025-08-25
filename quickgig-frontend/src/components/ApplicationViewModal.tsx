import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { MapPin, DollarSign, Calendar, Star, User, Clock } from 'lucide-react'
import { Application } from '../types'

interface ApplicationViewModalProps {
  isOpen: boolean
  onClose: () => void
  application: (Application & { gigTitle: string; gigPay: number; gigDescription?: string; gigLocation?: string; posterName: string; posterRating?: number }) | null
}

export default function ApplicationViewModal({
  isOpen,
  onClose,
  application
}: ApplicationViewModalProps) {
  if (!application) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'accepted':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{application.gigTitle}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Basic Info */}
          <div className="flex items-center justify-between">
            <Badge className={getStatusColor(application.status)}>
              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
            </Badge>
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-1" />
              Applied {new Date(application.appliedAt).toLocaleDateString()}
            </div>
          </div>

          {/* Job Description */}
          {application.gigDescription && (
            <div>
              <h3 className="font-semibold mb-2">Job Description</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {application.gigDescription}
              </p>
            </div>
          )}

          {/* Pay and Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium">₹{application.gigPay}</p>
                <p className="text-xs text-muted-foreground">Pay Rate</p>
              </div>
            </div>
            
            {application.gigLocation && (
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">{application.gigLocation}</p>
                  <p className="text-xs text-muted-foreground">Location</p>
                </div>
              </div>
            )}
          </div>

          {/* Employer Details */}
          <div>
            <h3 className="font-semibold mb-3">Employer Details</h3>
            <div className="flex items-center space-x-3 p-4 bg-muted rounded-lg">
              <div className="h-12 w-12 bg-primary rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{application.posterName}</p>
                {application.posterRating && (
                  <div className="flex items-center mt-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                    <span className="text-sm">{application.posterRating} rating</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Your Application Message */}
          {application.message && (
            <div>
              <h3 className="font-semibold mb-2">Your Application Message</h3>
              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <p className="text-sm italic">"{application.message}"</p>
              </div>
            </div>
          )}

          {/* Application Timeline */}
          <div>
            <h3 className="font-semibold mb-3">Application Timeline</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Applied on {new Date(application.appliedAt).toLocaleDateString()}</span>
              </div>
              {application.status === 'accepted' && (
                <div className="flex items-center space-x-2 text-sm text-green-600">
                  <Clock className="h-4 w-4" />
                  <span>Application accepted</span>
                </div>
              )}
              {application.status === 'completed' && (
                <div className="flex items-center space-x-2 text-sm text-blue-600">
                  <Clock className="h-4 w-4" />
                  <span>Job completed</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {application.status === 'accepted' && (
            <Button>
              Contact Employer
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
