'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function UpdatePasswordPage() {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()
  const pathname = usePathname()
  
  // Extract lang from pathname
  const lang = pathname?.split('/')[1] || 'en'

  useEffect(() => {
    // Check if user has a valid session from the reset link
    const checkSession = async () => {
      if (!supabase) return
      
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setError('Invalid or expired reset link. Please request a new password reset.')
      }
    }
    
    checkSession()
  }, [])

  const handleUpdatePassword = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    if (!supabase) {
      setError('Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.')
      setLoading(false)
      return
    }

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please try again.')
      setLoading(false)
      return
    }

    // Validate password length
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.')
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) throw error

      setMessage('Password updated successfully! Redirecting to login...')
      setNewPassword('')
      setConfirmPassword('')
      
      // Redirect to login with lang
      router.push(`/${lang}/login`)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gradient-to-br from-primary-50 to-secondary-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-glass p-8">
              {/* Logo */}
              <div className="text-center mb-6">
                <Image 
                  src="/img/logo.png" 
                  alt="GoHoliday Logo" 
                  width={140}
                  height={40}
                  className="h-10 w-auto mx-auto mb-4"
                />
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Update Password
                </h1>
                <p className="text-gray-600">
                  Enter your new password below
                </p>
              </div>

              {/* Error/Success Messages */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}
              {message && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
                  {message}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter your new password"
                    minLength={6}
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Confirm your new password"
                    minLength={6}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </form>

              {/* Back to Login */}
              <div className="mt-6 text-center">
                <Link href={`/${lang}/login`} className="text-primary-600 hover:text-primary-700 font-medium">
                  ← Back to Login
                </Link>
              </div>

              {/* Back to Home */}
              <div className="mt-4 text-center">
                <Link href={`/${lang}`} className="text-gray-600 hover:text-gray-800 text-sm">
                  ← Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
