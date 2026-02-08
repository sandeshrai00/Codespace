import Header from '@/components/Header'
import Image from 'next/image'
import Link from 'next/link'
import { getTurso } from '@/lib/turso'
import { notFound } from 'next/navigation'

async function getTour(id) {
  try {
    const turso = getTurso();
    const result = await turso.execute({
      sql: 'SELECT * FROM tours WHERE id = ?',
      args: [id]
    });
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error fetching tour:', error);
    return null;
  }
}

export default async function TourDetailPage({ params }) {
  const tour = await getTour(params.id);

  if (!tour) {
    notFound();
  }

  // Parse image URLs from JSON
  let galleryImages = [];
  try {
    if (tour.image_urls) {
      galleryImages = JSON.parse(tour.image_urls);
    }
  } catch (error) {
    console.error('Error parsing image URLs:', error);
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Banner Image */}
      <section className="relative h-[400px] w-full">
        {tour.banner_image ? (
          <Image
            src={tour.banner_image}
            alt={tour.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
            <span className="text-white text-8xl">🏖️</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="container mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">{tour.title}</h1>
            <p className="text-xl">📍 {tour.location}</p>
          </div>
        </div>
      </section>

      {/* Tour Details */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Tour</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{tour.description}</p>
              </div>

              {/* Image Gallery */}
              {galleryImages.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Gallery</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {galleryImages.map((imageUrl, index) => (
                      <div key={index} className="relative h-48 rounded-lg overflow-hidden">
                        <Image
                          src={imageUrl}
                          alt={`${tour.title} - Image ${index + 1}`}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg p-6 shadow-lg sticky top-20">
                <div className="mb-6">
                  <div className="text-4xl font-bold text-cyan-600 mb-2">
                    ${tour.price}
                  </div>
                  <p className="text-gray-600">per person</p>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-start">
                    <div className="mr-3 text-cyan-600">⏱️</div>
                    <div>
                      <div className="font-semibold text-gray-900">Duration</div>
                      <div className="text-gray-600">{tour.duration}</div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="mr-3 text-cyan-600">📅</div>
                    <div>
                      <div className="font-semibold text-gray-900">Available Dates</div>
                      <div className="text-gray-600">{tour.dates}</div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="mr-3 text-cyan-600">📍</div>
                    <div>
                      <div className="font-semibold text-gray-900">Location</div>
                      <div className="text-gray-600">{tour.location}</div>
                    </div>
                  </div>
                </div>

                <button className="w-full py-3 bg-cyan-600 text-white rounded-lg font-bold hover:bg-cyan-700 transition mb-3">
                  Book Now
                </button>
                <button className="w-full py-3 bg-white text-cyan-600 border-2 border-cyan-600 rounded-lg font-bold hover:bg-cyan-50 transition">
                  Contact Us
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Back to Tours */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <Link href="/tours" className="inline-flex items-center text-cyan-600 hover:text-cyan-700 font-medium">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to All Tours
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4 text-cyan-400">GoHoliday</h3>
          <p className="text-gray-400 mb-6">Your trusted travel partner for unforgettable experiences</p>
          <p className="text-gray-500 text-sm">© 2024 GoHoliday. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
