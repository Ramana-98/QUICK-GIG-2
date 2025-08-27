import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { 
  HelpCircle, 
  MessageSquare, 
  Phone, 
  Mail, 
  Send,
  CheckCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { useToast } from '../hooks/use-toast'

interface ContactForm {
  name: string
  email: string
  message: string
}

interface FAQItem {
  id: string
  question: string
  answer: string
  isOpen: boolean
}

const initialFaqData = [
  {
    id: "item-1",
    question: "How do I post a gig on QuickGig?",
    answer: "To post a gig, click the 'Post a Gig' button in your dashboard or navigation. Fill out the required details including title, description, category, budget, duration, location, and preferred date/time. Once submitted, your gig will be live and visible to seekers.",
    isOpen: false
  },
  {
    id: "item-2", 
    question: "How do payments work on QuickGig?",
    answer: "Payments are processed securely through our platform. When you hire someone, the payment is held in escrow until the work is completed. Once you approve the work, the payment is released to the service provider. We support multiple payment methods including cards and digital wallets.",
    isOpen: false
  },
  {
    id: "item-3",
    question: "What if I'm not satisfied with the work?",
    answer: "We have a dispute resolution system in place. If you're not satisfied, you can raise a dispute within 48 hours of work completion. Our support team will review the case and mediate between both parties to reach a fair resolution.",
    isOpen: false
  },
  {
    id: "item-4",
    question: "How do I become a verified service provider?",
    answer: "To get verified, upload your relevant certificates, ID proof, and complete your profile with portfolio samples. Our team reviews applications within 2-3 business days. Verified providers get a badge and higher visibility in search results.",
    isOpen: false
  },
  {
    id: "item-5",
    question: "Can I cancel a gig after posting?",
    answer: "Yes, you can cancel a gig before anyone applies to it. If applications have been received, you'll need to contact our support team. Frequent cancellations may affect your account rating.",
    isOpen: false
  }
]

export default function Help() {
  const { toast } = useToast()
  const [contactForm, setContactForm] = useState<ContactForm>({
    name: '',
    email: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [faqData, setFaqData] = useState<FAQItem[]>(initialFaqData)

  const toggleFAQ = (id: string) => {
    setFaqData(prev => prev.map(item => 
      item.id === id ? { ...item, isOpen: !item.isOpen } : item
    ))
  }

  const handleInputChange = (field: keyof ContactForm, value: string) => {
    setContactForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    console.log('Support request submitted:', contactForm)
    
    toast({
      title: "Message Sent Successfully!",
      description: "Our support team will get back to you within 24 hours.",
    })
    
    // Reset form
    setContactForm({ name: '', email: '', message: '' })
    setIsSubmitting(false)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className="space-y-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto space-y-6"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <HelpCircle className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Help & Support
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Find answers to common questions or get in touch with our support team
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* FAQ Section */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm border-border/50 h-[458px] flex flex-col">
              <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 flex-shrink-0">
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-blue-500" />
                  Frequently Asked Questions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 flex-1 overflow-hidden">
                <motion.div 
                  className="space-y-3 h-full overflow-y-auto pr-2 hide-scrollbar"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.15,
                        delayChildren: 0.2
                      }
                    }
                  }}
                  initial="hidden"
                  animate="visible"
                >
                  {faqData.map((faq, index) => (
                    <motion.div 
                      key={faq.id}
                      className="border border-border/50 rounded-lg overflow-hidden hover:bg-accent/50 transition-colors"
                      variants={{
                        hidden: { 
                          opacity: 0, 
                          y: 20,
                          scale: 0.95
                        },
                        visible: { 
                          opacity: 1, 
                          y: 0,
                          scale: 1,
                          transition: {
                            type: "spring",
                            stiffness: 100,
                            damping: 15,
                            duration: 0.6
                          }
                        }
                      }}
                      whileHover={{
                        scale: 1.02,
                        transition: { duration: 0.2 }
                      }}
                    >
                      <button
                        onClick={() => toggleFAQ(faq.id)}
                        className="w-full px-4 py-4 text-left flex items-center justify-between font-medium hover:bg-accent/50 transition-colors"
                      >
                        <span>{faq.question}</span>
                        <motion.div
                          animate={{ rotate: faq.isOpen ? 180 : 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                          {faq.isOpen ? (
                            <ChevronUp className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          )}
                        </motion.div>
                      </button>
                      <motion.div
                        initial={false}
                        animate={{ height: faq.isOpen ? 'auto' : 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <motion.div 
                          className="px-4 pb-4 text-muted-foreground"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: faq.isOpen ? 1 : 0 }}
                          transition={{ duration: 0.2, delay: faq.isOpen ? 0.1 : 0 }}
                        >
                          {faq.answer}
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  ))}
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Support Info */}
          <motion.div variants={itemVariants} className="space-y-6">
            <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader className="border-b bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-950 dark:to-teal-950">
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-green-500" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/30">
                  <Mail className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium text-sm">Email Support</p>
                    <p className="text-sm text-muted-foreground">support@quickgig.com</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/30">
                  <Phone className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium text-sm">Phone Support</p>
                    <p className="text-sm text-muted-foreground">+91 98765 43210</p>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-blue-500" />
                    <p className="font-medium text-sm text-blue-700 dark:text-blue-300">Support Hours</p>
                  </div>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    Monday - Friday: 9 AM - 6 PM IST<br />
                    Saturday: 10 AM - 4 PM IST
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Contact Form */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader className="border-b bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-purple-500" />
                Contact Support
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Name *</label>
                    <Input
                      type="text"
                      value={contactForm.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Your full name"
                      className="transition-all duration-200 focus:ring-2 focus:ring-purple-500 shine-border shine-border-purple"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email *</label>
                    <Input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="your.email@example.com"
                      className="transition-all duration-200 focus:ring-2 focus:ring-purple-500 shine-border shine-border-purple"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Message *</label>
                  <textarea
                    value={contactForm.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    placeholder="Describe your issue or question in detail..."
                    rows={5}
                    className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none bg-background shine-border shine-border-purple"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full md:w-auto bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-2 px-6"
                >
                  {isSubmitting ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                    />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
