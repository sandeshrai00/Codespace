'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import CurrencySwitcher from './CurrencySwitcher'
import LanguageSwitcher from './LanguageSwitcher'
import { supabase } from '@/lib/supabase'
import { getUserDisplayName } from '@/lib/userUtils'

export default function Header({ lang = 'en', dict }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [user, setUser] = useState(null)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    // Check current session
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null)
      })

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null)
      })

      return () => subscription.unsubscribe()
    }
  }, [])

  const handleSignOut = async () => {
    if (supabase) {
      await supabase.auth.signOut()
      setIsProfileOpen(false)
    }
  }

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'glass-morphism shadow-glass' : 'bg-white/95 backdrop-blur-md border-b border-gray-100'}`}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={`/${lang}`} className="flex items-center gap-2 hover:opacity-90 transition-all duration-300 group">
            <Image 
              src="/img/logo.png" 
              alt="GoHoliday Logo" 
              width={160}
              height={46}
              className="h-[46px] w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {/* Main Navigation Links */}
            <div className="flex items-center gap-6">
              <Link href={`/${lang}/tours`} className="relative text-gray-700 hover:text-primary-600 transition-colors font-bold group">
                {dict?.nav?.tours || 'Tours'}
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-primary-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </div>

            {/* Action Items */}
            <div className="flex items-center gap-3">
              <CurrencySwitcher />
              <LanguageSwitcher />
              
              {/* Auth Section */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 text-primary-700 hover:bg-primary-100 transition-all duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="font-medium">{getUserDisplayName(user)}</span>
                  </button>
                  
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-lg py-2 z-50 border border-primary-200 animate-slide-down">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm text-gray-600 truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        {dict?.nav?.signOut || 'Sign Out'}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link 
                  href={`/${lang}/login`}
                  className="px-4 py-2 bg-primary-600 text-white rounded-full font-medium hover:bg-primary-700 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  {dict?.nav?.login || 'Login'}
                </Link>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 animate-slide-down bg-white/95 backdrop-blur-md absolute right-4 top-16 w-64 shadow-xl border border-gray-100 rounded-2xl">
            {/* Navigation Links Section */}
            <div className="px-2 py-3 space-y-1">
              <Link 
                href={`/${lang}/tours`}
                className="block px-3 py-2.5 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-2xl transition-all duration-200 font-bold"
                onClick={() => setIsMenuOpen(false)}
              >
                {dict?.nav?.tours || 'Tours'}
              </Link>
            </div>

            {/* Switchers Section */}
            <div className="px-2 py-3 border-t border-gray-100">
              <div className="px-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Settings</p>
              </div>
              <div className="flex items-center justify-center gap-3">
                <CurrencySwitcher />
                <LanguageSwitcher />
              </div>
            </div>
            
            {/* Mobile Auth Section */}
            <div className="px-2 py-3 border-t border-gray-100">
              {user ? (
                <div className="space-y-2">
                  <div className="px-3 py-2 bg-gray-50 rounded-2xl">
                    <p className="text-sm font-medium text-gray-700">{getUserDisplayName(user)}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="w-full px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-2xl transition-all duration-200 font-medium text-left"
                  >
                    {dict?.nav?.signOut || 'Sign Out'}
                  </button>
                </div>
              ) : (
                <Link 
                  href={`/${lang}/login`}
                  className="block px-4 py-2.5 bg-primary-600 text-white rounded-full font-medium hover:bg-primary-700 transition-all duration-200 text-center shadow-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {dict?.nav?.login || 'Login'}
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
