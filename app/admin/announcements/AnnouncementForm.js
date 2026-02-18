'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ImageUpload from '@/components/ImageUpload'

export default function AnnouncementForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [message, setMessage] = useState('')
  const [isActive, setIsActive] = useState(false)
  const [type, setType] = useState('banner')
  const [imageUrl, setImageUrl] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      if (!message.trim()) {
        setError('Message is required')
        setLoading(false)
        return
      }

      const response = await fetch('/api/announcements/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message, 
          is_active: isActive,
          type,
          image_url: type === 'popup' ? imageUrl : null
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Announcement created successfully!')
        setMessage('')
        setIsActive(false)
        setType('banner')
        setImageUrl('')
        router.refresh()
      } else {
        setError(data.error || 'Failed to create announcement')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            Message *
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            placeholder="Enter announcement message..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Display Type *
          </label>
          <div className="flex gap-6">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                value="banner"
                checked={type === 'banner'}
                onChange={(e) => setType(e.target.value)}
                className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">Banner</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                value="popup"
                checked={type === 'popup'}
                onChange={(e) => setType(e.target.value)}
                className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">Pop-up</span>
            </label>
          </div>
        </div>

        {type === 'popup' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pop-up Image (Optional)
            </label>
            <ImageUpload
              images={imageUrl ? [imageUrl] : []}
              onUpload={(url) => setImageUrl(url)}
              onRemove={() => setImageUrl('')}
              isBanner={true}
            />
            <p className="text-xs text-gray-500 mt-2">
              Add an eye-catching image to display at the top of the pop-up announcement.
            </p>
          </div>
        )}

        <div className="flex items-center">
          <input
            id="isActive"
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
          />
          <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
            Set as Active (Only one announcement can be active at a time)
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto px-6 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating...' : 'Create Announcement'}
        </button>
      </form>
    </div>
  )
}
