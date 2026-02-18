import { NextResponse } from 'next/server'
import { translateReviewComment } from '@/lib/translate'

export async function POST(request) {
  try {
    const data = await request.json()
    const { comment } = data

    // Validation
    if (!comment) {
      return NextResponse.json(
        { error: 'Comment is required' },
        { status: 400 }
      )
    }

    // Translate comment to Thai and Chinese
    const translatedComment = await translateReviewComment(comment);

    return NextResponse.json(translatedComment)
  } catch (error) {
    console.error('Translate review comment error:', error)
    return NextResponse.json(
      { error: 'An error occurred while translating the comment' },
      { status: 500 }
    )
  }
}
