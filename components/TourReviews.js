'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { getProfileDisplayName } from '@/lib/userUtils'

// Helper function to get localized comment
function getLocalizedComment(review, lang) {
  if (!review) return '';
  
  // Try to get the localized comment based on the language
  const commentField = `comment_${lang}`;
  if (review[commentField]) {
    return review[commentField];
  }
  
  // Fallback to English if the localized version doesn't exist
  if (review.comment_en) {
    return review.comment_en;
  }
  
  // Final fallback to the default comment field
  return review.comment || '';
}

export default function TourReviews({ tourId, lang = 'en', dict }) {
  const [reviews, setReviews] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [existingReview, setExistingReview] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const formRef = useRef(null)

  // Constants for scroll behavior
  const SCROLL_OFFSET = 100 // Offset from top when scrolling to form
  const SCROLL_DELAY = 100 // Delay to ensure form is rendered before scrolling

  const fetchReviews = useCallback(async () => {
    if (!supabase) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      // Explicitly cast tourId to number to avoid string/number mismatch
      const numericTourId = Number(tourId)
      
      // Validate that tourId is a valid number
      if (isNaN(numericTourId)) {
        console.error('Invalid tourId:', tourId)
        setLoading(false)
        return
      }
      
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles!left (
            full_name,
            email
          )
        `)
        .eq('tour_id', numericTourId)
        .order('created_at', { ascending: false })

      // Add debugging logs (as requested in requirements for debugging)
      console.log('Fetched reviews:', data)
      console.log('Fetch reviews error:', error)

      // Handle PGRST200 relationship error
      if (error && error.code === 'PGRST200') {
        console.warn('⚠️ PGRST200 Relationship Error: Could not find a relationship between reviews and profiles')
        console.warn('📋 To fix this error, please run the updated SQL schema from SUPABASE_SCHEMA.sql')
        console.warn('The key change needed: user_id must reference public.profiles(id), not auth.users(id)')
        console.warn('See SUPABASE_IMPLEMENTATION.md for detailed troubleshooting steps.')
        
        // Fallback: Fetch reviews without profiles join
        console.log('🔄 Attempting to fetch reviews without profile information as a fallback...')
        try {
          const { data: fallbackData, error: fallbackError } = await supabase
            .from('reviews')
            .select('*')
            .eq('tour_id', numericTourId)
            .order('created_at', { ascending: false })
          
          if (fallbackError) {
            console.error('Fallback query also failed:', fallbackError)
            throw new Error(`Failed to fetch reviews even without profiles join: ${fallbackError.message}`)
          }
          
          console.log('✅ Fallback successful: Reviews fetched without profile information')
          setReviews(fallbackData || [])
          return
        } catch (fallbackErr) {
          console.error('Error during fallback fetch:', fallbackErr)
          throw fallbackErr
        }
      }

      if (error) throw error
      setReviews(data || [])
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }, [tourId])

  const fetchExistingReview = useCallback(async (userId) => {
    if (!supabase || !userId) return

    try {
      const numericTourId = Number(tourId)
      if (isNaN(numericTourId)) return

      const { data, error } = await supabase
        .from('reviews')
        .select('id, tour_id, user_id, rating, comment, comment_en, comment_th, comment_zh, created_at, updated_at')
        .eq('tour_id', numericTourId)
        .eq('user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        // PGRST116 is "no rows returned" which is expected if user hasn't reviewed yet
        console.error('Error fetching existing review:', error)
        return
      }

      if (data) {
        setExistingReview(data)
        setRating(data.rating)
        setComment(data.comment)
      }
    } catch (error) {
      console.error('Error in fetchExistingReview:', error)
    }
  }, [tourId])

  useEffect(() => {
    // Check current user
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        const currentUser = session?.user ?? null
        setUser(currentUser)
        if (currentUser) {
          fetchExistingReview(currentUser.id)
        }
      })

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        const currentUser = session?.user ?? null
        setUser(currentUser)
        if (currentUser) {
          fetchExistingReview(currentUser.id)
        } else {
          setExistingReview(null)
          setRating(5)
          setComment('')
        }
      })

      // Fetch reviews
      fetchReviews()

      return () => subscription.unsubscribe()
    } else {
      setLoading(false)
    }
  }, [fetchReviews, fetchExistingReview])

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    
    if (!user) {
      setError(dict?.reviews?.errorLogin || 'Please login to submit a review')
      return
    }

    if (!supabase) {
      setError(dict?.reviews?.errorConfig || 'Supabase is not configured')
      return
    }

    try {
      setSubmitting(true)
      setError('')
      setMessage('')

      // Translate the comment to Thai and Chinese
      const translationResponse = await fetch('/api/reviews/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ comment }),
      })

      let translatedComment = {
        comment_en: comment,
        comment_th: comment,
        comment_zh: comment
      }

      if (translationResponse.ok) {
        translatedComment = await translationResponse.json()
      } else {
        console.warn('Translation failed, using original comment for all languages')
      }

      const { error } = await supabase
        .from('reviews')
        .upsert([
          {
            tour_id: Number(tourId),
            user_id: user.id,
            rating,
            comment,
            comment_en: translatedComment.comment_en,
            comment_th: translatedComment.comment_th,
            comment_zh: translatedComment.comment_zh,
          }
        ], { onConflict: 'tour_id, user_id' })

      if (error) throw error

      const isUpdate = existingReview !== null
      setMessage(isUpdate ? (dict?.reviews?.successUpdate || 'Review updated successfully!') : (dict?.reviews?.successSubmit || 'Review submitted successfully!'))
      
      // Set isEditing to false after successful submission
      setIsEditing(false)
      
      // Refetch the user's review to ensure state is accurate
      await fetchExistingReview(user.id)
      
      // Refresh reviews
      fetchReviews()
      
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setError(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  const renderStars = (rating, interactive = false, onRate = null) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? 'button' : undefined}
            onClick={() => interactive && onRate && onRate(star)}
            className={interactive ? 'cursor-pointer hover:scale-110 transition' : ''}
            disabled={!interactive}
          >
            <svg
              className={`w-5 h-5 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
      </div>
    )
  }

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1)
    : 0

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{dict?.reviews?.title || 'Customer Reviews'}</h2>

      {!supabase ? (
        <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
          <p className="text-gray-700 mb-2">{dict?.reviews?.notConfigured || 'Review system is not configured yet.'}</p>
          <p className="text-sm text-gray-600">{dict?.reviews?.configureMessage || 'Please configure Supabase environment variables to enable reviews.'}</p>
        </div>
      ) : (
        <>
          {/* Rating Summary */}
          {reviews.length > 0 && (
            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900">{averageRating}</div>
                  <div className="text-sm text-gray-600">{dict?.reviews?.outOf5 || 'out of 5'}</div>
                </div>
                <div>
                  {renderStars(Math.round(averageRating))}
                  <div className="text-sm text-gray-600 mt-1">
                    {dict?.reviews?.basedOn || 'Based on'} {reviews.length} {reviews.length === 1 ? (dict?.reviews?.review || 'review') : (dict?.reviews?.reviews || 'reviews')}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Submit Review Form */}
          {user && (!existingReview || isEditing) && (
            <form ref={formRef} onSubmit={handleSubmitReview} className="mb-8 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {existingReview ? (dict?.reviews?.editReview || 'Edit Your Review') : (dict?.reviews?.writeReview || 'Write a Review')}
              </h3>
              
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}
              
              {message && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
                  {message}
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {dict?.reviews?.rating || 'Rating'}
                </label>
                {renderStars(rating, true, setRating)}
              </div>

              <div className="mb-4">
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                  {dict?.reviews?.yourReview || 'Your Review'}
                </label>
                <textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder={dict?.reviews?.placeholder || "Share your experience with this tour..."}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (dict?.reviews?.submitting || 'Submitting...') : (existingReview ? (dict?.reviews?.updateReview || 'Update Review') : (dict?.reviews?.submitReview || 'Submit Review'))}
              </button>
            </form>
          )}

          {/* Login Prompt */}
          {!user && (
            <div className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-lg text-center">
              <p className="text-gray-700 mb-3">{dict?.reviews?.loginPrompt || 'Please login to write a review'}</p>
              <Link
                href="/login"
                className="inline-block px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition"
              >
                {dict?.reviews?.loginButton || 'Login'}
              </Link>
            </div>
          )}

          {/* Reviews List */}
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-primary-600"></div>
              <p className="mt-2 text-gray-600">{dict?.reviews?.loadingReviews || 'Loading reviews...'}</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <p>{dict?.reviews?.noReviewsYet || 'No reviews yet. Be the first to review this tour!'}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-semibold text-gray-900">
                        {getProfileDisplayName(review.profiles)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(review.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                    {renderStars(review.rating)}
                  </div>
                  <p className="text-gray-700 leading-relaxed">{getLocalizedComment(review, lang)}</p>
                  
                  {/* Update Review Button for user's own review */}
                  {user && review.user_id === user.id && (
                    <button
                      onClick={() => {
                        setIsEditing(true)
                        // Scroll to form smoothly
                        setTimeout(() => {
                          if (formRef.current) {
                            window.scrollTo({
                              top: formRef.current.offsetTop - SCROLL_OFFSET,
                              behavior: 'smooth'
                            })
                          }
                        }, SCROLL_DELAY)
                      }}
                      className="mt-3 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                    >
                      {dict?.reviews?.updateButton || 'Update Review'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
