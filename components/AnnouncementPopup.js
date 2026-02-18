'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function AnnouncementPopup({ announcement }) {
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Check if user has already dismissed this announcement
    const dismissedId = localStorage.getItem('dismissedAnnouncementId')
    const dismissedAt = localStorage.getItem('dismissedAnnouncementAt')
    
    // Show popup if:
    // 1. Never dismissed OR
    // 2. Dismissed more than 24 hours ago OR
    // 3. Different announcement ID
    const shouldShow = 
      !dismissedId || 
      dismissedId !== String(announcement.id) ||
      (dismissedAt && Date.now() - parseInt(dismissedAt) > 24 * 60 * 60 * 1000)
    
    if (shouldShow) {
      // Small delay before showing to ensure page is loaded
      setTimeout(() => {
        setIsVisible(true)
        setIsAnimating(true)
      }, 500)
    }
  }, [announcement.id])

  const handleDismiss = () => {
    setIsAnimating(false)
    
    // Store dismissal in localStorage
    localStorage.setItem('dismissedAnnouncementId', String(announcement.id))
    localStorage.setItem('dismissedAnnouncementAt', String(Date.now()))
    
    // Wait for animation to complete before hiding
    setTimeout(() => {
      setIsVisible(false)
    }, 300)
  }

  if (!isVisible) {
    return null
  }

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
        isAnimating ? 'opacity-100' : 'opacity-0'
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="announcement-title"
    >
      {/* Backdrop with blur effect */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleDismiss}
        aria-hidden="true"
      ></div>

      {/* Modal Content */}
      <div 
        className={`relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden transform transition-all duration-300 ${
          isAnimating ? 'translate-y-0 scale-100' : 'translate-y-8 scale-95'
        }`}
      >
        {/* Optional Image */}
        {announcement.image_url && (
          <div className="relative w-full h-48 sm:h-64">
            <Image
              src={announcement.image_url}
              alt="Announcement"
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Content */}
        <div className="p-6 sm:p-8">
          {/* Close Button */}
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/90 hover:bg-white shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 group z-10"
            aria-label="Close announcement"
          >
            <svg 
              className="w-5 h-5 text-gray-600 group-hover:text-gray-900 transition-colors" 
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

          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-full flex items-center justify-center">
              <svg 
                className="w-8 h-8 text-cyan-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" 
                />
              </svg>
            </div>
          </div>

          {/* Message */}
          <h2 
            id="announcement-title"
            className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-4 leading-tight"
          >
            Announcement
          </h2>
          <p className="text-base sm:text-lg text-gray-700 text-center mb-6 leading-relaxed">
            {announcement.message}
          </p>

          {/* Dismiss Button */}
          <button
            onClick={handleDismiss}
            className="w-full px-6 py-3 bg-gradient-to-r from-cyan-600 to-cyan-700 text-white rounded-xl font-semibold text-lg hover:from-cyan-700 hover:to-cyan-800 transition-all shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
          >
            Got it!
          </button>

          {/* Small text */}
          <p className="text-xs text-gray-500 text-center mt-3">
            This message won't show again for 24 hours
          </p>
        </div>
      </div>
    </div>
  )
}
