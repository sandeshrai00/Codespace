'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useCurrency } from './CurrencyProvider'

export default function TourCard({ tour }) {
  const { convertPrice } = useCurrency()
  const truncateDescription = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }



  return (
    <Link href={`/tours/${tour.id}`} className="block group">
      <div className="bg-white rounded-2xl shadow-card hover:shadow-glass-lg transition-all duration-500 h-full flex flex-col overflow-hidden border border-gray-100 group-hover:scale-[1.02] group-hover:border-primary-200">
        {/* Banner Image with hover zoom */}
        <div className="relative h-40 sm:h-48 md:h-56 w-full overflow-hidden hover-zoom">
          {tour.banner_image ? (
            <Image
              src={tour.banner_image}
              alt={tour.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
              <span className="text-white text-4xl">🏖️</span>
            </div>
          )}

        </div>

        {/* Card Content */}
        <div className="p-4 sm:p-5 md:p-6 flex-1 flex flex-col">
          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">
            {tour.title}
          </h3>
          
          {/* Location with icon */}
          <div className="flex items-center gap-1 text-gray-600 text-sm mb-3">
            <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="font-medium">{tour.location}</span>
          </div>

          {/* Duration */}
          <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{tour.duration}</span>
            </div>
          </div>
          
          <p className="text-gray-600 text-sm mb-4 flex-1 line-clamp-2 leading-relaxed">
            {truncateDescription(tour.description)}
          </p>

          {/* Price and CTA */}
          <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3 mt-auto pt-4 border-t border-gray-100">
            <div>
              <div className="text-xs text-gray-500 mb-1">From</div>
              <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                {convertPrice(tour.price, tour.currency || 'USD')}
              </div>
            </div>
            <div className="flex items-center gap-1 text-primary-600 font-semibold text-sm group-hover:gap-2 transition-all">
              <span>View Details</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
