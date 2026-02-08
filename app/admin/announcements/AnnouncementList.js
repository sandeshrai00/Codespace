'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function AnnouncementList({ announcements }) {
  const router = useRouter()
  const [actionLoading, setActionLoading] = useState(null)

  const handleToggleActive = async (id, currentStatus) => {
    setActionLoading(id)
    try {
      const response = await fetch('/api/announcements/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_active: !currentStatus }),
      })

      if (response.ok) {
        router.refresh()
      } else {
        alert('Failed to toggle announcement status')
      }
    } catch (error) {
      console.error('Toggle error:', error)
      alert('An error occurred')
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async (id, message) => {
    if (!confirm(`Are you sure you want to delete this announcement?\n\n"${message}"`)) {
      return
    }

    setActionLoading(id)
    try {
      const response = await fetch('/api/announcements/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })

      if (response.ok) {
        router.refresh()
      } else {
        alert('Failed to delete announcement')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('An error occurred')
    } finally {
      setActionLoading(null)
    }
  }

  if (announcements.length === 0) {
    return (
      <div className="text-center py-8 text-gray-600">
        No announcements yet. Create your first announcement above.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b-2 border-gray-200">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Message
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Created
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {announcements.map((announcement) => (
            <tr key={announcement.id} className="hover:bg-gray-50">
              <td className="px-4 py-4">
                <div className="text-gray-900">{announcement.message}</div>
              </td>
              <td className="px-4 py-4">
                {announcement.is_active ? (
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    Active
                  </span>
                ) : (
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                    Inactive
                  </span>
                )}
              </td>
              <td className="px-4 py-4">
                <div className="text-sm text-gray-600">
                  {new Date(announcement.created_at).toLocaleDateString()}
                </div>
              </td>
              <td className="px-4 py-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleActive(announcement.id, announcement.is_active)}
                    disabled={actionLoading === announcement.id}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {actionLoading === announcement.id ? 'Loading...' : announcement.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleDelete(announcement.id, announcement.message)}
                    disabled={actionLoading === announcement.id}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
