'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { getDictionary } from '@/lib/i18n'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

// Comprehensive list of countries
const COUNTRIES = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 
  'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 
  'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 
  'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 
  'Burundi', 'Cabo Verde', 'Cambodia', 'Cameroon', 'Canada', 'Central African Republic', 
  'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica', 'Croatia', 
  'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 
  'East Timor', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 
  'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 'Gambia', 'Georgia', 
  'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 
  'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 
  'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 
  'Kosovo', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 
  'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar', 'Malawi', 'Malaysia', 
  'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 
  'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 
  'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 
  'Nigeria', 'North Korea', 'North Macedonia', 'Norway', 'Oman', 'Pakistan', 'Palau', 
  'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 
  'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 
  'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 
  'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 
  'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Korea', 'South Sudan', 
  'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 
  'Tajikistan', 'Tanzania', 'Thailand', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 
  'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 
  'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 
  'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
]

export default function ProfilePage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [dict, setDict] = useState(null)
  const router = useRouter()
  const params = useParams()
  const lang = params.lang || 'en'

  // Profile Setting edit mode and form state
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [profileForm, setProfileForm] = useState({
    first_name: '',
    last_name: '',
    nationality: '',
    mobile_number: '',
    birth_date: '',
    gender: ''
  })
  const [searchQuery, setSearchQuery] = useState('')

  // Load dictionary
  useEffect(() => {
    getDictionary(lang).then(setDict)
  }, [lang])

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
        
        // Initialize form with existing user metadata
        setProfileForm({
          first_name: session.user.user_metadata?.first_name || '',
          last_name: session.user.user_metadata?.last_name || '',
          nationality: session.user.user_metadata?.nationality || '',
          mobile_number: session.user.user_metadata?.mobile_number || '',
          birth_date: session.user.user_metadata?.birth_date || '',
          gender: session.user.user_metadata?.gender || ''
        })
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
          setProfileForm({
            first_name: session.user.user_metadata?.first_name || '',
            last_name: session.user.user_metadata?.last_name || '',
            nationality: session.user.user_metadata?.nationality || '',
            mobile_number: session.user.user_metadata?.mobile_number || '',
            birth_date: session.user.user_metadata?.birth_date || '',
            gender: session.user.user_metadata?.gender || ''
          })
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

  const handleEditClick = () => {
    setIsEditingProfile(true)
  }

  const handleCancelEdit = () => {
    // Reset form to current user metadata
    if (user) {
      setProfileForm({
        first_name: user.user_metadata?.first_name || '',
        last_name: user.user_metadata?.last_name || '',
        nationality: user.user_metadata?.nationality || '',
        mobile_number: user.user_metadata?.mobile_number || '',
        birth_date: user.user_metadata?.birth_date || '',
        gender: user.user_metadata?.gender || ''
      })
    }
    setIsEditingProfile(false)
    setSearchQuery('')
  }

  const handleSaveProfile = async () => {
    if (!supabase) return
    
    setIsSaving(true)
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          first_name: profileForm.first_name,
          last_name: profileForm.last_name,
          nationality: profileForm.nationality,
          mobile_number: profileForm.mobile_number,
          birth_date: profileForm.birth_date,
          gender: profileForm.gender
        }
      })

      if (error) throw error

      // Update local user state
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
      }

      setIsEditingProfile(false)
      setSearchQuery('')
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Failed to update profile. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleInputChange = (field, value) => {
    setProfileForm(prev => ({ ...prev, [field]: value }))
  }

  const filteredCountries = COUNTRIES.filter(country =>
    country.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Map language codes to locale strings
  const getLocale = (langCode) => {
    const localeMap = {
      'th': 'th-TH',
      'zh': 'zh-CN',
      'en': 'en-US'
    }
    return localeMap[langCode] || 'en-US'
  }

  if (loading) {
    return (
      <>
        <Header lang={lang} dict={dict} />
        <div className="min-h-screen flex items-center justify-center bg-white pt-24">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mx-auto"></div>
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
        <div className="min-h-screen flex items-center justify-center bg-white pt-24">
          <div className="text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Please Login</h1>
            <p className="text-gray-600 mb-6">You need to be logged in to view your profile.</p>
            <button
              onClick={() => router.push(`/${lang}/login`)}
              className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
        <Footer lang={lang} dict={dict} />
      </>
    )
  }

  const joinedDate = new Date(user.created_at).toLocaleDateString(getLocale(lang), {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <>
      <Header lang={lang} dict={dict} />
      <div className="min-h-screen bg-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Setting Section */}
          <div className="bg-white border border-gray-200 rounded-lg mb-6">
            {/* Section Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Profile Setting</h2>
              {!isEditingProfile && (
                <button
                  onClick={handleEditClick}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Edit
                </button>
              )}
            </div>

            {/* Section Content */}
            <div className="px-6 py-6">
              {!isEditingProfile ? (
                /* View Mode */
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">First Name</label>
                      <p className="text-base text-gray-900">{profileForm.first_name || '-'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Last Name</label>
                      <p className="text-base text-gray-900">{profileForm.last_name || '-'}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Nationality</label>
                      <p className="text-base text-gray-900">{profileForm.nationality || '-'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Mobile Number</label>
                      <p className="text-base text-gray-900">{profileForm.mobile_number || '-'}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Birth Date</label>
                      <p className="text-base text-gray-900">{profileForm.birth_date || '-'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Gender</label>
                      <p className="text-base text-gray-900">{profileForm.gender || '-'}</p>
                    </div>
                  </div>
                </div>
              ) : (
                /* Edit Mode */
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      <input
                        type="text"
                        value={profileForm.first_name}
                        onChange={(e) => handleInputChange('first_name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                        placeholder="Enter first name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                      <input
                        type="text"
                        value={profileForm.last_name}
                        onChange={(e) => handleInputChange('last_name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                        placeholder="Enter last name"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={searchQuery || profileForm.nationality}
                          onChange={(e) => {
                            setSearchQuery(e.target.value)
                            if (e.target.value === '') {
                              handleInputChange('nationality', '')
                            }
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                          placeholder="Search country"
                        />
                        {searchQuery && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                            {filteredCountries.length > 0 ? (
                              filteredCountries.map((country) => (
                                <button
                                  key={country}
                                  type="button"
                                  onClick={() => {
                                    handleInputChange('nationality', country)
                                    setSearchQuery('')
                                  }}
                                  className="w-full px-3 py-2 text-left hover:bg-gray-100 text-sm text-gray-900"
                                >
                                  {country}
                                </button>
                              ))
                            ) : (
                              <div className="px-3 py-2 text-sm text-gray-500">No countries found</div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                      <input
                        type="tel"
                        value={profileForm.mobile_number}
                        onChange={(e) => handleInputChange('mobile_number', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                        placeholder="Enter mobile number"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Birth Date</label>
                      <input
                        type="date"
                        value={profileForm.birth_date}
                        onChange={(e) => handleInputChange('birth_date', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                      <div className="flex gap-4 pt-2">
                        {['Male', 'Female', 'Other'].map((option) => (
                          <label key={option} className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name="gender"
                              value={option}
                              checked={profileForm.gender === option}
                              onChange={(e) => handleInputChange('gender', e.target.value)}
                              className="w-4 h-4 text-gray-900 border-gray-300 focus:ring-gray-900"
                            />
                            <span className="ml-2 text-sm text-gray-700">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="px-6 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {isSaving ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      disabled={isSaving}
                      className="px-6 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Account Information Section */}
          <div className="bg-white border border-gray-200 rounded-lg">
            {/* Section Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Account Information</h2>
            </div>

            {/* Section Content */}
            <div className="px-6 py-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                  <p className="text-base text-gray-900">{user.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">User ID</label>
                  <p className="text-sm font-mono text-gray-900 break-all">{user.id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Member Since</label>
                  <p className="text-base text-gray-900">{joinedDate}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push(`/${lang}`)}
              className="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              {dict?.nav?.home || 'Home'}
            </button>
            <button
              onClick={handleSignOut}
              className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              {dict?.nav?.signOut || 'Sign Out'}
            </button>
          </div>
        </div>
      </div>
      <Footer lang={lang} dict={dict} />
    </>
  )
}
