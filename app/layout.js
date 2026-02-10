import './globals.css'
import WhatsAppFloat from '@/components/WhatsAppFloat'
import { CurrencyProvider } from '@/components/CurrencyProvider'

export const metadata = {
  title: 'GoHoliday - Your Dream Vacation Awaits',
  description: 'Discover amazing travel packages and tours with GoHoliday',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans">
        <CurrencyProvider>
          {children}
          <WhatsAppFloat />
        </CurrencyProvider>
      </body>
    </html>
  )
}
