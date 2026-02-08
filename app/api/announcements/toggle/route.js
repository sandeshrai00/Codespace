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

    const { id, is_active } = await request.json()

    if (!id) {
      return NextResponse.json(
        { error: 'Announcement ID is required' },
        { status: 400 }
      )
    }

    // If activating this announcement, deactivate all others
    if (is_active) {
      await turso.execute('UPDATE announcements SET is_active = 0');
    }

    await turso.execute({
      sql: 'UPDATE announcements SET is_active = ? WHERE id = ?',
      args: [is_active ? 1 : 0, id]
    });

    revalidatePath('/admin/announcements')
    revalidatePath('/')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Toggle announcement error:', error)
    return NextResponse.json(
      { error: 'An error occurred while toggling the announcement' },
      { status: 500 }
    )
  }
}
