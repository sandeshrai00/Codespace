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

    const data = await request.json()
    const { title, description, price, duration, dates, location, banner_image, image_urls } = data

    // Validation
    if (!title || !description || !price || !duration || !dates || !location) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    await turso.execute({
      sql: `INSERT INTO tours (title, description, price, duration, dates, location, banner_image, image_urls) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [title, description, price, duration, dates, location, banner_image || null, image_urls || '[]']
    });

    revalidatePath('/admin/dashboard')
    revalidatePath('/tours')
    revalidatePath('/')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Create tour error:', error)
    return NextResponse.json(
      { error: 'An error occurred while creating the tour' },
      { status: 500 }
    )
  }
}
