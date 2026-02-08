import Header from '@/components/Header'
import TourCard from '@/components/TourCard'
import { getTurso } from '@/lib/turso'

async function getAllTours() {
  try {
    const turso = getTurso();
    const result = await turso.execute({
      sql: 'SELECT * FROM tours ORDER BY created_at DESC',
      args: []
    });
    return result.rows;
  } catch (error) {
    console.error('Error fetching tours:', error);
    return [];
  }
}

export default async function ToursPage() {
  const tours = await getAllTours();

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Page Header */}
      <section className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Explore Our Tours
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Discover amazing destinations and create memories that last a lifetime
          </p>
        </div>
      </section>

      {/* Tours Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          {tours.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tours.map((tour) => (
                <TourCard key={tour.id} tour={tour} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-6">🏖️</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">No Tours Available</h2>
              <p className="text-gray-600">Check back soon for exciting new destinations!</p>
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
