import Header from '@/components/Header'
import Footer from '@/components/Footer'
import TourCard from '@/components/TourCard'
import Link from 'next/link'
import Image from 'next/image'
import { getTurso } from '@/lib/turso'

async function getActiveAnnouncement() {
  try {
    const turso = getTurso();
    const result = await turso.execute({
      sql: 'SELECT * FROM announcements WHERE is_active = 1 LIMIT 1',
      args: []
    });
    const row = result.rows[0] || null;
    return row ? JSON.parse(JSON.stringify(row)) : null;
  } catch (error) {
    console.error('Error fetching announcement:', error);
    return null;
  }
}

async function getFeaturedTours() {
  try {
    const turso = getTurso();
    const result = await turso.execute({
      sql: 'SELECT id, title, description, price, location, duration, banner_image, dates, created_at FROM tours ORDER BY created_at DESC LIMIT 6',
      args: []
    });
    return result.rows.map(row => JSON.parse(JSON.stringify(row)));
  } catch (error) {
    console.error('Error fetching tours:', error);
    return [];
  }
}

export default async function HomePage() {
  const announcement = await getActiveAnnouncement();
  const featuredTours = await getFeaturedTours();

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Announcement Banner */}
      {announcement && (
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 px-4 shadow-md">
          <div className="container mx-auto text-center">
            <p className="text-sm md:text-base font-medium">📢 {announcement.message}</p>
          </div>
        </div>
      )}

      {/* Hero Section - Professional Nepal-Thailand Focus */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 text-white py-24 md:py-32 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight animate-fade-in">
              Your Nepal-Thailand Travel <span className="text-accent-400">Specialists</span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-blue-100 max-w-3xl mx-auto">
              Experience the perfect blend of Himalayan mountains and tropical beaches. Discover authentic culture, breathtaking landscapes, and unforgettable adventures between two incredible destinations.
            </p>
            
            {/* Search Bar Card */}
            <div className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl p-6 md:p-8 max-w-4xl mx-auto border border-white/20">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Nepal, Thailand, or explore both destinations..."
                    aria-label="Search destination"
                    className="w-full px-6 py-4 border-2 border-transparent rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-600 focus:border-accent-600 text-lg transition-all shadow-lg"
                  />
                </div>
                <Link 
                  href="/tours" 
                  className="px-8 py-4 bg-gradient-to-r from-accent-600 to-accent-700 text-white rounded-2xl font-bold text-lg hover:from-accent-700 hover:to-accent-800 transition-all shadow-lg hover:shadow-xl whitespace-nowrap hover:scale-105 transform"
                >
                  Explore Tours
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Destinations Section - Nepal & Thailand Focus */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Our Specialized Destinations
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-primary-800 to-accent-600 mx-auto rounded-full mb-4"></div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Expert-curated journeys between the Himalayas and tropical paradise
            </p>
          </div>

          {/* Two Equal Cards - Side by Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Nepal - Premium Featured Card */}
            <Link 
              href="/tours" 
              className="group relative h-96 md:h-[500px] rounded-3xl overflow-hidden shadow-card hover:shadow-glass-lg transition-all duration-500 hover:scale-[1.02]"
            >
              <div className="absolute inset-0">
                <Image 
                  src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=2070" 
                  alt="Nepal destination featuring snow-capped Himalayan mountain peaks and traditional temples"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  priority
                />
              </div>
              {/* Gradient Overlay for Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary-900/90 via-primary-900/50 to-transparent group-hover:from-primary-800/95 transition-all duration-300"></div>
              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                <div className="transform translate-y-0 group-hover:-translate-y-2 transition-transform duration-300">
                  <h3 className="text-4xl md:text-5xl font-bold mb-3">Nepal</h3>
                  <p className="text-base md:text-lg text-blue-100 mb-4">
                    Majestic Himalayas & Ancient Heritage
                  </p>
                  <p className="text-sm text-blue-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Experience the roof of the world with sacred temples, mountain treks, and rich cultural traditions
                  </p>
                </div>
              </div>
              {/* Premium Badge */}
              <div className="absolute top-6 right-6">
                <span className="px-4 py-2 bg-accent-600 text-white text-xs font-bold rounded-full shadow-lg">
                  Featured
                </span>
              </div>
            </Link>

            {/* Thailand - Premium Featured Card */}
            <Link 
              href="/tours" 
              className="group relative h-96 md:h-[500px] rounded-3xl overflow-hidden shadow-card hover:shadow-glass-lg transition-all duration-500 hover:scale-[1.02]"
            >
              <div className="absolute inset-0">
                <Image 
                  src="https://images.unsplash.com/photo-1563492065599-3520f775eeed?q=80&w=2070" 
                  alt="Thailand destination with golden temples, tropical beaches, and vibrant culture"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-primary-900/90 via-primary-900/50 to-transparent group-hover:from-primary-800/95 transition-all duration-300"></div>
              <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                <div className="transform translate-y-0 group-hover:-translate-y-2 transition-transform duration-300">
                  <h3 className="text-4xl md:text-5xl font-bold mb-3">Thailand</h3>
                  <p className="text-base md:text-lg text-blue-100 mb-4">
                    Tropical Paradise & Golden Temples
                  </p>
                  <p className="text-sm text-blue-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Discover pristine beaches, bustling markets, ornate temples, and world-renowned Thai hospitality
                  </p>
                </div>
              </div>
              {/* Premium Badge */}
              <div className="absolute top-6 right-6">
                <span className="px-4 py-2 bg-accent-600 text-white text-xs font-bold rounded-full shadow-lg">
                  Featured
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Tours Section */}
      <section id="featured" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Featured Nepal-Thailand Tours
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-primary-800 to-accent-600 mx-auto rounded-full mb-4"></div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Handpicked journeys connecting mountain majesty with tropical paradise
            </p>
          </div>

          {featuredTours.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {featuredTours.map((tour, index) => (
                  <TourCard key={tour.id} tour={tour} featured={index < 2} />
                ))}
              </div>
              <div className="text-center">
                <Link 
                  href="/tours" 
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-2xl font-semibold text-lg hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg hover:shadow-xl hover:scale-105 transform"
                >
                  View All Tours
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg mb-6">No tours available yet. Check back soon!</p>
              <div className="text-6xl mb-4">🏖️</div>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us Section - Nepal-Thailand Expertise */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Why Choose GoHoliday for Nepal-Thailand Tours
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-primary-800 to-accent-600 mx-auto rounded-full mb-4"></div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your trusted specialists for seamless travel between the Himalayas and tropical paradise
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="bg-white border-2 border-gray-100 p-8 rounded-3xl shadow-card hover:shadow-glass-lg hover:border-primary-300 transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                <svg className="w-8 h-8 text-primary-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">Regional Expertise</h3>
              <p className="text-gray-600 text-center text-sm">Deep local knowledge of both Nepal and Thailand destinations</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white border-2 border-gray-100 p-8 rounded-3xl shadow-card hover:shadow-glass-lg hover:border-primary-300 transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-accent-100 to-accent-200 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                <svg className="w-8 h-8 text-accent-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">Seamless Booking</h3>
              <p className="text-gray-600 text-center text-sm">Easy online booking or quick WhatsApp assistance</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white border-2 border-gray-100 p-8 rounded-3xl shadow-card hover:shadow-glass-lg hover:border-primary-300 transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                <svg className="w-8 h-8 text-primary-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">24/7 Support</h3>
              <p className="text-gray-600 text-center text-sm">Round-the-clock assistance throughout your journey</p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white border-2 border-gray-100 p-8 rounded-3xl shadow-card hover:shadow-glass-lg hover:border-primary-300 transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-accent-100 to-accent-200 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                <svg className="w-8 h-8 text-accent-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">Best Value</h3>
              <p className="text-gray-600 text-center text-sm">Competitive pricing with no hidden costs</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
