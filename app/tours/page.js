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
      <section className="relative bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-16 overflow-hidden">
        {/* Decorative wave bottom border */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-12 fill-gray-50" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
          </svg>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Explore Our Tours
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Discover amazing destinations and create memories that last a lifetime
          </p>
        </div>
      </section>

      {/* Tours with Search & Filter */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          {tours.length > 0 ? (
            <TourSearch tours={tours} />
          ) : (
            <div className="text-center py-20 bg-white rounded-lg shadow-md">
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
