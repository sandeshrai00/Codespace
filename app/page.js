import Header from '@/components/Header'
import Footer from '@/components/Footer'
import TourCard from '@/components/TourCard'
import Link from 'next/link'
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

      {/* Hero Section with Search Bar Overlay - Modern Style */}
      <section className="relative bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 text-white py-24 md:py-32 overflow-hidden">
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
              Premium Nepal to Thailand <span className="text-accent-400">&</span> Thailand to Nepal Tours
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-blue-100 max-w-3xl mx-auto">
              Experience the perfect blend of Himalayan mountains and tropical beaches. Discover authentic culture, breathtaking landscapes, and unforgettable adventures between two incredible destinations.
            </p>
            
            {/* Search Bar Card - Glass Morphism */}
            <div className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl p-6 md:p-8 max-w-4xl mx-auto border border-white/20">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Nepal, Thailand, or explore both destinations..."
                    aria-label="Search destination"
                    className="w-full px-6 py-4 border-2 border-transparent rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 text-lg transition-all shadow-lg"
                  />
                </div>
                <Link 
                  href="/tours" 
                  className="px-8 py-4 bg-gradient-to-r from-accent-500 to-accent-600 text-white rounded-2xl font-bold text-lg hover:from-accent-600 hover:to-accent-700 transition-all shadow-lg hover:shadow-xl whitespace-nowrap hover:scale-105 transform"
                >
                  Explore Tours
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Destinations Section - Modern Style */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Popular Destinations
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-primary-600 to-primary-700 mx-auto rounded-full mb-4"></div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our most loved travel destinations around the world
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Destination Cards */}
            {[
              { name: 'Nepal', emoji: '🏔️', gradient: 'from-blue-500 to-blue-700' },
              { name: 'Thailand', emoji: '🏝️', gradient: 'from-green-500 to-green-700' },
              { name: 'Europe', emoji: '🏰', gradient: 'from-purple-500 to-purple-700' },
              { name: 'Bali', emoji: '🌴', gradient: 'from-orange-500 to-orange-700' },
            ].map((dest) => (
              <Link 
                key={dest.name}
                href="/tours" 
                className="group relative h-48 rounded-3xl overflow-hidden shadow-card hover:shadow-glass-lg transition-all duration-300 hover:scale-105"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${dest.gradient} group-hover:scale-105 transition-transform duration-300`}></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">{dest.emoji}</div>
                  <div className="text-2xl font-bold">{dest.name}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats/Social Proof Bar - Modern Style */}
      <section className="py-16 bg-gradient-to-r from-secondary-900 to-secondary-950 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-400 to-primary-500 bg-clip-text text-transparent mb-2">500+</div>
              <div className="text-gray-300 text-sm md:text-base">Happy Travelers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-400 to-primary-500 bg-clip-text text-transparent mb-2">50+</div>
              <div className="text-gray-300 text-sm md:text-base">Destinations</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-400 to-primary-500 bg-clip-text text-transparent mb-2">4.9★</div>
              <div className="text-gray-300 text-sm md:text-base">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-400 to-primary-500 bg-clip-text text-transparent mb-2">24/7</div>
              <div className="text-gray-300 text-sm md:text-base">Customer Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tours Section - Redesigned */}
      <section id="featured" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Featured Tours
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-primary-600 to-primary-700 mx-auto rounded-full mb-4"></div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Handpicked tours for unforgettable experiences
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

      {/* Why Choose Us Section - Redesigned with Icons */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Why Choose GoHoliday
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-primary-600 to-primary-700 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="bg-white border-2 border-gray-100 p-8 rounded-3xl shadow-card hover:shadow-glass-lg hover:border-primary-200 transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">Best Price Guarantee</h3>
              <p className="text-gray-600 text-center text-sm">Get the best deals with our price match guarantee</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white border-2 border-gray-100 p-8 rounded-3xl shadow-card hover:shadow-glass-lg hover:border-primary-200 transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                <svg className="w-8 h-8 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">Easy Booking</h3>
              <p className="text-gray-600 text-center text-sm">Book in minutes via WhatsApp or website</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white border-2 border-gray-100 p-8 rounded-3xl shadow-card hover:shadow-glass-lg hover:border-primary-200 transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">24/7 Support</h3>
              <p className="text-gray-600 text-center text-sm">We're always here to help you</p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white border-2 border-gray-100 p-8 rounded-3xl shadow-card hover:shadow-glass-lg hover:border-primary-200 transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                <svg className="w-8 h-8 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">Free Cancellation</h3>
              <p className="text-gray-600 text-center text-sm">Flexible cancellation on most tours</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section - Modern Style */}
      <section className="py-20 bg-gradient-to-r from-primary-700 via-primary-600 to-primary-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '30px 30px'
          }}></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Get the Best Travel Deals
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Subscribe to our newsletter and never miss out on amazing offers
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-6 py-4 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-800 text-lg transition-all"
              />
              <button className="px-8 py-4 bg-secondary-900 text-white rounded-2xl font-bold text-lg hover:bg-secondary-950 transition-all shadow-lg hover:shadow-xl whitespace-nowrap hover:scale-105 transform">
                Subscribe
              </button>
            </div>
            <p className="text-sm text-primary-100 mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
