'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface OnboardingData {
  userName: string
  babyName: string
  babyBirthDate: string
}

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [data, setData] = useState<OnboardingData>({
    userName: '',
    babyName: '',
    babyBirthDate: ''
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleComplete = async () => {
    setLoading(true)
    
    try {
      const { supabase } = await import('@/lib/supabase')
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('User not authenticated')
      }

      // Create user profile
      const { error: userError } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          email: user.email!,
          name: data.userName,
        })

      if (userError) throw userError

      // Create baby profile if birth date is provided
      if (data.babyBirthDate) {
        const { error: babyError } = await supabase
          .from('babies')
          .insert({
            user_id: user.id,
            name: data.babyName || 'My Baby',
            birth_date: data.babyBirthDate,
            gender: 'other' // Default, can be updated later
          })

        if (babyError) throw babyError
      }
      
      // Navigate to dashboard
      router.push('/dashboard')
    } catch (error: any) {
      console.error('Failed to complete onboarding:', error)
      // Continue to dashboard even if there's an error
      router.push('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <button 
              onClick={() => router.push('/auth/login')}
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              ← Back
            </button>
            <span className="text-sm text-gray-500">Step 1 of 2</span>
          </div>

          {/* Content */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome! 👋
            </h1>
            <p className="text-gray-600">Let's get started</p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                👤 Your Name
              </label>
              <input
                type="text"
                value={data.userName}
                onChange={(e) => setData({ ...data, userName: e.target.value })}
                placeholder="Sarah"
                className="input-field"
                required
              />
            </div>

            <button
              onClick={handleNext}
              disabled={!data.userName.trim()}
              className="btn-primary w-full"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <button 
            onClick={handleBack}
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            ← Back
          </button>
          <span className="text-sm text-gray-500">Step 2 of 2</span>
        </div>

        {/* Content */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            When was your baby born? 👶
          </h1>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Birth Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Birth Date: 📅
            </label>
            <input
              type="date"
              value={data.babyBirthDate}
              onChange={(e) => setData({ ...data, babyBirthDate: e.target.value })}
              className="input-field"
              required
            />
          </div>

          {/* Baby Name (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              👤 Baby's Name (optional)
            </label>
            <input
              type="text"
              value={data.babyName}
              onChange={(e) => setData({ ...data, babyName: e.target.value })}
              placeholder="Emma"
              className="input-field"
            />
          </div>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-700 text-sm flex items-start gap-2">
              <span>💡</span>
              <span>
                You can add more details later like photos, preferences, and tracking history
              </span>
            </p>
          </div>

          {/* Submit */}
          <button
            onClick={handleComplete}
            disabled={!data.babyBirthDate || loading}
            className="btn-primary w-full"
          >
            {loading ? 'Setting up...' : 'Start Tracking! 🚀'}
          </button>

          {/* Settings Later */}
          <div className="text-center">
            <button
              onClick={handleComplete}
              className="text-gray-600 hover:text-gray-800 transition-colors text-sm"
            >
              ⚙️ More Settings Later
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
