'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import CurrencySwitcher from './CurrencySwitcher'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'glass-morphism shadow-glass' : 'bg-white/90 backdrop-blur-md border-b border-gray-100'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-all duration-300 group">
            <Image 
              src="/img/logo.jpg" 
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
          </div>
        )}
      </div>
    </header>
  )
}
