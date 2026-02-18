'use client'

import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import TourCard from './TourCard'
import { getLocalizedField } from '@/lib/i18n'

export default function TourSearch({ tours, lang = 'en', dict }) {
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState('')
  const [priceRange, setPriceRange] = useState('all')
  const [locationFilter, setLocationFilter] = useState('all')
  const [durationFilter, setDurationFilter] = useState('all')

  // Set locationFilter from URL parameter
  useEffect(() => {
    const locationParam = searchParams.get('location')
    // Always sync with URL parameter - set to 'all' if not present
    setLocationFilter(locationParam || 'all')
  }, [searchParams])

  // Extract unique locations from tours
  const uniqueLocations = useMemo(() => {
    const locations = tours.map(tour => getLocalizedField(tour, 'location', lang))
    return [...new Set(locations)].sort()
  }, [tours, lang])

  // Filter tours based on all criteria
  const filteredTours = useMemo(() => {
    return tours.filter(tour => {
      const localizedTitle = getLocalizedField(tour, 'title', lang)
      const localizedLocation = getLocalizedField(tour, 'location', lang)
      
      // Search term filter (title or location)
      const matchesSearch = searchTerm === '' || 
        localizedTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        localizedLocation.toLowerCase().includes(searchTerm.toLowerCase())

      // Price range filter
      let matchesPrice = true
      if (priceRange === 'under500') {
        matchesPrice = tour.price < 500
      } else if (priceRange === '500-1000') {
        matchesPrice = tour.price >= 500 && tour.price < 1000
      } else if (priceRange === '1000-2000') {
        matchesPrice = tour.price >= 1000 && tour.price < 2000
      } else if (priceRange === '2000plus') {
        matchesPrice = tour.price >= 2000
      }

      // Location filter
      // Compare with English location for URL-based filtering, or localized for dropdown
      const englishLocation = getLocalizedField(tour, 'location', 'en')
      const matchesLocation = locationFilter === 'all' || 
        localizedLocation === locationFilter || 
        englishLocation === locationFilter

      // Duration filter
      let matchesDuration = true
      if (durationFilter !== 'all') {
        const durationLower = tour.duration.toLowerCase()
        if (durationFilter === '1-3') {
          matchesDuration = /1|2|3.*day/i.test(durationLower) && !/week/i.test(durationLower)
        } else if (durationFilter === '4-7') {
          matchesDuration = /4|5|6|7.*day/i.test(durationLower) && !/week/i.test(durationLower)
        } else if (durationFilter === '1-2weeks') {
          matchesDuration = /1.*week|2.*week/i.test(durationLower) || /8|9|10|11|12|13|14.*day/i.test(durationLower)
        } else if (durationFilter === '2weeksplus') {
          matchesDuration = /\d+.*week/i.test(durationLower) && !/1.*week|2.*week/i.test(durationLower) || /1[5-9]|[2-9]\d.*day/i.test(durationLower)
        }
      }

      return matchesSearch && matchesPrice && matchesLocation && matchesDuration
    })
  }, [tours, searchTerm, priceRange, locationFilter, durationFilter, lang])

  const handleClearFilters = () => {
    setSearchTerm('')
    setPriceRange('all')
    setLocationFilter('all')
    setDurationFilter('all')
  }

  const hasActiveFilters = searchTerm !== '' || priceRange !== 'all' || locationFilter !== 'all' || durationFilter !== 'all'

  return (
    <div>
      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-3 mb-4">
          {/* Search Input */}
          <div className="flex-1">
            <div className="relative">
              <input
                id="search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={dict?.tours?.searchPlaceholder || 'Search tours...'}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
              />
              <svg 
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="md:w-44">
            <select
              id="price"
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition bg-white"
            >
              <option value="all">All Prices</option>
              <option value="under500">Under $500</option>
              <option value="500-1000">$500 - $1000</option>
              <option value="1000-2000">$1000 - $2000</option>
              <option value="2000plus">$2000+</option>
            </select>
          </div>

          {/* Location Filter */}
          <div className="md:w-44">
            <select
              id="location"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition bg-white"
            >
              <option value="all">All Locations</option>
              {uniqueLocations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>

          {/* Duration Filter */}
          <div className="md:w-44">
            <select
              id="duration"
              value={durationFilter}
              onChange={(e) => setDurationFilter(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition bg-white"
            >
              <option value="all">All Durations</option>
              <option value="1-3">1-3 Days</option>
              <option value="4-7">4-7 Days</option>
              <option value="1-2weeks">1-2 Weeks</option>
              <option value="2weeksplus">2+ Weeks</option>
            </select>
          </div>
        </div>

        {/* Filter Actions */}
        <div className="flex flex-col xs:flex-row items-center justify-between gap-2 pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-700 text-center xs:text-left">
            <span className="font-semibold text-primary-600">{filteredTours.length}</span> tours found
          </div>
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 text-sm font-medium text-primary-600 hover:text-white hover:bg-primary-600 border-2 border-primary-600 rounded-lg transition"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Results Grid */}
      <div className="transition-all duration-300">
        {filteredTours.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {filteredTours.map((tour) => (
              <div key={tour.id} className="animate-fade-in">
                <TourCard tour={tour} lang={lang} dict={dict} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm">
            <div className="text-6xl mb-6">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No tours match your filters</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search criteria to find more tours.</p>
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition"
              >
                Clear All Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
