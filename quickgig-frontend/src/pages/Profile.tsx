import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User } from '../types'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from '../components/ui/dialog'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from '../components/ui/sheet'
import { Input } from '../components/ui/input'
import { 
  User as UserIcon, 
  Star, 
  MapPin, 
  Calendar,
  Edit,
  Camera,
  Award,
  Briefcase,
  MessageCircle,
  Upload,
  FileText,
  Download,
  Phone,
  Mail,
  HelpCircle,
  X
} from 'lucide-react'

interface ProfileProps {
  user: User
  onUpdate: (user: User) => void
}

export default function Profile({ user, onUpdate }: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user.name,
    bio: user.bio || '',
    location: user.location || '',
    skills: user.skills?.join(', ') || ''
  })
  
  // Quick Actions state
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null)
  const [isPhotoDialogOpen, setIsPhotoDialogOpen] = useState(false)
  const [isCertificatesSheetOpen, setIsCertificatesSheetOpen] = useState(false)
  const [isSupportDialogOpen, setIsSupportDialogOpen] = useState(false)
  
  // Certificates state
  const [certificates, setCertificates] = useState([
    {
      id: '1',
      name: 'Professional Photography Certificate',
      type: 'PDF',
      uploadDate: '2024-01-15',
      size: '2.4 MB',
      file: null as File | null
    },
    {
      id: '2',
      name: 'Pet Care Certification',
      type: 'PDF',
      uploadDate: '2024-01-10',
      size: '1.8 MB',
      file: null as File | null
    },
    {
      id: '3',
      name: 'First Aid Certificate',
      type: 'JPG',
      uploadDate: '2024-01-05',
      size: '3.2 MB',
      file: null as File | null
    }
  ])
  

  const mockReviews = [
    {
      id: '1',
      rating: 5,
      comment: 'Excellent work! Very reliable and professional.',
      reviewerName: 'Sarah Johnson',
      gigTitle: 'Dog Walking Service',
      date: '2024-01-20'
    },
    {
      id: '2',
      rating: 4,
      comment: 'Great communication and completed the task on time.',
      reviewerName: 'Mike Chen',
      gigTitle: 'Grocery Shopping',
      date: '2024-01-15'
    },
    {
      id: '3',
      rating: 5,
      comment: 'Amazing photographer! Captured beautiful moments.',
      reviewerName: 'Lisa Park',
      gigTitle: 'Event Photography',
      date: '2024-01-10'
    }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSave = () => {
    const updatedUser: User = {
      ...user,
      name: formData.name,
      bio: formData.bio,
      location: formData.location,
      skills: formData.skills.split(',').map(s => s.trim()).filter(s => s)
    }
    onUpdate(updatedUser)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData({
      name: user.name,
      bio: user.bio || '',
      location: user.location || '',
      skills: user.skills?.join(', ') || ''
    })
    setIsEditing(false)
  }
  
  // Photo upload handlers
  const handlePhotoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedPhoto(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }
  
  const handlePhotoSave = () => {
    if (selectedPhoto && photoPreview) {
      // Save the photo preview as the profile photo
      setProfilePhoto(photoPreview)
      console.log('Photo saved:', selectedPhoto.name)
      setIsPhotoDialogOpen(false)
      setSelectedPhoto(null)
      setPhotoPreview(null)
    }
  }
  
  const handlePhotoCancel = () => {
    setSelectedPhoto(null)
    setPhotoPreview(null)
    setIsPhotoDialogOpen(false)
  }
  
  // Certificate upload handlers
  const handleCertificateUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const fileType = file.type.includes('pdf') ? 'PDF' : 
                      file.type.includes('jpeg') || file.type.includes('jpg') ? 'JPG' : 
                      file.type.includes('png') ? 'PNG' : 'Unknown'
      
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1)
      const currentDate = new Date().toISOString().split('T')[0]
      
      const newCertificate = {
        id: Date.now().toString(),
        name: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
        type: fileType,
        uploadDate: currentDate,
        size: `${fileSizeMB} MB`,
        file: file
      }
      
      setCertificates(prev => [newCertificate, ...prev])
      
      // Reset file input
      event.target.value = ''
    }
  }
  
  const handleCertificateDownload = (certificate: any) => {
    if (certificate.file) {
      // Create download link for uploaded file
      const url = URL.createObjectURL(certificate.file)
      const a = document.createElement('a')
      a.href = url
      a.download = `${certificate.name}.${certificate.type.toLowerCase()}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } else {
      // Mock download for existing certificates
      console.log(`Downloading ${certificate.name}`)
      alert(`Download started for ${certificate.name}`)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-muted-foreground mt-1">
          Manage your profile information and view your ratings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Profile Information</CardTitle>
                {!isEditing && (
                  <Button variant="outline" onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Bio</label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      placeholder="Tell others about yourself..."
                      className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="Your city or area"
                      className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Skills</label>
                    <input
                      type="text"
                      name="skills"
                      value={formData.skills}
                      onChange={handleInputChange}
                      placeholder="e.g., Photography, Pet Care, Cleaning"
                      className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Separate skills with commas
                    </p>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button onClick={handleSave}>Save Changes</Button>
                    <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <div className="h-20 w-20 bg-primary rounded-full flex items-center justify-center overflow-hidden">
                        {profilePhoto ? (
                          <img
                            src={profilePhoto}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <UserIcon className="h-10 w-10 text-primary-foreground" />
                        )}
                      </div>
                      <button 
                        onClick={() => setIsPhotoDialogOpen(true)}
                        className="absolute -bottom-1 -right-1 h-6 w-6 bg-background border-2 border-background rounded-full flex items-center justify-center shadow-md hover:bg-muted transition-colors"
                      >
                        <Camera className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold">{user.name}</h2>
                      <p className="text-muted-foreground capitalize">{user.role}</p>
                      {user.location && (
                        <div className="flex items-center mt-1">
                          <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{user.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {user.bio && (
                    <div>
                      <h3 className="font-medium mb-2">About</h3>
                      <p className="text-muted-foreground">{user.bio}</p>
                    </div>
                  )}
                  
                  {user.skills && user.skills.length > 0 && (
                    <div>
                      <h3 className="font-medium mb-2">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {user.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Reviews & Ratings */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Reviews & Ratings</CardTitle>
              <CardDescription>What others say about working with you</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockReviews.map((review) => (
                  <div key={review.id} className="border-b pb-4 last:border-b-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{review.reviewerName}</span>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{review.gigTitle}</p>
                      </div>
                      <span className="text-sm text-muted-foreground">{review.date}</span>
                    </div>
                    <p className="text-sm">{review.comment}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Profile Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-400" />
                  <span>Rating</span>
                </div>
                <span className="font-semibold">{user.rating}/5.0</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span>Completed Gigs</span>
                </div>
                <span className="font-semibold">{user.completedGigs}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-muted-foreground" />
                  <span>Reviews</span>
                </div>
                <span className="font-semibold">{mockReviews.length}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Member Since</span>
                </div>
                <span className="font-semibold">Jan 2024</span>
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
              <CardDescription>Your milestones and badges</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Award className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">Top Rated</p>
                  <p className="text-xs text-muted-foreground">Maintained 4.5+ rating</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Briefcase className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">Reliable Worker</p>
                  <p className="text-xs text-muted-foreground">Completed 25+ gigs</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Star className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">Quick Responder</p>
                  <p className="text-xs text-muted-foreground">Fast response time</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your profile and get help</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Update Photo */}
              <Dialog open={isPhotoDialogOpen} onOpenChange={setIsPhotoDialogOpen}>
                <DialogTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button variant="outline" className="w-full justify-start h-12">
                      <Camera className="h-4 w-4 mr-3" />
                      <div className="text-left">
                        <div className="font-medium">Update Photo</div>
                        <div className="text-xs text-muted-foreground">Change your profile picture</div>
                      </div>
                    </Button>
                  </motion.div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Update Profile Photo</DialogTitle>
                    <DialogDescription>
                      Choose a new profile picture. Recommended size: 400x400px
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="flex flex-col items-center space-y-4">
                      {photoPreview ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="relative"
                        >
                          <img
                            src={photoPreview}
                            alt="Preview"
                            className="w-32 h-32 rounded-full object-cover border-4 border-primary"
                          />
                          <button
                            onClick={() => {
                              setPhotoPreview(null)
                              setSelectedPhoto(null)
                            }}
                            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </motion.div>
                      ) : (
                        <div className="w-32 h-32 bg-muted rounded-full flex items-center justify-center border-2 border-dashed border-muted-foreground">
                          <Upload className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                      
                      <div className="w-full">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoSelect}
                          className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                        />
                        <p className="text-xs text-muted-foreground mt-2 text-center">
                          Choose an image file (JPG, PNG, GIF)
                        </p>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={handlePhotoCancel}>
                      Cancel
                    </Button>
                    <Button onClick={handlePhotoSave} disabled={!selectedPhoto}>
                      Save Photo
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* View Certificates */}
              <Sheet open={isCertificatesSheetOpen} onOpenChange={setIsCertificatesSheetOpen}>
                <SheetTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button variant="outline" className="w-full justify-start h-12">
                      <Award className="h-4 w-4 mr-3" />
                      <div className="text-left">
                        <div className="font-medium">View Certificates</div>
                        <div className="text-xs text-muted-foreground">Manage your credentials</div>
                      </div>
                    </Button>
                  </motion.div>
                </SheetTrigger>
                <SheetContent className="w-[400px] sm:w-[540px]">
                  <SheetHeader>
                    <SheetTitle>Certificates & Credentials</SheetTitle>
                    <SheetDescription>
                      Your uploaded certificates and skill verifications
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium">Uploaded Files ({certificates.length})</h3>
                      <div className="relative">
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={handleCertificateUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          id="certificate-upload"
                        />
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload New
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-3 max-h-[500px] overflow-y-auto">
                      <AnimatePresence>
                        {certificates.map((cert, index) => (
                          <motion.div
                            key={cert.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-primary/10 rounded-md">
                                <FileText className="h-4 w-4 text-primary" />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-sm">{cert.name}</p>
                                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                  <span>{cert.type}</span>
                                  <span>•</span>
                                  <span>{cert.size}</span>
                                  <span>•</span>
                                  <span>{cert.uploadDate}</span>
                                </div>
                              </div>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleCertificateDownload(cert)}
                              className="hover:bg-blue-50 hover:text-blue-600"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                    
                    {certificates.length === 0 && (
                      <div className="text-center py-8">
                        <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">No certificates uploaded yet</p>
                        <div className="relative mt-4">
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={handleCertificateUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <Button className="bg-blue-600 hover:bg-blue-700">
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Your First Certificate
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>

              {/* Contact Support */}
              <Dialog open={isSupportDialogOpen} onOpenChange={setIsSupportDialogOpen}>
                <DialogTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button variant="outline" className="w-full justify-start h-12">
                      <MessageCircle className="h-4 w-4 mr-3" />
                      <div className="text-left">
                        <div className="font-medium">Contact Support</div>
                        <div className="text-xs text-muted-foreground">Get help when you need it</div>
                      </div>
                    </Button>
                  </motion.div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Contact Support</DialogTitle>
                    <DialogDescription>
                      Choose how you'd like to get help from our support team
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button variant="outline" className="w-full justify-start h-16">
                        <MessageCircle className="h-5 w-5 mr-3 text-green-600" />
                        <div className="text-left">
                          <div className="font-medium">Start Live Chat</div>
                          <div className="text-xs text-muted-foreground">Get instant help from our team</div>
                        </div>
                      </Button>
                    </motion.div>
                    
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button variant="outline" className="w-full justify-start h-16">
                        <Mail className="h-5 w-5 mr-3 text-blue-600" />
                        <div className="text-left">
                          <div className="font-medium">Send Email</div>
                          <div className="text-xs text-muted-foreground">support@quickgig.com</div>
                        </div>
                      </Button>
                    </motion.div>
                    
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button variant="outline" className="w-full justify-start h-16">
                        <HelpCircle className="h-5 w-5 mr-3 text-purple-600" />
                        <div className="text-left">
                          <div className="font-medium">Help Center</div>
                          <div className="text-xs text-muted-foreground">Browse FAQs and guides</div>
                        </div>
                      </Button>
                    </motion.div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsSupportDialogOpen(false)}>
                      Close
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
