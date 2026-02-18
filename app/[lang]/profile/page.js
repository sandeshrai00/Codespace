'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { getUserDisplayName } from '@/lib/userUtils'
import { getDictionary } from '@/lib/i18n'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function ProfilePage() {
  // Constants
  const EMAIL_UPDATE_SUCCESS_DELAY_MS = 5000 // Time to show success message before hiding form
  
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [dict, setDict] = useState(null)
  const [newEmail, setNewEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false)
  const [emailUpdateMessage, setEmailUpdateMessage] = useState({ type: '', text: '' })
  const router = useRouter()
  const params = useParams()
  const lang = params.lang || 'en'

  // Load dictionary
  useEffect(() => {
    getDictionary(lang).then(setDict)
  }, [lang])

  // Generate a consistent random profile picture based on user email
  const getProfilePicture = (userEmail) => {
    // Use email to generate consistent number for same user
    // If no email, default to profile picture 1
    if (!userEmail) {
      return '/img/profile1.jpg'
    }
    const hash = userEmail.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const profileNum = (hash % 6) + 1
    return `/img/profile${profileNum}.jpg`
  }

  // Map language codes to locale strings
  const getLocale = (langCode) => {
    const localeMap = {
      'th': 'th-TH',
      'zh': 'zh-CN',
      'en': 'en-US'
    }
    return localeMap[langCode] || 'en-US'
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Check if supabase client is available
        if (!supabase) {
          console.error('Supabase client not initialized')
          setLoading(false)
          return
        }

        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session?.user) {
          // Redirect to login if not authenticated
          router.push(`/${lang}/login`)
          return
        }
        
        setUser(session.user)
      } catch (error) {
        console.error('Error fetching user:', error)
        router.push(`/${lang}/login`)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()

    // Listen for auth changes
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (!session?.user) {
          router.push(`/${lang}/login`)
        } else {
          setUser(session.user)
        }
      })

      return () => {
        subscription.unsubscribe()
      }
    }
  }, [lang, router])

  const handleSignOut = async () => {
    if (supabase) {
      await supabase.auth.signOut()
      router.push(`/${lang}`)
    }
  }

  // Detect auth provider
  const getAuthProvider = (user) => {
    // Check if user has app_metadata.provider
    if (user.app_metadata?.provider) {
      return user.app_metadata.provider
    }
    
    // Check identities array
    if (user.identities && user.identities.length > 0) {
      return user.identities[0].provider
    }
    
    // Default to email if no provider found
    return 'email'
  }

  // Check if user is using OAuth
  const isOAuthUser = (user) => {
    const provider = getAuthProvider(user)
    return provider !== 'email'
  }

  // Handle email update
  const handleEmailUpdate = async (e) => {
    e.preventDefault()
    
    if (!newEmail || !newEmail.trim()) {
      setEmailUpdateMessage({
        type: 'error',
        text: dict?.profile?.emailRequired || 'Please enter a valid email address'
      })
      return
    }

    if (newEmail === user.email) {
      setEmailUpdateMessage({
        type: 'error',
        text: dict?.profile?.emailSameAsCurrent || 'New email must be different from current email'
      })
      return
    }

    if (!password || !password.trim()) {
      setEmailUpdateMessage({
        type: 'error',
        text: dict?.profile?.passwordRequired || 'Please enter your current password for verification'
      })
      return
    }

    setIsUpdatingEmail(true)
    setEmailUpdateMessage({ type: '', text: '' })

    try {
      // Verify the current password first
      // Note: This will refresh/validate the current session rather than create a new one
      // since we're authenticating with the same credentials already in use
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: password
      })

      if (signInError) {
        setEmailUpdateMessage({
          type: 'error',
          text: dict?.profile?.incorrectPassword || 'Incorrect password. Please try again.'
        })
        setIsUpdatingEmail(false)
        return
      }

      // If password is correct, proceed with email update
      const { error } = await supabase.auth.updateUser({
        email: newEmail
      })

      if (error) throw error

      setEmailUpdateMessage({
        type: 'success',
        text: dict?.profile?.emailUpdateSuccess || 'Email update initiated! IMPORTANT: Confirmation links have been sent to BOTH your current email and your new email address. You must click the confirmation links in BOTH emails to complete the change.'
      })
      
      // Reset form and hide it after successful submission
      setNewEmail('')
      setPassword('')
      setTimeout(() => {
        setShowEmailForm(false)
        setEmailUpdateMessage({ type: '', text: '' })
      }, EMAIL_UPDATE_SUCCESS_DELAY_MS)
    } catch (error) {
      console.error('Error updating email:', error)
      
      // Check if it's a rate limit error
      const errorMessage = error?.message || error?.toString() || ''
      if (errorMessage.toLowerCase().includes('rate limit')) {
        setEmailUpdateMessage({
          type: 'error',
          text: 'Email rate limit exceeded. Please wait a while before trying again or check your Supabase dashboard settings (Authentication > Settings > Rate Limits).'
        })
      } else {
        setEmailUpdateMessage({
          type: 'error',
          text: dict?.profile?.emailUpdateError || 'Failed to update email. Please try again.'
        })
      }
    } finally {
      setIsUpdatingEmail(false)
    }
  }

  // Handle cancel button
  const handleCancelEmailChange = () => {
    setShowEmailForm(false)
    setNewEmail('')
    setPassword('')
    setEmailUpdateMessage({ type: '', text: '' })
  }

  if (loading) {
    return (
      <>
        <Header lang={lang} dict={dict} />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent-50 pt-24">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
        <Footer lang={lang} dict={dict} />
      </>
    )
  }

  if (!user) {
    return (
      <>
        <Header lang={lang} dict={dict} />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent-50 pt-24">
          <div className="text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Please Login</h1>
            <p className="text-gray-600 mb-6">You need to be logged in to view your profile.</p>
            <button
              onClick={() => router.push(`/${lang}/login`)}
              className="px-6 py-3 bg-primary-600 text-white rounded-full font-medium hover:bg-primary-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Go to Login
            </button>
          </div>
        </div>
        <Footer lang={lang} dict={dict} />
      </>
    )
  }

  const profilePicture = getProfilePicture(user.email)
  const joinedDate = new Date(user.created_at).toLocaleDateString(getLocale(lang), {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <>
      <Header lang={lang} dict={dict} />
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Card */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            {/* Header Banner */}
            <div className="h-32 bg-gradient-to-r from-primary-500 via-primary-600 to-accent-600 relative">
              <div className="absolute inset-0 bg-black/10"></div>
            </div>

            {/* Profile Content */}
            <div className="relative px-6 sm:px-8 pb-8">
              {/* Profile Picture */}
              <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-16 sm:-mt-20 mb-6">
                <div className="relative">
                  <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-gray-100">
                    <Image
                      src={profilePicture}
                      alt="Profile Picture"
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                  <div className="absolute bottom-2 right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white"></div>
                </div>
                
                <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left flex-1">
                  <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                    {getUserDisplayName(user)}
                  </h1>
                  <p className="text-gray-600 text-lg">{user.email}</p>
                </div>
              </div>

              {/* Profile Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                {/* Email Card */}
                <div className="bg-gradient-to-br from-primary-50 to-primary-100/50 rounded-2xl p-6 border border-primary-200">
                  <div className="flex items-center gap-3 mb-2">
                    <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Email</h3>
                  </div>
                  <p className="text-lg font-medium text-gray-900 break-all">{user.email}</p>
                </div>

                {/* Member Since Card */}
                <div className="bg-gradient-to-br from-accent-50 to-accent-100/50 rounded-2xl p-6 border border-accent-200">
                  <div className="flex items-center gap-3 mb-2">
                    <svg className="w-6 h-6 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Member Since</h3>
                  </div>
                  <p className="text-lg font-medium text-gray-900">{joinedDate}</p>
                </div>

                {/* Full Name Card (if available) */}
                {user.user_metadata?.full_name && (
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl p-6 border border-purple-200">
                    <div className="flex items-center gap-3 mb-2">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Full Name</h3>
                    </div>
                    <p className="text-lg font-medium text-gray-900">{user.user_metadata.full_name}</p>
                  </div>
                )}

                {/* User ID Card */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl p-6 border border-gray-200">
                  <div className="flex items-center gap-3 mb-2">
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                    </svg>
                    <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">User ID</h3>
                  </div>
                  <p className="text-sm font-mono text-gray-700 break-all">{user.id}</p>
                </div>
              </div>

              {/* Account Status */}
              <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Account Active</h3>
                      <p className="text-sm text-gray-600">Your account is in good standing</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Change Email Section */}
              <div className="mt-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                <div className="flex items-center gap-3 mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <h3 className="text-lg font-bold text-gray-900">
                    {dict?.profile?.changeEmail || 'Change Email'}
                  </h3>
                </div>

                {isOAuthUser(user) ? (
                  // OAuth user - show badge
                  <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                            {dict?.profile?.accountManagedBy || 'Account managed by'} {getAuthProvider(user).charAt(0).toUpperCase() + getAuthProvider(user).slice(1)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {dict?.profile?.cannotChangeEmail || 'Email cannot be changed for OAuth accounts'}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : !showEmailForm ? (
                  // Email user - show "Change Email" button when form is hidden
                  <div className="text-center">
                    <button
                      onClick={() => setShowEmailForm(true)}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      <span>{dict?.profile?.changeEmail || 'Change Email'}</span>
                    </button>
                  </div>
                ) : (
                  // Email user - show update form when button is clicked
                  <form onSubmit={handleEmailUpdate} className="space-y-4">
                    <div>
                      <label htmlFor="currentEmail" className="block text-sm font-medium text-gray-700 mb-2">
                        {dict?.profile?.currentEmail || 'Current Email'}
                      </label>
                      <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-700">
                        {user.email}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="newEmail" className="block text-sm font-medium text-gray-700 mb-2">
                        {dict?.profile?.newEmail || 'New Email Address'}
                      </label>
                      <input
                        type="email"
                        id="newEmail"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        placeholder={dict?.profile?.newEmailPlaceholder || 'Enter new email address'}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        disabled={isUpdatingEmail}
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                        {dict?.profile?.currentPassword || 'Current Password'}
                      </label>
                      <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={dict?.profile?.passwordPlaceholder || 'Enter your current password'}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        disabled={isUpdatingEmail}
                        required
                      />
                      <p className="mt-2 text-sm text-gray-500">
                        {dict?.profile?.passwordHint || 'Required for security verification'}
                      </p>
                    </div>

                    {emailUpdateMessage.text && (
                      <div className={`p-4 rounded-lg ${
                        emailUpdateMessage.type === 'success' 
                          ? 'bg-green-50 border border-green-200 text-green-800' 
                          : 'bg-red-50 border border-red-200 text-red-800'
                      }`}>
                        <div className="flex items-start gap-3">
                          {emailUpdateMessage.type === 'success' ? (
                            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                          <p className="text-sm flex-1">{emailUpdateMessage.text}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={isUpdatingEmail}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isUpdatingEmail ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            <span>{dict?.profile?.updating || 'Updating...'}</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            <span>{dict?.profile?.updateEmail || 'Update Email'}</span>
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEmailChange}
                        disabled={isUpdatingEmail}
                        className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span>{dict?.common?.cancel || 'Cancel'}</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Sign Out Button */}
              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleSignOut}
                  className="px-8 py-3 bg-red-600 text-white rounded-full font-medium hover:bg-red-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  {dict?.nav?.signOut || 'Sign Out'}
                </button>
              </div>
            </div>
          </div>

          {/* Back to Home Button */}
          <div className="mt-8 text-center">
            <button
              onClick={() => router.push(`/${lang}`)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-full font-medium hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl border border-gray-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {dict?.nav?.home || 'Home'}
            </button>
          </div>
        </div>
      </div>
      <Footer lang={lang} dict={dict} />
    </>
  )
}
