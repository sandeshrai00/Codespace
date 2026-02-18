import { redirect } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'
import AdminNav from '@/components/AdminNav'
import Image from 'next/image'
import Link from 'next/link'
import { getTurso } from '@/lib/turso'
import DeleteTourButton from './DeleteTourButton'
import TourPriceDisplay from './TourPriceDisplay'

async function getStats() {
  try {
    const turso = getTurso();
    const toursResult = await turso.execute('SELECT COUNT(*) as count FROM tours');
    const announcementsResult = await turso.execute('SELECT COUNT(*) as count FROM announcements WHERE is_active = 1');
    
    return {
      totalTours: toursResult.rows[0].count,
      activeAnnouncements: announcementsResult.rows[0].count,
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    return { totalTours: 0, activeAnnouncements: 0 };
  }
}

async function getAllTours() {
  try {
    const turso = getTurso();
    const result = await turso.execute('SELECT * FROM tours ORDER BY created_at DESC');
    return result.rows;
  } catch (error) {
    console.error('Error fetching tours:', error);
    return [];
  }
}

export default async function AdminDashboardPage() {
  const authenticated = await isAuthenticated();
  
  if (!authenticated) {
    redirect('/admin');
  }

  const stats = await getStats();
  const tours = await getAllTours();

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNav />
      
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">GoHoliday Admin Dashboard</h1>
          <p className="text-gray-600">Manage your tours and announcements</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-cyan-100 rounded-full mr-4">
                <span className="text-3xl">🏖️</span>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Tours</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalTours}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full mr-4">
                <span className="text-3xl">📢</span>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Active Announcements</p>
                <p className="text-3xl font-bold text-gray-900">{stats.activeAnnouncements}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tours Management */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Tour Packages</h2>
            <Link 
              href="/admin/tours/new"
              className="w-full sm:w-auto text-center px-6 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition font-medium"
            >
              + Add New Tour
            </Link>
          </div>

          {tours.length > 0 ? (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b-2 border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Banner
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Duration
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {tours.map((tour) => (
                      <tr key={tour.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4">
                          <div className="relative h-16 w-24 rounded overflow-hidden">
                            {tour.banner_image ? (
                              <Image
                                src={tour.banner_image}
                                alt={tour.title}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-2xl">
                                🏖️
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="font-medium text-gray-900">{tour.title_en || tour.title}</div>
                        </td>
                        <td className="px-4 py-4">
                          <TourPriceDisplay price={tour.price} currency={tour.currency} />
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-gray-700">{tour.duration}</div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-gray-700">{tour.location_en || tour.location}</div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex gap-2">
                            <Link
                              href={`/admin/tours/edit/${tour.id}`}
                              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
                            >
                              Edit
                            </Link>
                            <DeleteTourButton tourId={tour.id} tourTitle={tour.title_en || tour.title} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {tours.map((tour) => (
                  <div key={tour.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex gap-4 mb-3">
                      <div className="relative h-20 w-28 rounded overflow-hidden flex-shrink-0">
                        {tour.banner_image ? (
                          <Image
                            src={tour.banner_image}
                            alt={tour.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-2xl">
                            🏖️
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-1 truncate">{tour.title}</h3>
                        <div className="text-lg font-bold">
                          <TourPriceDisplay price={tour.price} currency={tour.currency} />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center text-sm text-gray-700">
                        <span className="font-medium mr-2">Duration:</span>
                        <span>{tour.duration}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-700">
                        <span className="font-medium mr-2">Location:</span>
                        <span>{tour.location}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/tours/edit/${tour.id}`}
                        className="flex-1 text-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm font-medium"
                      >
                        Edit
                      </Link>
                      <DeleteTourButton tourId={tour.id} tourTitle={tour.title} />
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏖️</div>
              <p className="text-gray-600 mb-4">No tours yet</p>
              <Link 
                href="/admin/tours/new"
                className="inline-block px-6 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition"
              >
                Create Your First Tour
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
