'use client'

import { useState } from 'react'
import { useCurrency, CURRENCY_SYMBOLS } from './CurrencyProvider'

export default function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency()
  const [isOpen, setIsOpen] = useState(false)

  const currencies = [
    { code: 'USD', name: 'US Dollar' },
    { code: 'INR', name: 'Indian Rupee' },
    { code: 'THB', name: 'Thai Baht' },
    { code: 'NPR', name: 'Nepali Rupee' },
  ]

  const handleCurrencyChange = (newCurrency) => {
    if (newCurrency === currency) {
      setIsOpen(false)
      return
    }
    setCurrency(newCurrency)
    setIsOpen(false)
  }

  const CurrencyIcon = () => (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )

  return (
    <div className="relative">
      {/* Desktop Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg md:rounded-2xl text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-all duration-200 border border-transparent hover:border-primary-200"
        aria-label={`Select currency - Current: ${currency}`}
        aria-expanded={isOpen}
      >
        <CurrencyIcon />
        <svg 
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Mobile Circular Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden rounded-full w-10 h-10 flex items-center justify-center text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-all duration-200 border border-transparent hover:border-primary-200"
        aria-label={`Select currency - Current: ${currency}`}
        aria-expanded={isOpen}
      >
        <CurrencyIcon />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-48 rounded-2xl shadow-lg bg-white border border-primary-200 z-50 animate-slide-down">
            <div className="py-1">
              {currencies.map((curr) => {
                const isActive = curr.code === currency
                
                return (
                  <button
                    key={curr.code}
                    onClick={() => handleCurrencyChange(curr.code)}
                    className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors ${
                      isActive ? 'bg-primary-50 text-primary-600 font-medium' : ''
                    }`}
                  >
                    <span className="text-lg">{CURRENCY_SYMBOLS[curr.code]}</span>
                    <span className="flex-1 text-left">{curr.code}</span>
                    {isActive && (
                      <svg className="w-4 h-4 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
