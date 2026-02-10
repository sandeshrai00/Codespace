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
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error fetching announcement:', error);
    return null;
  }
}

async function getFeaturedTours() {
  try {
    const turso = getTurso();
    const result = await turso.execute({
      sql: 'SELECT * FROM tours ORDER BY created_at DESC LIMIT 3',
      args: []
    });
    return result.rows;
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
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-3 px-4">
          <div className="container mx-auto text-center">
            <p className="text-sm md:text-base font-medium">📢 {announcement.message}</p>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-500 via-secondary-500 to-secondary-600 text-white py-20 md:py-32 overflow-hidden">
        {/* Animated Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-10 w-64 h-64 bg-white rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-white rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
              Your Dream Vacation<br />
              <span className="text-blue-100">Awaits</span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Discover amazing destinations and unforgettable experiences with GoHoliday. 
              Let us take you on a journey of a lifetime.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/tours" 
                className="px-8 py-4 bg-white text-primary-600 rounded-lg font-bold text-lg hover:bg-gray-100 transition shadow-lg hover:shadow-xl hover:scale-105"
              >
                Explore Tours
              </Link>
              <a 
                href="#featured" 
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-bold text-lg hover:bg-white hover:text-primary-600 transition"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats/Trust Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center animate-fade-in">
              <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">500+</div>
              <div className="text-gray-600 font-medium">Happy Travelers</div>
            </div>
            <div className="text-center animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">50+</div>
              <div className="text-gray-600 font-medium">Destinations</div>
            </div>
            <div className="text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">4.9★</div>
              <div className="text-gray-600 font-medium">Rating</div>
            </div>
            <div className="text-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">24/7</div>
              <div className="text-gray-600 font-medium">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tours Section */}
      <section id="featured" className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-block">
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-2">
                Featured Tours
              </h2>
              <div className="h-1 w-32 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto rounded-full"></div>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-4">
              Check out our handpicked selection of amazing tour packages
            </p>
          </div>

          {featuredTours.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {featuredTours.map((tour) => (
                  <TourCard key={tour.id} tour={tour} />
                ))}
              </div>
              <div className="text-center">
                <Link 
                  href="/tours" 
                  className="inline-block px-8 py-3 bg-primary-600 text-white rounded-lg font-bold hover:bg-primary-700 transition shadow-md hover:shadow-lg hover:scale-105"
                >
                  View All Tours →
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

      {/* Why Choose Us Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-2">
              Why Choose GoHoliday
            </h2>
            <div className="h-1 w-32 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto rounded-full mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-primary-50 to-blue-50 p-6 rounded-xl shadow-card hover:shadow-card-hover transition-shadow">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Best Price Guarantee</h3>
              <p className="text-gray-600 text-center">Get the best deals on your favorite tours with our price match guarantee.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-primary-50 to-blue-50 p-6 rounded-xl shadow-card hover:shadow-card-hover transition-shadow">
              <div className="w-16 h-16 bg-secondary-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Easy Booking</h3>
              <p className="text-gray-600 text-center">Book your dream vacation in just a few clicks via WhatsApp or our website.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-primary-50 to-blue-50 p-6 rounded-xl shadow-card hover:shadow-card-hover transition-shadow">
              <div className="w-16 h-16 bg-accent-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 text-center mb-2">24/7 Support</h3>
              <p className="text-gray-600 text-center">Our team is always available to help you with any questions or concerns.</p>
            </div>

            {/* Feature 4 */}
            <div className="bg-gradient-to-br from-primary-50 to-blue-50 p-6 rounded-xl shadow-card hover:shadow-card-hover transition-shadow">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Handpicked Tours</h3>
              <p className="text-gray-600 text-center">Every tour is carefully selected and verified for quality and value.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
