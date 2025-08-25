import { motion } from 'framer-motion'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Calendar, DollarSign, FileText, User, Clock, Download } from 'lucide-react'

interface Application {
  id: string
  gigTitle: string
  clientName: string
  coverLetter: string
  expectedPay: string
  availability: string
  attachedFile?: {
    name: string
    type: string
    size: number
  }
  submittedAt: string
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected'
}

interface ViewApplicationModalProps {
  isOpen: boolean
  onClose: () => void
  application: Application | null
}

export function ViewApplicationModal({ isOpen, onClose, application }: ViewApplicationModalProps) {
  if (!application) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'reviewed': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'accepted': return 'bg-green-100 text-green-800 border-green-200'
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Application Details</DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Gig Info */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{application.gigTitle}</CardTitle>
                <Badge className={getStatusColor(application.status)}>
                  {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                </Badge>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <User className="w-4 h-4 mr-1" />
                Client: {application.clientName}
              </div>
            </CardHeader>
          </Card>

          {/* Application Details */}
          <div className="grid gap-4">
            {/* Cover Letter */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Cover Letter
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {application.coverLetter}
                </p>
              </CardContent>
            </Card>

            {/* Pay & Availability */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Expected Pay
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold text-green-600">
                    ${application.expectedPay}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    Availability
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {application.availability}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Attached File */}
            {application.attachedFile && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    Attached File
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                        <FileText className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{application.attachedFile.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(application.attachedFile.size)}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Submission Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Submission Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Submitted on {new Date(application.submittedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
