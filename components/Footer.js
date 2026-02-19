'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function Footer({ lang = 'en', dict }) {
  const [year, setYear] = useState(new Date().getFullYear())

  useEffect(() => {
    setYear(new Date().getFullYear())
  }, [])

  return (
    <footer className="bg-secondary-950 text-gray-300 rounded-t-[2rem] sm:rounded-t-[3rem]">
      
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        
        {/* Logo */}
        <div className="flex flex-col items-center gap-3 mb-6">
          <Image 
            src="/img/logo.png" 
            alt="GoHoliday Logo" 
            width={140}
            height={40}
            className="h-9 w-auto brightness-0 invert"
          />
        </div>

        {/* Essential Links */}
        <nav className="flex flex-wrap items-center justify-center gap-6 mb-6">
          <Link href={`/${lang}`} className="text-gray-400 hover:text-accent-500 transition-colors text-sm">
            {dict?.footer?.home || 'Home'}
          </Link>
          <Link href={`/${lang}/tours`} className="text-gray-400 hover:text-accent-500 transition-colors text-sm">
            {dict?.footer?.tours || 'Tours'}
          </Link>
          <Link href={`/${lang}/contact`} className="text-gray-400 hover:text-accent-500 transition-colors text-sm">
            {dict?.footer?.contact || 'Contact'}
          </Link>
        </nav>

        {/* Social Icons */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <a href="#" className="w-9 h-9 bg-secondary-900 hover:bg-accent-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110" aria-label="Facebook">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>

          <a href="#" className="w-9 h-9 bg-secondary-900 hover:bg-accent-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110" aria-label="Instagram">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z"/>
            </svg>
          </a>

          <a href="#" className="w-9 h-9 bg-secondary-900 hover:bg-accent-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110" aria-label="Twitter">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482z"/>
            </svg>
          </a>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-secondary-900">
        <div className="container mx-auto px-4 sm:px-6 py-3">
          <p className="text-center text-xs text-gray-400">
            {dict?.footer?.copyright || `© ${year} GoHoliday. All rights reserved.`}
          </p>
        </div>
      </div>
    </footer>
  )
}