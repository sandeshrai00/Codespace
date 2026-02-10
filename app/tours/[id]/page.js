import Header from '@/components/Header'
import Footer from '@/components/Footer'
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
  const { id } = await params;
  const tour = await getTour(id);

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

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919800000000'
  const bookingMessage = `Hi! I'm interested in booking the tour: "${tour.title}" (${tour.location}) - $${tour.price} for ${tour.duration}. Can you share more details and help me book?`
  const generalMessage = "Hi! I'd like to know more about GoHoliday tours."
  const bookingWhatsAppUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(bookingMessage)}`
  const generalWhatsAppUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(generalMessage)}`

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
          <div className="w-full h-full bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center">
            <span className="text-white text-8xl">🏖️</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
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
                      <div key={index} className="relative h-48 rounded-lg overflow-hidden shadow-card hover:shadow-card-hover transition-shadow">
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
              <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-lg p-6 shadow-lg sticky top-20">
                <div className="mb-6">
                  <div className="text-4xl font-bold text-primary-600 mb-2">
                    ${tour.price}
                  </div>
                  <p className="text-gray-600">per person</p>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-start">
                    <div className="mr-3 text-primary-600">⏱️</div>
                    <div>
                      <div className="font-semibold text-gray-900">Duration</div>
                      <div className="text-gray-600">{tour.duration}</div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="mr-3 text-primary-600">📅</div>
                    <div>
                      <div className="font-semibold text-gray-900">Available Dates</div>
                      <div className="text-gray-600">{tour.dates}</div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="mr-3 text-primary-600">📍</div>
                    <div>
                      <div className="font-semibold text-gray-900">Location</div>
                      <div className="text-gray-600">{tour.location}</div>
                    </div>
                  </div>
                </div>

                <a 
                  href={bookingWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-whatsapp text-white rounded-lg font-bold hover:bg-whatsapp-dark transition mb-3 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  Book via WhatsApp
                </a>
                <a 
                  href={generalWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-white text-primary-600 border-2 border-primary-600 rounded-lg font-bold hover:bg-primary-50 transition flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  Chat with Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Back to Tours */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <Link href="/tours" className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to All Tours
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
