import './globals.css'
import WhatsAppFloat from '@/components/WhatsAppFloat'

export const metadata = {
  title: 'GoHoliday - Your Dream Vacation Awaits',
  description: 'Discover amazing travel packages and tours with GoHoliday',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className="font-sans">
        {children}
        <WhatsAppFloat />
      </body>
    </html>
  )
}
