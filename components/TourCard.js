'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useCurrency } from './CurrencyProvider'

export default function TourCard({ tour }) {
  const { convertPrice } = useCurrency()
  const truncateDescription = (text, maxLength = 120) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  return (
    <Link href={`/tours/${tour.id}`} className="block group">
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col overflow-hidden">
        {/* Banner Image */}
        <div className="relative h-52 w-full overflow-hidden">
          {tour.banner_image ? (
            <Image
              src={tour.banner_image}
              alt={tour.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center">
              <span className="text-white text-4xl">🏖️</span>
            </div>
          )}
        </div>

        {/* Card Content */}
        <div className="p-5 flex-1 flex flex-col">
          <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
            {tour.title}
          </h3>
          
          <p className="text-gray-600 text-sm mb-4 flex-1">
            {truncateDescription(tour.description)}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
              📍 {tour.location}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
              ⏱️ {tour.duration}
            </span>
          </div>

          <div className="flex items-center justify-between mt-auto">
            <div className="text-2xl font-bold text-primary-600">
              {convertPrice(tour.price)}
            </div>
            <div className="text-primary-600 font-medium text-sm flex items-center gap-1">
              View Details
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
