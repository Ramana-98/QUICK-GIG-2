import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from './ui/button'
import { Input } from './ui/input'


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { X, CreditCard, Building2, Smartphone, Loader2 } from 'lucide-react'
import { useToast } from '../hooks/use-toast'

interface AddPaymentMethodModalProps {
  isOpen: boolean
  onClose: () => void
  onAdded?: (method: { id: string; type: 'bank'|'upi'|'card'; label: string; meta?: Record<string,string> }) => void
}

interface PaymentFormData {
  paymentType: string
  accountHolderName: string
  accountNumber: string
  ifscCode: string
  bankName: string
  upiId: string
  cardNumber: string
  cardHolderName: string
  expiryDate: string
  cvv: string
}

export default function AddPaymentMethodModal({ isOpen, onClose, onAdded }: AddPaymentMethodModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<PaymentFormData>({
    paymentType: '',
    accountHolderName: '',
    accountNumber: '',
    ifscCode: '',
    bankName: '',
    upiId: '',
    cardNumber: '',
    cardHolderName: '',
    expiryDate: '',
    cvv: ''
  })
  
  const { toast } = useToast()

  const handleInputChange = (field: keyof PaymentFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    setIsLoading(false)
    
    toast({
      variant: "success",
      title: "Payment method added successfully ✅",
      description: "Your payment method has been saved and is ready to use.",
    })

    // Return the created method to parent if requested
    if (onAdded) {
      const id = String(Date.now())
      if (formData.paymentType === 'bank') {
        onAdded({
          id,
          type: 'bank',
          label: `${formData.bankName} ••••${formData.accountNumber.slice(-4)}`,
          meta: { ifsc: formData.ifscCode, name: formData.accountHolderName }
        })
      } else if (formData.paymentType === 'upi') {
        onAdded({
          id,
          type: 'upi',
          label: `${formData.upiId}`,
          meta: { name: formData.accountHolderName }
        })
      } else if (formData.paymentType === 'card') {
        onAdded({
          id,
          type: 'card',
          label: `•••• ${formData.cardNumber.slice(-4)} (exp ${formData.expiryDate})`,
          meta: { name: formData.cardHolderName }
        })
      }
    }

    // Reset form and close modal
    setFormData({
      paymentType: '',
      accountHolderName: '',
      accountNumber: '',
      ifscCode: '',
      bankName: '',
      upiId: '',
      cardNumber: '',
      cardHolderName: '',
      expiryDate: '',
      cvv: ''
    })
    onClose()
  }

  const handleClose = () => {
    if (!isLoading) {
      onClose()
    }
  }

  const renderFormFields = () => {
    switch (formData.paymentType) {
      case 'bank':
        return (
          <div className="space-y-4">
            <div>
                             <label htmlFor="accountHolderName" className="font-sans font-medium text-gray-700">
                 Account Holder Name
               </label>
              <Input
                id="accountHolderName"
                type="text"
                placeholder="Enter account holder name"
                value={formData.accountHolderName}
                onChange={(e) => handleInputChange('accountHolderName', e.target.value)}
                className="font-sans mt-1"
                required
              />
            </div>
            
            <div>
                             <label htmlFor="bankName" className="font-sans font-medium text-gray-700">
                 Bank Name
               </label>
              <Input
                id="bankName"
                type="text"
                placeholder="Enter bank name"
                value={formData.bankName}
                onChange={(e) => handleInputChange('bankName', e.target.value)}
                className="font-sans mt-1"
                required
              />
            </div>
            
            <div>
              <label htmlFor="accountNumber" className="font-sans font-medium text-gray-700">
                Account Number
              </label>
              <Input
                id="accountNumber"
                type="text"
                placeholder="Enter account number"
                value={formData.accountNumber}
                onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                className="font-sans mt-1"
                required
              />
            </div>
            
            <div>
              <label htmlFor="ifscCode" className="font-sans font-medium text-gray-700">
                IFSC Code
              </label>
              <Input
                id="ifscCode"
                type="text"
                placeholder="Enter IFSC code"
                value={formData.ifscCode}
                onChange={(e) => handleInputChange('ifscCode', e.target.value)}
                className="font-sans mt-1"
                required
              />
            </div>
          </div>
        )

      case 'upi':
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="accountHolderName" className="font-sans font-medium text-gray-700">
                Account Holder Name
              </label>
              <Input
                id="accountHolderName"
                type="text"
                placeholder="Enter account holder name"
                value={formData.accountHolderName}
                onChange={(e) => handleInputChange('accountHolderName', e.target.value)}
                className="font-sans mt-1"
                required
              />
            </div>
            
            <div>
              <label htmlFor="upiId" className="font-sans font-medium text-gray-700">
                UPI ID
              </label>
              <Input
                id="upiId"
                type="text"
                placeholder="example@upi"
                value={formData.upiId}
                onChange={(e) => handleInputChange('upiId', e.target.value)}
                className="font-sans mt-1"
                required
              />
            </div>
          </div>
        )

      case 'card':
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="cardHolderName" className="font-sans font-medium text-gray-700">
                Card Holder Name
              </label>
              <Input
                id="cardHolderName"
                type="text"
                placeholder="Enter card holder name"
                value={formData.cardHolderName}
                onChange={(e) => handleInputChange('cardHolderName', e.target.value)}
                className="font-sans mt-1"
                required
              />
            </div>
            
            <div>
              <label htmlFor="cardNumber" className="font-sans font-medium text-gray-700">
                Card Number
              </label>
              <Input
                id="cardNumber"
                type="text"
                placeholder="1234 5678 9012 3456"
                value={formData.cardNumber}
                onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                className="font-sans mt-1"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="expiryDate" className="font-sans font-medium text-gray-700">
                  Expiry Date
                </label>
                <Input
                  id="expiryDate"
                  type="text"
                  placeholder="MM/YY"
                  value={formData.expiryDate}
                  onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                  className="font-sans mt-1"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="cvv" className="font-sans font-medium text-gray-700">
                  CVV
                </label>
                <Input
                  id="cvv"
                  type="text"
                  placeholder="123"
                  value={formData.cvv}
                  onChange={(e) => handleInputChange('cvv', e.target.value)}
                  className="font-sans mt-1"
                  required
                />
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md"
          >
            <Card className="relative">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="font-poppins font-semibold text-xl">
                      Add Payment Method
                    </CardTitle>
                    <CardDescription className="font-sans text-gray-600">
                      Choose your preferred payment method
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleClose}
                    disabled={isLoading}
                    className="h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Payment Type Selection */}
                  <div className="space-y-3">
                                         <label className="font-sans font-medium text-gray-700">
                       Payment Method Type
                     </label>
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => handleInputChange('paymentType', 'bank')}
                        className={`p-3 border rounded-lg text-center transition-colors ${
                          formData.paymentType === 'bank'
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Building2 className="h-6 w-6 mx-auto mb-2" />
                        <span className="text-sm font-sans">Bank</span>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => handleInputChange('paymentType', 'upi')}
                        className={`p-3 border rounded-lg text-center transition-colors ${
                          formData.paymentType === 'upi'
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Smartphone className="h-6 w-6 mx-auto mb-2" />
                        <span className="text-sm font-sans">UPI</span>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => handleInputChange('paymentType', 'card')}
                        className={`p-3 border rounded-lg text-center transition-colors ${
                          formData.paymentType === 'card'
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <CreditCard className="h-6 w-6 mx-auto mb-2" />
                        <span className="text-sm font-sans">Card</span>
                      </button>
                    </div>
                  </div>

                  {/* Dynamic Form Fields */}
                  {formData.paymentType && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {renderFormFields()}
                    </motion.div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleClose}
                      disabled={isLoading}
                      className="flex-1 font-sans"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={!formData.paymentType || isLoading}
                      className="flex-1 font-sans"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        'Save Payment Method'
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
