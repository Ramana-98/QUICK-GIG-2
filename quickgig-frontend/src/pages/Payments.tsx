import { useState } from 'react'
import { motion } from 'framer-motion'
import { User } from '../types'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../components/ui/sheet'
import { AnimatedCounter } from '../components/ui/animated-counter'
import ExportDropdown from '../components/ExportDropdown'
import AddPaymentMethodModal from '../components/AddPaymentMethodModal'
import { Input } from '../components/ui/input'
import { useToast } from '../hooks/use-toast'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { 
  DollarSign, 
  TrendingUp, 
  Calendar,
  Download,
  CreditCard,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  IndianRupee
} from 'lucide-react'

interface PaymentsProps {
  user: User
}

// Mock data
const mockTransactions = [
  {
    id: '1',
    type: 'earned',
    amount: 45,
    description: 'Dog Walking Service - Sarah Johnson',
    date: '2024-01-20',
    status: 'completed'
  },
  {
    id: '2',
    type: 'earned',
    amount: 25,
    description: 'Grocery Shopping Assistant - Mike Chen',
    date: '2024-01-19',
    status: 'pending'
  },
  {
    id: '3',
    type: 'spent',
    amount: 150,
    description: 'Event Photography - Alex Chen',
    date: '2024-01-18',
    status: 'completed'
  }
]

const mockEarningsData = [
  { month: 'Jan', amount: 320 },
  { month: 'Feb', amount: 450 },
  { month: 'Mar', amount: 380 },
  { month: 'Apr', amount: 520 },
  { month: 'May', amount: 680 },
  { month: 'Jun', amount: 750 }
]

export default function Payments({ user }: PaymentsProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [transactions] = useState(mockTransactions)
  const [isAddPaymentMethodOpen, setIsAddPaymentMethodOpen] = useState(false)
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false)
  const [isMethodsOpen, setIsMethodsOpen] = useState(false)
  const [availableBalance] = useState(245)
  const [withdrawAmount, setWithdrawAmount] = useState<number>(245)
  const [savedMethods, setSavedMethods] = useState<Array<{ id: string; type: 'bank'|'upi'|'card'; label: string }>>([
    { id: 'm1', type: 'bank', label: 'HDFC Bank ••••1234' },
    { id: 'm2', type: 'upi', label: 'john.doe@upi' },
  ])
  const [selectedMethodId, setSelectedMethodId] = useState<string>('m1')
  const { toast } = useToast()

  // Tooltip state for Analytics chart
  const [hoveredBar, setHoveredBar] = useState<{ month: string; amount: number; x: number; y: number; visible: boolean }>({ month: '', amount: 0, x: 0, y: 0, visible: false })

  const handleDownloadStatement = () => {
    // Create a CSV content for the statement
    const csvContent = [
      ['Date', 'Description', 'Type', 'Amount', 'Status'],
      ...transactions.map(t => [
        t.date,
        t.description,
        t.type,
        `₹${t.amount}`,
        t.status
      ])
    ].map(row => row.join(',')).join('\n')

    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `payment-statement-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const handleConfirmWithdraw = async () => {
    await new Promise(r => setTimeout(r, 800))
    setIsWithdrawOpen(false)
    toast({
      variant: 'success',
      title: 'Withdrawal request submitted',
      description: `Amount: ₹${withdrawAmount} • Method: ${savedMethods.find(m => m.id === selectedMethodId)?.label || ''}`,
    })
  }

  const totalEarnings = transactions
    .filter(t => t.type === 'earned' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0)

  const pendingPayments = transactions
    .filter(t => t.type === 'earned' && t.status === 'pending')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalSpent = transactions
    .filter(t => t.type === 'spent' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0)

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'transactions', label: 'Transactions' },
    { id: 'analytics', label: 'Analytics' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-poppins font-semibold text-foreground">Payments & Wallet</h1>
          <p className="text-muted-foreground mt-1 font-sans">
            Track your earnings, payments, and financial activity
          </p>
        </div>
        
        <div className="flex gap-2 mt-4 sm:mt-0">
          <ExportDropdown 
            data={transactions}
            filename="payments-report"
          />
          <Button onClick={() => setIsAddPaymentMethodOpen(true)}>
            <CreditCard className="h-4 w-4 mr-2" />
            Add Payment Method
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {user.role === 'seeker' ? 'Total Earned' : 'Total Spent'}
              </CardTitle>
              <Wallet className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <AnimatedCounter 
                value={user.role === 'seeker' ? totalEarnings : totalSpent}
                className="text-2xl font-bold"
                delay={0.1}
                duration={1.8}
                prefix="₹"
              />
              <p className="text-xs text-muted-foreground">
                +12% from last month
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
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Calendar className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <AnimatedCounter 
                value={pendingPayments}
                className="text-2xl font-bold"
                delay={0.2}
                duration={1.5}
                prefix="₹"
              />
              <p className="text-xs text-muted-foreground">
                2 payments pending
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
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <AnimatedCounter 
                value={680}
                className="text-2xl font-bold"
                delay={0.3}
                duration={2}
                prefix="₹"
              />
              <p className="text-xs text-muted-foreground">
                +8% from last month
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
              <IndianRupee className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <AnimatedCounter 
                value={245}
                className="text-2xl font-bold"
                delay={0.4}
                duration={1.6}
                prefix="₹"
              />
              <p className="text-xs text-muted-foreground">
                Ready to withdraw
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="font-poppins font-semibold">Quick Actions</CardTitle>
              <CardDescription className="font-sans">Manage your payments and wallet</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start font-sans" onClick={() => setIsWithdrawOpen(true)}>
                <ArrowUpRight className="h-4 w-4 mr-2" />
                Withdraw Funds
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start font-sans"
                onClick={() => setIsMethodsOpen(true)}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Payment Methods
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start font-sans"
                onClick={handleDownloadStatement}
              >
                <FileText className="h-4 w-4 mr-2" />
                Download Statement
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.slice(0, 3).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                        transaction.type === 'earned' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {transaction.type === 'earned' ? (
                          <ArrowDownRight className="h-4 w-4 text-green-600" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{transaction.description}</p>
                        <p className="text-xs text-muted-foreground">{transaction.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${
                        transaction.type === 'earned' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'earned' ? '+' : '-'}₹{transaction.amount}
                      </p>
                      <p className={`text-xs capitalize ${
                        transaction.status === 'completed' ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {transaction.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'transactions' && (
        <Card>
          <CardHeader>
            <CardTitle>All Transactions</CardTitle>
            <CardDescription>Complete history of your payments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      transaction.type === 'earned' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {transaction.type === 'earned' ? (
                        <ArrowDownRight className="h-5 w-5 text-green-600" />
                      ) : (
                        <ArrowUpRight className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground">{transaction.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold text-lg ${
                      transaction.type === 'earned' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'earned' ? '+' : '-'}₹{transaction.amount}
                    </p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      transaction.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {transaction.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Earnings Trend</CardTitle>
              <CardDescription>Your monthly earnings over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative h-64 flex items-end justify-between gap-2">
                {mockEarningsData.map((data, index) => (
                  <div key={data.month} className="flex flex-col items-center flex-1">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(data.amount / 750) * 200}px` }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      className="bg-primary rounded-t w-full mb-2"
                      onMouseEnter={(e) => {
                        const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect()
                        setHoveredBar({
                          month: data.month,
                          amount: data.amount,
                          x: rect.left + rect.width / 2,
                          y: rect.top,
                          visible: true,
                        })
                      }}
                      onMouseMove={(e) => {
                        const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect()
                        setHoveredBar(prev => ({ ...prev, x: rect.left + rect.width / 2, y: rect.top }))
                      }}
                      onMouseLeave={() => setHoveredBar(prev => ({ ...prev, visible: false }))}
                    />
                    <span className="text-xs text-muted-foreground">{data.month}</span>
                  </div>
                ))}

                {hoveredBar.visible && (
                  <div
                    className="pointer-events-none fixed z-[1000] -translate-x-1/2 -translate-y-3 bg-popover text-popover-foreground border shadow-md rounded px-2 py-1 text-xs"
                    style={{ left: hoveredBar.x, top: hoveredBar.y }}
                  >
                    <div className="font-medium">{hoveredBar.month}</div>
                    <div className="text-muted-foreground">₹{hoveredBar.amount}</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Breakdown</CardTitle>
              <CardDescription>Analysis of your payment patterns</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Completed Payments</span>
                <span className="font-semibold">{transactions.filter(t => t.status === 'completed').length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Pending Payments</span>
                <span className="font-semibold">{transactions.filter(t => t.status === 'pending').length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Average Transaction</span>
                <span className="font-semibold">₹{Math.round(transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>This Month Growth</span>
                <span className="font-semibold text-green-600">+12%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

       {/* Withdraw Dialog */}
      <Dialog open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="font-poppins">Withdraw Funds</DialogTitle>
            <DialogDescription className="font-sans">Enter amount and choose a payment method</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium font-sans">Amount</label>
              <Input
                type="number"
                min={1}
                max={availableBalance}
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">Available: ₹{availableBalance}</p>
            </div>
            <div>
              <label className="text-sm font-medium font-sans">Payment Method</label>
              <Select value={selectedMethodId} onValueChange={setSelectedMethodId}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Choose a method" />
                </SelectTrigger>
                <SelectContent>
                  {savedMethods.map(m => (
                    <SelectItem key={m.id} value={m.id}>{m.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1 font-sans" onClick={() => setIsWithdrawOpen(false)}>Cancel</Button>
              <Button className="flex-1 font-sans" onClick={handleConfirmWithdraw}>Confirm</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Methods Sheet */}
      <Sheet open={isMethodsOpen} onOpenChange={setIsMethodsOpen}>
        <SheetContent side="right" className="w-full sm:max-w-sm">
          <SheetHeader>
            <SheetTitle className="font-poppins">Payment Methods</SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-3">
            {savedMethods.map(method => (
              <div key={method.id} className="flex items-center justify-between p-3 border rounded-md">
                <span className="font-sans text-sm">{method.label}</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="font-sans" onClick={() => setSelectedMethodId(method.id)}>Set Default</Button>
                  <Button variant="destructive" size="sm" className="font-sans" onClick={() => setSavedMethods(prev => prev.filter(m => m.id !== method.id))}>Delete</Button>
                </div>
              </div>
            ))}
            <Button className="w-full font-sans" onClick={() => setIsAddPaymentMethodOpen(true)}>Add New Method</Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Add Payment Method Modal */}
      <AddPaymentMethodModal
        isOpen={isAddPaymentMethodOpen}
        onClose={() => setIsAddPaymentMethodOpen(false)}
        onAdded={(m) => {
          setSavedMethods(prev => [m, ...prev])
          setSelectedMethodId(m.id)
        }}
      />
    </div>
  )
}
