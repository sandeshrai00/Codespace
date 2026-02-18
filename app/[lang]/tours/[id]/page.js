import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Image from 'next/image'
import Link from 'next/link'
import ImageGallery from '@/components/ImageGallery'
import TourDetailSidebar from '@/components/TourDetailSidebar'
import TourReviews from '@/components/TourReviews'
import { getTurso } from '@/lib/turso'
import { notFound } from 'next/navigation'
import { getDictionary, getLocalizedField } from '@/lib/i18n'

async function getTour(id) {
  try {
    const turso = getTurso();
    const result = await turso.execute({
      sql: `SELECT id, title, title_en, title_th, title_zh, description, description_en, description_th, description_zh,
             price, currency, location, location_en, location_th, location_zh, duration, banner_image, image_urls, dates, created_at
             FROM tours WHERE id = ?`,
      args: [id]
    });
    const row = result.rows[0] || null;
    return row ? JSON.parse(JSON.stringify(row)) : null;
  } catch (error) {
    console.error('Error fetching tour:', error);
    return null;
  }
}

export default async function TourDetailPage({ params }) {
  const { lang, id } = await params;
  const dict = await getDictionary(lang);
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

  // Get localized fields
  const localizedTitle = getLocalizedField(tour, 'title', lang);
  const localizedDescription = getLocalizedField(tour, 'description', lang);
  const localizedLocation = getLocalizedField(tour, 'location', lang);

  return (
    <div className="min-h-screen">
      <Header lang={lang} dict={dict} />
      
      {/* Banner Image */}
      <section className="relative h-[300px] md:h-[450px] w-full">
        {tour.banner_image ? (
          <Image
            src={tour.banner_image}
            alt={localizedTitle}
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
            <h1 className="text-4xl md:text-5xl font-bold mb-2">{localizedTitle}</h1>
            <p className="text-xl">📍 {localizedLocation}</p>
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
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{dict.tourDetail.aboutTour}</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{localizedDescription}</p>
              </div>

              {/* Image Gallery */}
              {galleryImages.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">{dict.tourDetail.gallery}</h2>
                  <ImageGallery images={galleryImages} tourTitle={localizedTitle} />
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <TourDetailSidebar tour={tour} lang={lang} dict={dict} />
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <TourReviews tourId={tour.id} lang={lang} dict={dict} />
        </div>
      </section>

      {/* Back to Tours */}
      <section className="py-8 bg-gray-100">
        <div className="container mx-auto px-4">
          <Link href={`/${lang}/tours`} className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {dict.tourDetail.backToTours}
          </Link>
        </div>
      </section>

      <Footer lang={lang} dict={dict} />
    </div>
  )
}
