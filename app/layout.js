import './globals.css'
import WhatsAppFloat from '@/components/WhatsAppFloat'
import { CurrencyProvider } from '@/components/CurrencyProvider'

export const metadata = {
  title: 'GoHoliday - Nepal-Thailand Travel Specialists',
  description: 'Expert-curated travel experiences between Nepal and Thailand. Discover the perfect blend of Himalayan mountains and tropical beaches with our specialized tours.',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({ children }) {
  return (
    <html>
      <body className="font-sans">
        <CurrencyProvider>
          {children}
          <WhatsAppFloat />
        </CurrencyProvider>
      </body>
    </html>
  )
}
