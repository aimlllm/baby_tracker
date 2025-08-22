'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <button className="text-gray-600 hover:text-gray-800 transition-colors">
            Help
          </button>
        </div>

        {/* Logo and Title */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <div className="text-6xl mb-4">🍼</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Baby Tracker
            </h1>
          </div>
          
          <p className="text-lg text-gray-600 mb-8">
            Track your baby's journey<br />with intelligent AI
          </p>

          {/* Features */}
          <div className="text-left space-y-3 mb-12">
            <div className="flex items-center gap-3 text-gray-700">
              <div className="text-green-500">•</div>
              <span>Easy activity logging</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <div className="text-green-500">•</div>
              <span>Smart photo scanning</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <div className="text-green-500">•</div>
              <span>Beautiful growth insights</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <div className="text-green-500">•</div>
              <span>Works offline anywhere</span>
            </div>
          </div>
        </div>

        {/* Authentication Buttons */}
        <div className="space-y-4">
          {/* Google */}
          <button className="btn-social">
            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">G</span>
            </div>
            Continue with Google
          </button>

          {/* Apple */}
          <button className="btn-social">
            <div className="w-5 h-5 bg-black rounded flex items-center justify-center">
              <span className="text-white text-xs">🍎</span>
            </div>
            Continue with Apple
          </button>

          {/* Email */}
          <Link href="/auth/register" className="btn-social block text-center">
            <div className="w-5 h-5 bg-gray-500 rounded flex items-center justify-center">
              <span className="text-white text-xs">📧</span>
            </div>
            Continue with Email
          </Link>
        </div>

        {/* Sign In Link */}
        <div className="text-center mt-8">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-primary-600 hover:text-primary-700 font-medium">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
