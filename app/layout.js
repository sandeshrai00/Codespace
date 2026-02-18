import './globals.css'
import WhatsAppFloat from '@/components/WhatsAppFloat'
import { CurrencyProvider } from '@/components/CurrencyProvider'

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning>
      <body className="font-sans" suppressHydrationWarning>
        <CurrencyProvider>
          {children}
          <WhatsAppFloat />
        </CurrencyProvider>
      </body>
    </html>
  )
}
