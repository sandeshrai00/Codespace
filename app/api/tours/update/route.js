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
    const { id, title, description, price, duration, dates, location, banner_image, image_urls } = data

    // Validation
    if (!id || !title || !description || !price || !duration || !dates || !location) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    await turso.execute({
      sql: `UPDATE tours 
            SET title = ?, description = ?, price = ?, duration = ?, dates = ?, 
                location = ?, banner_image = ?, image_urls = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?`,
      args: [title, description, price, duration, dates, location, banner_image || null, image_urls || '[]', id]
    });

    revalidatePath('/admin/dashboard')
    revalidatePath('/tours')
    revalidatePath(`/tours/${id}`)
    revalidatePath('/')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Update tour error:', error)
    return NextResponse.json(
      { error: 'An error occurred while updating the tour' },
      { status: 500 }
    )
  }
}
