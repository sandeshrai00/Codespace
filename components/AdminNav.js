'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AdminNav() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', { method: 'POST' })
      if (response.ok) {
        router.push('/admin')
      }
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <nav className="bg-secondary-900 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/admin/dashboard" className="text-xl font-bold text-primary-400 hover:text-primary-300 transition">
            ✈️ GoHoliday Admin
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <Link 
              href="/admin/dashboard" 
              className="text-gray-300 hover:text-white transition font-medium"
            >
              Dashboard
            </Link>
            <Link 
              href="/admin/tours/new" 
              className="text-gray-300 hover:text-white transition font-medium"
            >
              Add Tour
            </Link>
            <Link 
              href="/admin/announcements" 
              className="text-gray-300 hover:text-white transition font-medium"
            >
              Announcements
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg transition font-medium shadow-md"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
