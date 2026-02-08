import './globals.css'

export const metadata = {
  title: 'GoHoliday - Your Dream Vacation Awaits',
  description: 'Discover amazing travel packages and tours with GoHoliday',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
