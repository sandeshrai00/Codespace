import Header from '@/components/Header'
import TourCard from '@/components/TourCard'
import Link from 'next/link'
import { createClient } from '@libsql/client'

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function getActiveAnnouncement() {
  try {
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
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-3 px-4">
          <div className="container mx-auto text-center">
            <p className="text-sm md:text-base font-medium">📢 {announcement.message}</p>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-cyan-500 via-blue-500 to-blue-600 text-white py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Your Dream Vacation Awaits
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Discover amazing destinations and unforgettable experiences with GoHoliday. 
            Let us take you on a journey of a lifetime.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/tours" 
              className="px-8 py-3 bg-white text-cyan-600 rounded-lg font-bold text-lg hover:bg-gray-100 transition shadow-lg"
            >
              Explore Tours
            </Link>
            <a 
              href="#featured" 
              className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-bold text-lg hover:bg-white hover:text-cyan-600 transition"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Featured Tours Section */}
      <section id="featured" className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Tours
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
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
                  className="inline-block px-8 py-3 bg-cyan-600 text-white rounded-lg font-bold hover:bg-cyan-700 transition"
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
