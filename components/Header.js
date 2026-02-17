'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import CurrencySwitcher from './CurrencySwitcher'
import { supabase } from '@/lib/supabase'

export default function Header() {
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
    <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'glass-morphism shadow-glass' : 'bg-white/90 backdrop-blur-md border-b border-gray-100'}`}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-all duration-300 group">
            <Image 
              src="/img/logo.png" 
              alt="GoHoliday Logo" 
              width={140}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="relative text-gray-700 hover:text-primary-600 transition-colors font-medium group">
              Home
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-primary-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/tours" className="relative text-gray-700 hover:text-primary-600 transition-colors font-medium group">
              Tours
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-primary-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/tours" className="relative text-gray-700 hover:text-primary-600 transition-colors font-medium group">
              Destinations
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-primary-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <CurrencySwitcher />
            
            {/* Auth Section */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-50 text-primary-700 hover:bg-primary-100 transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="font-medium">{user.user_metadata?.full_name || user.email?.split('@')[0]}</span>
                </button>
                
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm text-gray-600 truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                href="/login" 
                className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition"
              >
                Login
              </Link>
            )}
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
          <div className="md:hidden pb-4 animate-slide-down">
            <Link 
              href="/" 
              className="block py-2 text-gray-700 hover:text-primary-600 transition font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/tours" 
              className="block py-2 text-gray-700 hover:text-primary-600 transition font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Tours
            </Link>
            <Link 
              href="/tours" 
              className="block py-2 text-gray-700 hover:text-primary-600 transition font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Destinations
            </Link>
            <div className="py-2">
              <CurrencySwitcher />
            </div>
            
            {/* Mobile Auth Section */}
            {user ? (
              <div className="pt-2 border-t border-gray-200 mt-2">
                <div className="px-2 py-2 text-sm text-gray-600">
                  {user.user_metadata?.full_name || user.email?.split('@')[0]}
                </div>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-2 py-2 text-red-600 hover:bg-red-50 rounded transition"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link 
                href="/login" 
                className="block mt-2 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
