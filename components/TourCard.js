import Link from 'next/link'
import Image from 'next/image'

export default function TourCard({ tour }) {
  const truncateDescription = (text, maxLength = 120) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  return (
    <Link href={`/tours/${tour.id}`} className="block group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
        {/* Banner Image */}
        <div className="relative h-48 w-full overflow-hidden">
          {tour.banner_image ? (
            <Image
              src={tour.banner_image}
              alt={tour.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <span className="text-white text-4xl">🏖️</span>
            </div>
          )}
        </div>

        {/* Card Content */}
        <div className="p-5">
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-cyan-600 transition-colors">
            {tour.title}
          </h3>
          
          <p className="text-gray-600 text-sm mb-4">
            {truncateDescription(tour.description)}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800">
              📍 {tour.location}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              ⏱️ {tour.duration}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-cyan-600">
              ${tour.price}
            </div>
            <button className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors text-sm font-medium">
              View Details
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}
