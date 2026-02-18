'use client'

import { useCurrency, CURRENCY_SYMBOLS } from './CurrencyProvider'

export default function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency()

  const currencies = [
    { code: 'USD', name: 'US Dollar' },
    { code: 'INR', name: 'Indian Rupee' },
    { code: 'THB', name: 'Thai Baht' },
    { code: 'NPR', name: 'Nepali Rupee' },
  ]

  return (
    <div className="relative">
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        className="appearance-none bg-white/50 border border-gray-200 rounded-lg px-3 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-primary-200 hover:bg-primary-50/50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 cursor-pointer backdrop-blur-sm"
        aria-label="Select currency"
      >
        {currencies.map((curr) => (
          <option key={curr.code} value={curr.code}>
            {CURRENCY_SYMBOLS[curr.code]} {curr.code}
          </option>
        ))}
      </select>
      <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  )
}
