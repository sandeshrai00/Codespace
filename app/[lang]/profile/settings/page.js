'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { getDictionary } from '@/lib/i18n'
import { getUserDisplayName } from '@/lib/userUtils'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function SettingsPage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [dict, setDict] = useState(null)
  
  // Name update states
  const [fullName, setFullName] = useState('')
  const [isUpdatingName, setIsUpdatingName] = useState(false)
  const [nameUpdateMessage, setNameUpdateMessage] = useState({ type: '', text: '' })
  
  // Email update states
  const [newEmail, setNewEmail] = useState('')
  const [emailPassword, setEmailPassword] = useState('')
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false)
  const [emailUpdateMessage, setEmailUpdateMessage] = useState({ type: '', text: '' })
  
  // Password update states
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)
  const [passwordUpdateMessage, setPasswordUpdateMessage] = useState({ type: '', text: '' })
  
  const router = useRouter()
  const params = useParams()
  const lang = params.lang || 'en'

  // Load dictionary
  useEffect(() => {
    getDictionary(lang).then(setDict)
  }, [lang])

  // Fetch user session
  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!supabase) {
          console.error('Supabase client not initialized')
          setLoading(false)
          return
        }

        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session?.user) {
          router.push(`/${lang}/login`)
          return
        }
        
        setUser(session.user)
        setFullName(session.user.user_metadata?.full_name || '')
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
          setFullName(session.user.user_metadata?.full_name || '')
        }
      })

      return () => {
        subscription.unsubscribe()
      }
    }
  }, [lang, router])

  // Detect auth provider
  const getAuthProvider = (user) => {
    if (user.app_metadata?.provider) {
      return user.app_metadata.provider
    }
    
    if (user.identities && user.identities.length > 0) {
      return user.identities[0].provider
    }
    
    return 'email'
  }

  // Check if user is using OAuth
  const isOAuthUser = (user) => {
    const provider = getAuthProvider(user)
    return provider !== 'email'
  }

  // Format auth provider name for display
  const getFormattedAuthProvider = (user) => {
    const provider = getAuthProvider(user)
    return provider.charAt(0).toUpperCase() + provider.slice(1)
  }

  // Handle name update
  const handleNameUpdate = async (e) => {
    e.preventDefault()
    
    if (!fullName || !fullName.trim()) {
      setNameUpdateMessage({
        type: 'error',
        text: dict?.settings?.nameRequired || 'Please enter your full name'
      })
      return
    }

    setIsUpdatingName(true)
    setNameUpdateMessage({ type: '', text: '' })

    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName.trim() }
      })

      if (error) throw error

      setNameUpdateMessage({
        type: 'success',
        text: dict?.settings?.nameUpdateSuccess || 'Your name has been updated successfully!'
      })
    } catch (error) {
      console.error('Error updating name:', error)
      setNameUpdateMessage({
        type: 'error',
        text: dict?.settings?.nameUpdateError || 'Failed to update name. Please try again.'
      })
    } finally {
      setIsUpdatingName(false)
    }
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

    if (!emailPassword || !emailPassword.trim()) {
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
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: emailPassword
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
        text: dict?.settings?.emailUpdateSuccessShort || dict?.profile?.emailUpdateSuccess || 'Confirmation links have been sent to both your old and new email addresses.'
      })
      
      // Reset form fields
      setNewEmail('')
      setEmailPassword('')
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

  // Handle password update
  const handlePasswordUpdate = async (e) => {
    e.preventDefault()
    
    if (!newPassword || newPassword.length < 6) {
      setPasswordUpdateMessage({
        type: 'error',
        text: dict?.settings?.passwordTooShort || 'Password must be at least 6 characters long'
      })
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordUpdateMessage({
        type: 'error',
        text: dict?.settings?.passwordsDoNotMatch || 'Passwords do not match'
      })
      return
    }

    setIsUpdatingPassword(true)
    setPasswordUpdateMessage({ type: '', text: '' })

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) throw error

      setPasswordUpdateMessage({
        type: 'success',
        text: dict?.settings?.passwordUpdateSuccess || 'Your password has been updated successfully!'
      })
      
      // Reset form fields
      setNewPassword('')
      setConfirmPassword('')
    } catch (error) {
      console.error('Error updating password:', error)
      setPasswordUpdateMessage({
        type: 'error',
        text: dict?.settings?.passwordUpdateError || 'Failed to update password. Please try again.'
      })
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  if (loading) {
    return (
      <>
        <Header lang={lang} dict={dict} />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent-50 pt-24">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">{dict?.common?.loading || 'Loading...'}</p>
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
            <p className="text-gray-600 mb-6">You need to be logged in to access settings.</p>
            <button
              onClick={() => router.push(`/${lang}/login`)}
              className="px-6 py-3 bg-primary-600 text-white rounded-full font-medium hover:bg-primary-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {dict?.nav?.login || 'Go to Login'}
            </button>
          </div>
        </div>
        <Footer lang={lang} dict={dict} />
      </>
    )
  }

  return (
    <>
      <Header lang={lang} dict={dict} />
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Back to Profile Link */}
          <div className="mb-6">
            <Link
              href={`/${lang}/profile`}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="font-medium">{dict?.settings?.backToProfile || 'Back to Profile'}</span>
            </Link>
          </div>

          {/* Settings Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                  {dict?.settings?.accountSettings || 'Account Settings'}
                </h1>
                <p className="text-gray-600 mt-1">Manage your account preferences and security</p>
              </div>
            </div>
          </div>

          {/* Name Settings Card */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 sm:px-8 py-6">
              <div className="flex items-center gap-3">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {dict?.settings?.nameSettings || 'Name Settings'}
                  </h2>
                  <p className="text-purple-100 text-sm mt-1">
                    {dict?.settings?.nameDescription || 'Update your display name'}
                  </p>
                </div>
              </div>
            </div>

            <div className="px-6 sm:px-8 py-8">
              <form onSubmit={handleNameUpdate} className="space-y-6">
                {/* Current Name Display */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Current Name
                  </label>
                  <div className="px-4 py-3 bg-gray-50 rounded-xl border-2 border-gray-200 text-gray-700 font-medium">
                    {getUserDisplayName(user)}
                  </div>
                </div>

                {/* Full Name Input */}
                <div>
                  <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2">
                    {dict?.settings?.fullNameLabel || 'Full Name'}
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={dict?.settings?.fullNamePlaceholder || 'Enter your full name'}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    disabled={isUpdatingName}
                    required
                  />
                </div>

                {/* Message Display */}
                {nameUpdateMessage.text && (
                  <div className={`p-4 rounded-xl border-2 ${
                    nameUpdateMessage.type === 'success' 
                      ? 'bg-green-50 border-green-300 text-green-800' 
                      : 'bg-red-50 border-red-300 text-red-800'
                  }`}>
                    <div className="flex items-start gap-3">
                      {nameUpdateMessage.type === 'success' ? (
                        <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                      <p className="text-sm flex-1 font-medium">{nameUpdateMessage.text}</p>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isUpdatingName}
                    className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {isUpdatingName ? (
                      <>
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        <span>{dict?.settings?.updatingName || 'Updating name...'}</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span>{dict?.settings?.updateNameButton || 'Update Name'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Email Settings Card */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 sm:px-8 py-6">
              <div className="flex items-center gap-3">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {dict?.settings?.emailSettings || 'Email Settings'}
                  </h2>
                  <p className="text-primary-100 text-sm mt-1">
                    {dict?.settings?.emailDescription || 'Change the email address associated with your account'}
                  </p>
                </div>
              </div>
            </div>

            <div className="px-6 sm:px-8 py-8">
              {isOAuthUser(user) ? (
                // OAuth user - show message
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 border border-blue-200 text-center">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {dict?.profile?.accountManagedBy || 'Account managed by'} {getFormattedAuthProvider(user)}
                  </h3>
                  <p className="text-gray-700">
                    {dict?.profile?.cannotChangeEmail || 'Email cannot be changed for OAuth accounts'}
                  </p>
                </div>
              ) : (
                // Email user - show update form
                <form onSubmit={handleEmailUpdate} className="space-y-6">
                  {/* Current Email - Read Only */}
                  <div>
                    <label htmlFor="currentEmail" className="block text-sm font-semibold text-gray-700 mb-2">
                      {dict?.settings?.currentEmailLabel || dict?.profile?.currentEmail || 'Current Email Address'}
                    </label>
                    <div className="px-4 py-3 bg-gray-50 rounded-xl border-2 border-gray-200 text-gray-700 font-medium">
                      {user.email}
                    </div>
                  </div>

                  {/* New Email Input */}
                  <div>
                    <label htmlFor="newEmail" className="block text-sm font-semibold text-gray-700 mb-2">
                      {dict?.settings?.newEmailLabel || dict?.profile?.newEmail || 'New Email Address'}
                    </label>
                    <input
                      type="email"
                      id="newEmail"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder={dict?.profile?.newEmailPlaceholder || 'Enter new email address'}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      disabled={isUpdatingEmail}
                      required
                    />
                  </div>

                  {/* Password Input */}
                  <div>
                    <label htmlFor="emailPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                      {dict?.settings?.passwordLabel || dict?.profile?.currentPassword || 'Current Password'}
                    </label>
                    <input
                      type="password"
                      id="emailPassword"
                      value={emailPassword}
                      onChange={(e) => setEmailPassword(e.target.value)}
                      placeholder={dict?.profile?.passwordPlaceholder || 'Enter your current password'}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      disabled={isUpdatingEmail}
                      required
                    />
                    <p className="mt-2 text-sm text-gray-500 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {dict?.settings?.passwordHelp || dict?.profile?.passwordHint || 'Required for security verification'}
                    </p>
                  </div>

                  {/* Message Display */}
                  {emailUpdateMessage.text && (
                    <div className={`p-4 rounded-xl border-2 ${
                      emailUpdateMessage.type === 'success' 
                        ? 'bg-green-50 border-green-300 text-green-800' 
                        : 'bg-red-50 border-red-300 text-red-800'
                    }`}>
                      <div className="flex items-start gap-3">
                        {emailUpdateMessage.type === 'success' ? (
                          <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        ) : (
                          <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                        <p className="text-sm flex-1 font-medium">{emailUpdateMessage.text}</p>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isUpdatingEmail}
                      className="w-full px-6 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-semibold hover:from-primary-700 hover:to-primary-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                      {isUpdatingEmail ? (
                        <>
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                          <span>{dict?.profile?.updating || 'Updating...'}</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          <span>{dict?.settings?.updateEmailButton || dict?.profile?.updateEmail || 'Update Email Address'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Password Settings Card */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-accent-500 to-accent-600 px-6 sm:px-8 py-6">
              <div className="flex items-center gap-3">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {dict?.settings?.passwordSettings || 'Password Settings'}
                  </h2>
                  <p className="text-accent-100 text-sm mt-1">
                    {dict?.settings?.passwordDescription || 'Change your account password'}
                  </p>
                </div>
              </div>
            </div>

            <div className="px-6 sm:px-8 py-8">
              {isOAuthUser(user) ? (
                // OAuth user - show message
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 border border-blue-200 text-center">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {dict?.profile?.accountManagedBy || 'Account managed by'} {getFormattedAuthProvider(user)}
                  </h3>
                  <p className="text-gray-700">
                    Password cannot be changed for OAuth accounts
                  </p>
                </div>
              ) : (
                // Email user - show password change form
                <form onSubmit={handlePasswordUpdate} className="space-y-6">
                  {/* New Password Input */}
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                      {dict?.settings?.newPasswordLabel || 'New Password'}
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder={dict?.settings?.newPasswordPlaceholder || 'Enter new password (min 6 characters)'}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all"
                      disabled={isUpdatingPassword}
                      minLength={6}
                      required
                    />
                  </div>

                  {/* Confirm Password Input */}
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                      {dict?.settings?.confirmPasswordLabel || 'Confirm New Password'}
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder={dict?.settings?.confirmPasswordPlaceholder || 'Re-enter new password'}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all"
                      disabled={isUpdatingPassword}
                      minLength={6}
                      required
                    />
                  </div>

                  {/* Message Display */}
                  {passwordUpdateMessage.text && (
                    <div className={`p-4 rounded-xl border-2 ${
                      passwordUpdateMessage.type === 'success' 
                        ? 'bg-green-50 border-green-300 text-green-800' 
                        : 'bg-red-50 border-red-300 text-red-800'
                    }`}>
                      <div className="flex items-start gap-3">
                        {passwordUpdateMessage.type === 'success' ? (
                          <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        ) : (
                          <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                        <p className="text-sm flex-1 font-medium">{passwordUpdateMessage.text}</p>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isUpdatingPassword}
                      className="w-full px-6 py-4 bg-gradient-to-r from-accent-600 to-accent-700 text-white rounded-xl font-semibold hover:from-accent-700 hover:to-accent-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                      {isUpdatingPassword ? (
                        <>
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                          <span>{dict?.settings?.updatingPassword || 'Updating password...'}</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          <span>{dict?.settings?.updatePasswordButton || 'Update Password'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer lang={lang} dict={dict} />
    </>
  )
}
