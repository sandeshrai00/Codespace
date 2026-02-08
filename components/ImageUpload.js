'use client'

import { CldUploadWidget } from 'next-cloudinary'
import Image from 'next/image'

export default function ImageUpload({ images = [], onUpload, onRemove, isBanner = false }) {
  // Check if Cloudinary is configured
  const isCloudinaryConfigured = !!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  
  return (
    <div className="space-y-4">
      {/* Upload Button */}
      {isCloudinaryConfigured ? (
        <CldUploadWidget
          uploadPreset="ml_default"
          onSuccess={(result) => {
            if (result.event === 'success' && result.info?.secure_url) {
              onUpload(result.info.secure_url)
            }
          }}
          options={{
            multiple: !isBanner,
            maxFiles: isBanner ? 1 : 10,
          }}
        >
          {({ open }) => (
            <button
              type="button"
              onClick={() => open()}
              className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition"
            >
              {isBanner ? 'Upload Banner Image' : 'Upload Images'}
            </button>
          )}
        </CldUploadWidget>
      ) : (
        <div className="p-4 bg-yellow-100 border border-yellow-400 rounded-md">
          <p className="text-sm text-yellow-800">
            Cloudinary is not configured. Please set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME in your environment variables.
          </p>
          <p className="text-xs text-yellow-700 mt-2">
            For now, you can manually enter image URLs in the input field below.
          </p>
          <input
            type="text"
            placeholder="Enter image URL"
            className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                const url = e.target.value.trim();
                if (url) {
                  onUpload(url);
                  e.target.value = '';
                }
              }
            }}
          />
        </div>
      )}

      {/* Image Previews */}
      {images.length > 0 && (
        <div className={`grid gap-4 ${isBanner ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'}`}>
          {images.map((url, index) => (
            <div key={index} className="relative group">
              <div className="relative h-40 w-full rounded-lg overflow-hidden border-2 border-gray-200">
                <Image
                  src={url}
                  alt={`Image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition opacity-0 group-hover:opacity-100"
                aria-label="Remove image"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
