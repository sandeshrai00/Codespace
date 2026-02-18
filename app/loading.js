import Image from 'next/image'

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center">
        {/* Spinning Logo */}
        <div className="relative w-24 h-24 mx-auto mb-6 animate-spin">
          <Image
            src="/img/logo.png"
            alt="Loading"
            fill
            className="object-contain"
          />
        </div>
        
        {/* Loading Text */}
        <p className="text-xl text-gray-600 font-medium animate-pulse">
          Loading your adventure...
        </p>
      </div>
    </div>
  )
}
