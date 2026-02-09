'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminNav from '@/components/AdminNav'
import ImageUpload from '@/components/ImageUpload'

export default function EditTourForm({ tour }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  // Parse existing gallery images
  let existingGalleryImages = []
  try {
    if (tour.image_urls) {
      existingGalleryImages = JSON.parse(tour.image_urls)
    }
  } catch (e) {
    console.error('Error parsing image URLs:', e)
  }
  
  const [formData, setFormData] = useState({
    title: tour.title || '',
    description: tour.description || '',
    price: tour.price || '',
    duration: tour.duration || '',
    dates: tour.dates || '',
    location: tour.location || '',
  })
  
  const [bannerImage, setBannerImage] = useState(tour.banner_image || '')
  const [galleryImages, setGalleryImages] = useState(existingGalleryImages)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleBannerUpload = (url) => {
    setBannerImage(url)
  }

  const handleBannerRemove = () => {
    setBannerImage('')
  }

  const handleGalleryUpload = (url) => {
    setGalleryImages(prev => [...prev, url])
  }

  const handleGalleryRemove = (index) => {
    setGalleryImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      // Validation
      if (!formData.title || !formData.description || !formData.price || 
          !formData.duration || !formData.dates || !formData.location) {
        setError('All fields are required')
        setLoading(false)
        return
      }

      const response = await fetch('/api/tours/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: tour.id,
          ...formData,
          price: parseFloat(formData.price),
          banner_image: bannerImage,
          image_urls: JSON.stringify(galleryImages),
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Tour updated successfully!')
        setTimeout(() => {
          window.location.href = '/admin/dashboard'
        }, 1500)
      } else {
        setError(data.error || 'Failed to update tour')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNav />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Tour</h1>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Tour Title *
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="Amazing Beach Paradise Tour"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="Describe the tour in detail..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                    Price (USD) *
                  </label>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="999.99"
                  />
                </div>

                <div>
                  <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                    Duration *
                  </label>
                  <input
                    id="duration"
                    name="duration"
                    type="text"
                    value={formData.duration}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="5 Days / 4 Nights"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="dates" className="block text-sm font-medium text-gray-700 mb-2">
                  Available Dates *
                </label>
                <input
                  id="dates"
                  name="dates"
                  type="text"
                  value={formData.dates}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="January - March, June - August"
                />
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="Maldives"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Banner Image
                </label>
                <ImageUpload
                  images={bannerImage ? [bannerImage] : []}
                  onUpload={handleBannerUpload}
                  onRemove={handleBannerRemove}
                  isBanner={true}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gallery Images
                </label>
                <ImageUpload
                  images={galleryImages}
                  onUpload={handleGalleryUpload}
                  onRemove={handleGalleryRemove}
                  isBanner={false}
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition font-bold disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? 'Updating Tour...' : 'Update Tour'}
                </button>
                <button
                  type="button"
                  onClick={() => router.push('/admin/dashboard')}
                  className="px-6 py-3 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
