'use client'

import { createContext, useContext, useState } from 'react'

const CurrencyContext = createContext()

export const EXCHANGE_RATES = {
  USD: 1,
  EUR: 0.92,
  INR: 83.12,
  GBP: 0.79,
  AUD: 1.53,
}

export const CURRENCY_SYMBOLS = {
  USD: '$',
  EUR: '€',
  INR: '₹',
  GBP: '£',
  AUD: 'A$',
}

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState('USD')
  
  const convertPrice = (priceInUSD) => {
    const converted = priceInUSD * EXCHANGE_RATES[currency]
    return `${CURRENCY_SYMBOLS[currency]}${converted.toLocaleString(undefined, { 
      minimumFractionDigits: 0, 
      maximumFractionDigits: 0 
    })}`
  }
  
  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, convertPrice }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (!context) {
    throw new Error('useCurrency must be used within CurrencyProvider')
  }
  return context
}
