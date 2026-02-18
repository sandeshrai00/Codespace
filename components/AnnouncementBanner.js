'use client'

import { useState } from 'react'

export default function AnnouncementBanner({ message }) {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible || !message) {
    return null
  }

  return (
    <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white shadow-lg animate-slide-down">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between py-3 md:py-4 gap-4">
          {/* Icon + Message */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* SVG Megaphone Icon */}
            <div className="flex-shrink-0">
              <svg 
                className="w-5 h-5 md:w-6 md:h-6 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" 
                />
              </svg>
            </div>
            
            {/* Message Text */}
            <p className="text-sm md:text-base font-medium text-white/95 truncate sm:whitespace-normal">
              {message}
            </p>
          </div>

          {/* Dismiss Button */}
          <button
            onClick={() => setIsVisible(false)}
            className="flex-shrink-0 p-1.5 hover:bg-white/10 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 group"
            aria-label="Dismiss announcement"
          >
            <svg 
              className="w-5 h-5 md:w-5 md:h-5 text-white/80 group-hover:text-white transition-colors" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
