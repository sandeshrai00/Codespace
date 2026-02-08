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

    const { message, is_active } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // If setting as active, deactivate all other announcements
    if (is_active) {
      await turso.execute('UPDATE announcements SET is_active = 0');
    }

    await turso.execute({
      sql: 'INSERT INTO announcements (message, is_active) VALUES (?, ?)',
      args: [message, is_active ? 1 : 0]
    });

    revalidatePath('/admin/announcements')
    revalidatePath('/')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Create announcement error:', error)
    return NextResponse.json(
      { error: 'An error occurred while creating the announcement' },
      { status: 500 }
    )
  }
}
