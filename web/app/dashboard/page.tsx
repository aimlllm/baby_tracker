'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface ActivityEntry {
  id: string
  time: string
  type: 'feeding' | 'diaper' | 'sleep' | 'activity'
  icon: string
  description: string
}

const mockActivities: ActivityEntry[] = [
  {
    id: '1',
    time: '2:30 PM',
    type: 'feeding',
    icon: '🍼',
    description: 'Formula 4oz'
  },
  {
    id: '2',
    time: '1:45 PM',
    type: 'diaper',
    icon: '🚼',
    description: 'Diaper change'
  },
  {
    id: '3',
    time: '12:30 PM',
    type: 'sleep',
    icon: '💤',
    description: 'Nap (45 min)'
  },
  {
    id: '4',
    time: '11:15 AM',
    type: 'feeding',
    icon: '🍼',
    description: 'Breastfeed (L)'
  }
]

interface User {
  id: string
  name: string
  email: string
}

interface Baby {
  id: string
  name: string
  birth_date: string
  gender: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [babies, setBabies] = useState<Baby[]>([])
  const [selectedBaby, setSelectedBaby] = useState<Baby | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      const { supabase } = await import('@/lib/supabase')
      
      // Check authentication
      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      if (!authUser) {
        router.push('/auth/login')
        return
      }

      // Load user profile
      const { data: userProfile } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single()

      if (userProfile) {
        setUser(userProfile)
      }

      // Load babies
      const { data: babiesData } = await supabase
        .from('babies')
        .select('*')
        .eq('user_id', authUser.id)
        .order('created_at', { ascending: false })

      if (babiesData && babiesData.length > 0) {
        setBabies(babiesData)
        setSelectedBaby(babiesData[0])
      }

    } catch (error) {
      console.error('Error loading user data:', error)
      router.push('/auth/login')
    } finally {
      setLoading(false)
    }
  }

  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate)
    const today = new Date()
    const diffTime = Math.abs(today.getTime() - birth.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 7) {
      return `${diffDays} days old`
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7)
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} old`
    } else {
      const months = Math.floor(diffDays / 30)
      return `${months} ${months === 1 ? 'month' : 'months'} old`
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🍼</div>
          <div className="text-lg text-gray-600">Loading...</div>
        </div>
      </div>
    )
  }

  const handleQuickAction = (action: string) => {
    console.log('Quick action:', action)
    // TODO: Navigate to entry forms
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-semibold text-lg">👤</span>
              </div>
              <span className="font-medium text-gray-900">{user?.name || 'User'}</span>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-600 hover:text-gray-800 transition-colors">
                🔔
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-800 transition-colors">
                ⚙️
              </button>
              <Link href="/analytics" className="p-2 text-gray-600 hover:text-gray-800 transition-colors">
                📊
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Baby Info */}
        <div className="mb-8">
          {selectedBaby ? (
            <>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                👶 {selectedBaby.name} ({calculateAge(selectedBaby.birth_date)})
              </h1>
              <p className="text-gray-600">Ready to track activities!</p>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome to Baby Tracker! 👶
              </h1>
              <p className="text-gray-600">
                <Link href="/onboarding" className="text-primary-600 hover:text-primary-700">
                  Add your first baby
                </Link> to get started
              </p>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Quick Actions */}
          <div className="space-y-6">
            {/* Quick Actions Card */}
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h2>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  onClick={() => handleQuickAction('feed')}
                  className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="text-2xl">🍼</span>
                  <span className="text-sm font-medium">Feed</span>
                </button>
                
                <button
                  onClick={() => handleQuickAction('sleep')}
                  className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="text-2xl">💤</span>
                  <span className="text-sm font-medium">Sleep</span>
                </button>
                
                <button
                  onClick={() => handleQuickAction('diaper')}
                  className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="text-2xl">🚼</span>
                  <span className="text-sm font-medium">Diaper</span>
                </button>
                
                <button
                  onClick={() => handleQuickAction('activity')}
                  className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="text-2xl">🎈</span>
                  <span className="text-sm font-medium">Activity</span>
                </button>
              </div>
              
              <button
                onClick={() => handleQuickAction('scan')}
                className="btn-secondary w-full"
              >
                📷 Scan Notes
              </button>
            </div>

            {/* Today's Summary */}
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Today's Summary
              </h2>
              
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl mb-1">🍼</div>
                  <div className="text-sm text-gray-600">6 feedings</div>
                </div>
                <div>
                  <div className="text-2xl mb-1">💤</div>
                  <div className="text-sm text-gray-600">3 naps</div>
                </div>
                <div>
                  <div className="text-2xl mb-1">🚼</div>
                  <div className="text-sm text-gray-600">8 diapers</div>
                </div>
                <div>
                  <div className="text-2xl mb-1">😊</div>
                  <div className="text-sm text-gray-600">Happy mood</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Recent Activities */}
          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Recent Activities
              </h2>
              
              <div className="space-y-4">
                {mockActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="text-2xl">{activity.icon}</div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {activity.description}
                      </div>
                      <div className="text-sm text-gray-600">
                        {activity.time}
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      ⋯
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <Link href="/timeline" className="text-primary-600 hover:text-primary-700 font-medium">
                  View All Activities
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation (Mobile) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="grid grid-cols-4">
          <Link href="/dashboard" className="flex flex-col items-center gap-1 py-3 text-primary-600">
            <span className="text-xl">🏠</span>
            <span className="text-xs">Home</span>
          </Link>
          <Link href="/analytics" className="flex flex-col items-center gap-1 py-3 text-gray-600">
            <span className="text-xl">📊</span>
            <span className="text-xs">Analytics</span>
          </Link>
          <Link href="/babies" className="flex flex-col items-center gap-1 py-3 text-gray-600">
            <span className="text-xl">👶</span>
            <span className="text-xs">Babies</span>
          </Link>
          <Link href="/settings" className="flex flex-col items-center gap-1 py-3 text-gray-600">
            <span className="text-xl">⚙️</span>
            <span className="text-xs">Settings</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
