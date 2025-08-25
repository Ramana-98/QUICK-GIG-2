import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { DollarSign, Clock, MapPin, Star } from 'lucide-react'

export default function FontExample() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Main Dashboard Heading - Poppins */}
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-poppins font-semibold text-gray-900 mb-2">
          Welcome to QuickGig
        </h1>
        <p className="text-lg font-sans text-gray-600">
          Find your next opportunity or post a gig
        </p>
      </div>

      {/* Section Heading - Poppins */}
      <div>
        <h2 className="text-3xl font-poppins font-semibold text-gray-800 mb-4">
          Payments & Wallet
        </h2>
        
        {/* Balance Card - Poppins for amounts */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="font-poppins font-semibold text-xl">
              Current Balance
            </CardTitle>
            <CardDescription className="font-sans text-gray-600">
              Your available funds
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-poppins font-bold text-green-600 mb-2">
              ₹1,247.50
            </div>
            <p className="font-sans text-sm text-gray-500">
              Last updated: 2 minutes ago
            </p>
          </CardContent>
        </Card>

        {/* Recent Activity - Inter for body text */}
        <div>
          <h3 className="text-2xl font-poppins font-semibold text-gray-800 mb-4">
            Recent Activity
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-sans font-medium text-gray-900">
                    Payment received from Dog Walking
                  </p>
                  <p className="font-sans text-sm text-gray-500">
                    From: Sarah Johnson
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-poppins font-bold text-green-600">
                  +₹45.00
                </p>
                <p className="font-sans text-sm text-gray-500">
                  2 hours ago
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-sans font-medium text-gray-900">
                    Time tracking completed
                  </p>
                  <p className="font-sans text-sm text-gray-500">
                    Grocery Shopping Assistant
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-poppins font-bold text-blue-600">
                  +₹25.00
                </p>
                <p className="font-sans text-sm text-gray-500">
                  1 day ago
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gig Card Example - Mixed fonts */}
      <div>
        <h3 className="text-2xl font-poppins font-semibold text-gray-800 mb-4">
          Featured Gigs
        </h3>
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="font-poppins font-semibold text-xl text-gray-900">
                  Dog Walking Service
                </CardTitle>
                <CardDescription className="font-sans text-gray-600 mt-1">
                  Need someone to walk my golden retriever for 1 hour daily
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-2xl font-poppins font-bold text-green-600">
                  ₹15
                </div>
                <div className="font-sans text-sm text-gray-500">
                  per hour
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="font-sans text-gray-600">Downtown Area</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="font-sans text-gray-600">1 hour</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="font-sans text-gray-600">4.8</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-sans text-sm text-gray-500">
                    Posted by
                  </p>
                  <p className="font-sans font-medium text-gray-900">
                    Sarah Johnson
                  </p>
                </div>
                <Button className="font-sans font-medium">
                  Apply Now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Form Example - Inter for all form elements */}
      <div>
        <h3 className="text-2xl font-poppins font-semibold text-gray-800 mb-4">
          Contact Form
        </h3>
        <Card>
          <CardContent className="pt-6">
            <form className="space-y-4">
              <div>
                <label className="font-sans font-medium text-gray-700 block mb-2">
                  Full Name
                </label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md font-sans text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <label className="font-sans font-medium text-gray-700 block mb-2">
                  Email Address
                </label>
                <input 
                  type="email" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md font-sans text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
                />
              </div>
              
              <div>
                <label className="font-sans font-medium text-gray-700 block mb-2">
                  Message
                </label>
                <textarea 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md font-sans text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Enter your message"
                />
              </div>
              
              <Button type="submit" className="font-sans font-medium">
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
