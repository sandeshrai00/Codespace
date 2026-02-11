'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useCurrency } from './CurrencyProvider'

export default function TourCard({ tour, featured = false }) {
  const { convertPrice } = useCurrency()
  const truncateDescription = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  // Generate a deterministic rating based on tour ID to avoid hydration mismatches
  const hash = tour.id.toString().split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const rating = (4.5 + (hash % 6) / 10).toFixed(1)

  return (
    <Link href={`/tours/${tour.id}`} className="block group">
      <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col overflow-hidden border border-gray-100">
        {/* Banner Image with hover zoom */}
        <div className="relative h-56 w-full overflow-hidden hover-zoom">
          {tour.banner_image ? (
            <Image
              src={tour.banner_image}
              alt={tour.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center">
              <span className="text-white text-4xl">🏖️</span>
            </div>
          )}
          
          {/* Badge */}
          {featured && (
            <div className="absolute top-3 right-3 bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
              Best Seller
            </div>
          )}
        </div>

        {/* Card Content */}
        <div className="p-5 flex-1 flex flex-col">
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
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

          {/* Duration and Rating */}
          <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{tour.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-yellow-500">★</span>
              <span className="font-semibold text-gray-900">{rating}</span>
            </div>
          </div>
          
          <p className="text-gray-600 text-sm mb-4 flex-1 line-clamp-2">
            {truncateDescription(tour.description)}
          </p>

          {/* Price and CTA */}
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
            <div>
              <div className="text-xs text-gray-500 mb-1">From</div>
              <div className="text-2xl font-bold text-primary-600">
                {convertPrice(tour.price)}
              </div>
            </div>
            <div className="flex items-center gap-1 text-primary-600 font-semibold text-sm group-hover:gap-2 transition-all">
              <span>View Details</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
