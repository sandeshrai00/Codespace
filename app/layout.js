import './globals.css'
import WhatsAppFloat from '@/components/WhatsAppFloat'

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
        {children}
        <WhatsAppFloat />
      </body>
    </html>
  )
}
