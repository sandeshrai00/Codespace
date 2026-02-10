import Header from '@/components/Header'
import Footer from '@/components/Footer'
import TourSearch from '@/components/TourSearch'
import { getTurso } from '@/lib/turso'

async function getAllTours() {
  try {
    const turso = getTurso();
    const result = await turso.execute({
      sql: 'SELECT * FROM tours ORDER BY created_at DESC',
      args: []
    });
    return result.rows.map(row => JSON.parse(JSON.stringify(row)));
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
      
      {/* Page Header - Clean and Simple */}
      <section className="bg-white py-12 border-b border-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Explore Our Tours
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover amazing destinations and create memories that last a lifetime
          </p>
        </div>
      </section>

      {/* Tours with Search & Filter */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          {tours.length > 0 ? (
            <TourSearch tours={tours} />
          ) : (
            <div className="text-center py-20 bg-white rounded-xl shadow-sm">
              <div className="text-6xl mb-6">🏖️</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">No Tours Available</h2>
              <p className="text-gray-600">Check back soon for exciting new destinations!</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
