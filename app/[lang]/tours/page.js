import Header from '@/components/Header'
import Footer from '@/components/Footer'
import TourSearch from '@/components/TourSearch'
import { getTurso } from '@/lib/turso'
import { getDictionary } from '@/lib/i18n'

async function getAllTours(lang) {
  try {
    const turso = getTurso();
    const result = await turso.execute({
      sql: `SELECT id, title, title_en, title_th, title_zh, description, description_en, description_th, description_zh, 
             price, currency, location, location_en, location_th, location_zh, duration, banner_image, dates, created_at 
             FROM tours ORDER BY created_at DESC`,
      args: []
    });
    return result.rows.map(row => JSON.parse(JSON.stringify(row)));
  } catch (error) {
    console.error('Error fetching tours:', error);
    return [];
  }
}

export default async function ToursPage({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const tours = await getAllTours(lang);

  return (
    <div className="min-h-screen">
      <Header lang={lang} dict={dict} />
      
      {/* Page Header - Clean and Simple */}
      <section className="bg-white py-12 border-b border-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {dict.tours.pageTitle}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {dict.tours.pageDescription}
          </p>
        </div>
      </section>

      {/* Tours with Search & Filter */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          {tours.length > 0 ? (
            <TourSearch tours={tours} lang={lang} dict={dict} />
          ) : (
            <div className="text-center py-20 bg-white rounded-xl shadow-sm">
              <div className="text-6xl mb-6">🏖️</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{dict.tours.noToursTitle}</h2>
              <p className="text-gray-600">{dict.tours.noToursMessage}</p>
            </div>
          )}
        </div>
      </section>

      <Footer lang={lang} dict={dict} />
    </div>
  )
}
