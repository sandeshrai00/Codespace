import { redirect } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'
import AdminNav from '@/components/AdminNav'
import { getTurso } from '@/lib/turso'
import AnnouncementForm from './AnnouncementForm'
import AnnouncementList from './AnnouncementList'

async function getAllAnnouncements() {
  try {
    const turso = getTurso();
    const result = await turso.execute({
      sql: 'SELECT * FROM announcements ORDER BY created_at DESC',
      args: []
    });
    return result.rows;
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return [];
  }
}

export default async function AnnouncementsPage() {
  const authenticated = await isAuthenticated();
  
  if (!authenticated) {
    redirect('/admin');
  }

  const announcements = await getAllAnnouncements();

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNav />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Manage Announcements</h1>

          {/* Add New Announcement Form */}
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-8">
            <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Add New Announcement</h2>
            <AnnouncementForm />
          </div>

          {/* Announcements List */}
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">All Announcements</h2>
            <AnnouncementList announcements={announcements} />
          </div>
        </div>
      </div>
    </div>
  )
}
