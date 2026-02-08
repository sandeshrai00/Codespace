import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { createClient } from '@libsql/client'
import { revalidatePath } from 'next/cache'

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export async function POST(request) {
  try {
    const authenticated = await isAuthenticated();
    
    if (!authenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { tourId } = await request.json()

    if (!tourId) {
      return NextResponse.json(
        { error: 'Tour ID is required' },
        { status: 400 }
      )
    }

    await turso.execute({
      sql: 'DELETE FROM tours WHERE id = ?',
      args: [tourId]
    });

    revalidatePath('/admin/dashboard')
    revalidatePath('/tours')
    revalidatePath('/')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete tour error:', error)
    return NextResponse.json(
      { error: 'An error occurred while deleting the tour' },
      { status: 500 }
    )
  }
}
