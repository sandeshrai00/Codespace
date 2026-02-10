import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-white font-bold text-lg">GoHoliday</div>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <Link href="/tours" className="hover:text-white transition">Tours</Link>
          </div>
          <p className="text-sm">© {new Date().getFullYear()} GoHoliday. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
