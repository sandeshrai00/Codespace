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

      {/* Popular Destinations Section - Premium Image-Focused Design */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Popular Destinations
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-primary-600 to-accent-500 mx-auto rounded-full mb-4"></div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our most loved travel destinations with curated experiences
            </p>
          </div>

          {/* Varied Grid Layout - Nepal gets larger spotlight */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {/* Nepal - Large Featured Card (spans 2 columns) */}
            <Link 
              href="/tours" 
              className="group relative md:col-span-2 h-80 md:h-96 rounded-3xl overflow-hidden shadow-card hover:shadow-glass-lg transition-all duration-500 hover:scale-[1.02]"
            >
              <div className="absolute inset-0">
                <img 
                  src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&q=80" 
                  alt="Nepal - Himalayan Mountains"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              {/* Gradient Overlay for Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary-900/90 via-primary-900/50 to-transparent group-hover:from-primary-800/90 transition-all duration-300"></div>
              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                <div className="transform translate-y-0 group-hover:-translate-y-2 transition-transform duration-300">
                  <h3 className="text-3xl md:text-4xl font-bold mb-2">Nepal</h3>
                  <p className="text-sm md:text-base text-blue-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Majestic Himalayas & Ancient Temples
                  </p>
                </div>
              </div>
              {/* Premium Badge */}
              <div className="absolute top-6 right-6">
                <span className="px-4 py-2 bg-accent-500 text-white text-xs font-bold rounded-full shadow-lg">
                  Featured
                </span>
              </div>
            </Link>

            {/* Thailand - Medium Card */}
            <Link 
              href="/tours" 
              className="group relative md:col-span-1 h-80 md:h-96 rounded-3xl overflow-hidden shadow-card hover:shadow-glass-lg transition-all duration-500 hover:scale-[1.02]"
            >
              <div className="absolute inset-0">
                <img 
                  src="https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=600&h=800&fit=crop&q=80" 
                  alt="Thailand - Tropical Beaches"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-secondary-900/90 via-secondary-900/50 to-transparent group-hover:from-secondary-800/90 transition-all duration-300"></div>
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                <div className="transform translate-y-0 group-hover:-translate-y-2 transition-transform duration-300">
                  <h3 className="text-2xl md:text-3xl font-bold mb-2">Thailand</h3>
                  <p className="text-xs md:text-sm text-blue-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Tropical Paradise & Rich Culture
                  </p>
                </div>
              </div>
            </Link>

            {/* Bali - Medium Card */}
            <Link 
              href="/tours" 
              className="group relative md:col-span-1 h-80 md:h-96 rounded-3xl overflow-hidden shadow-card hover:shadow-glass-lg transition-all duration-500 hover:scale-[1.02]"
            >
              <div className="absolute inset-0">
                <img 
                  src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&h=800&fit=crop&q=80" 
                  alt="Bali - Island Paradise"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-primary-900/90 via-primary-900/50 to-transparent group-hover:from-primary-800/90 transition-all duration-300"></div>
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                <div className="transform translate-y-0 group-hover:-translate-y-2 transition-transform duration-300">
                  <h3 className="text-2xl md:text-3xl font-bold mb-2">Bali</h3>
                  <p className="text-xs md:text-sm text-blue-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Island Serenity & Spiritual Retreats
                  </p>
                </div>
              </div>
            </Link>

            {/* Europe - Wide Card (spans 2 columns) */}
            <Link 
              href="/tours" 
              className="group relative md:col-span-2 h-64 rounded-3xl overflow-hidden shadow-card hover:shadow-glass-lg transition-all duration-500 hover:scale-[1.02]"
            >
              <div className="absolute inset-0">
                <img 
                  src="https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&h=500&fit=crop&q=80" 
                  alt="Europe - Historic Cities"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-secondary-900/90 via-secondary-900/40 to-transparent group-hover:from-secondary-800/90 transition-all duration-300"></div>
              <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                <div className="transform translate-y-0 group-hover:-translate-y-2 transition-transform duration-300">
                  <h3 className="text-3xl md:text-4xl font-bold mb-2">Europe</h3>
                  <p className="text-sm md:text-base text-blue-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Historic Cities & Timeless Architecture
                  </p>
                </div>
              </div>
            </Link>

            {/* Maldives - Small Additional Card */}
            <Link 
              href="/tours" 
              className="group relative md:col-span-2 h-64 rounded-3xl overflow-hidden shadow-card hover:shadow-glass-lg transition-all duration-500 hover:scale-[1.02]"
            >
              <div className="absolute inset-0">
                <img 
                  src="https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&h=500&fit=crop&q=80" 
                  alt="Maldives - Luxury Getaway"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 via-primary-900/40 to-transparent group-hover:from-primary-800/90 transition-all duration-300"></div>
              <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                <div className="transform translate-y-0 group-hover:-translate-y-2 transition-transform duration-300">
                  <h3 className="text-3xl md:text-4xl font-bold mb-2">Maldives</h3>
                  <p className="text-sm md:text-base text-blue-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Overwater Villas & Crystal Clear Waters
                  </p>
                </div>
              </div>
              {/* New Badge */}
              <div className="absolute top-6 right-6">
                <span className="px-4 py-2 bg-gradient-to-r from-accent-500 to-accent-600 text-white text-xs font-bold rounded-full shadow-lg">
                  New
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Happy Hour - Limited Time Deals Section - Glassmorphism Dark Theme */}
      <section className="relative py-20 bg-gradient-to-br from-secondary-900 via-primary-900 to-secondary-950 text-white overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        
        {/* Decorative Gradient Orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Section Header with Limited Time Badge */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-accent-500 to-accent-600 rounded-full mb-6 shadow-lg animate-pulse">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span className="font-bold text-sm uppercase tracking-wider">Limited Time Offers</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Happy Hour <span className="text-accent-400">Rewards</span>
            </h2>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              Join our exclusive community and unlock special deals on your next adventure
            </p>
          </div>

          {/* Stats Grid with Glassmorphism Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* Stat 1 - Happy Travelers with Special Badge */}
            <div className="relative group">
              <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 border border-white/20 shadow-glass hover:shadow-glass-lg transition-all duration-300 hover:scale-105 hover:bg-white/15">
                <div className="text-center">
                  <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-accent-400 to-accent-500 bg-clip-text text-transparent mb-3">500+</div>
                  <div className="text-blue-100 text-base font-semibold mb-2">Happy Travelers</div>
                  <div className="text-xs text-blue-200/80">Join our growing community</div>
                </div>
                {/* Reward Icon */}
                <div className="absolute top-4 right-4 opacity-50 group-hover:opacity-100 transition-opacity">
                  <svg className="w-6 h-6 text-accent-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Stat 2 - Destinations */}
            <div className="relative group">
              <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 border border-white/20 shadow-glass hover:shadow-glass-lg transition-all duration-300 hover:scale-105 hover:bg-white/15">
                <div className="text-center">
                  <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary-400 to-primary-500 bg-clip-text text-transparent mb-3">50+</div>
                  <div className="text-blue-100 text-base font-semibold mb-2">Destinations</div>
                  <div className="text-xs text-blue-200/80">Worldwide coverage</div>
                </div>
                <div className="absolute top-4 right-4 opacity-50 group-hover:opacity-100 transition-opacity">
                  <svg className="w-6 h-6 text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Stat 3 - Rating with Special Offer */}
            <div className="relative group">
              <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 border border-white/20 shadow-glass hover:shadow-glass-lg transition-all duration-300 hover:scale-105 hover:bg-white/15">
                <div className="text-center">
                  <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-accent-400 to-accent-500 bg-clip-text text-transparent mb-3">4.9★</div>
                  <div className="text-blue-100 text-base font-semibold mb-2">Average Rating</div>
                  <div className="text-xs text-blue-200/80">Trusted excellence</div>
                </div>
                <div className="absolute top-4 right-4 opacity-50 group-hover:opacity-100 transition-opacity">
                  <svg className="w-6 h-6 text-accent-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Stat 4 - Support with Premium Badge */}
            <div className="relative group">
              <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 border border-white/20 shadow-glass hover:shadow-glass-lg transition-all duration-300 hover:scale-105 hover:bg-white/15">
                <div className="text-center">
                  <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary-400 to-primary-500 bg-clip-text text-transparent mb-3">24/7</div>
                  <div className="text-blue-100 text-base font-semibold mb-2">Premium Support</div>
                  <div className="text-xs text-blue-200/80">Always here for you</div>
                </div>
                <div className="absolute top-4 right-4 opacity-50 group-hover:opacity-100 transition-opacity">
                  <svg className="w-6 h-6 text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C15.802 8.249 16 9.1 16 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.516-.552l1.562-1.562a4.006 4.006 0 001.789.027zm-4.677-2.796a4.002 4.002 0 01-.041-2.08l-.08.08-1.53-1.533A5.98 5.98 0 004 10c0 .954.223 1.856.619 2.657l1.54-1.54zm1.088-6.45A5.974 5.974 0 0110 4c.954 0 1.856.223 2.657.619l-1.54 1.54a4.002 4.002 0 00-2.346.033L7.246 4.668zM12 10a2 2 0 11-4 0 2 2 0 014 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action for Exclusive Deals */}
          <div className="text-center mt-12">
            <Link 
              href="/tours" 
              className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-accent-500 to-accent-600 text-white rounded-2xl font-bold text-lg hover:from-accent-600 hover:to-accent-700 transition-all shadow-xl hover:shadow-2xl hover:scale-105 transform"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
              </svg>
              Claim Your Exclusive Deal Now
            </Link>
            <p className="text-sm text-blue-200 mt-4">⏰ Limited time offer - Book within 48 hours</p>
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
