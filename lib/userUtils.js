/**
 * Get a user-friendly display name from a Supabase user object
 * @param {Object} user - Supabase user object
 * @returns {string} Display name (full name or email username)
 */
export function getUserDisplayName(user) {
  if (!user) return 'Anonymous'
  return user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'
}

/**
 * Get a profile display name from a profiles object
 * @param {Object} profile - Profile object with full_name and email
 * @returns {string} Display name (full name or email username)
 */
export function getProfileDisplayName(profile) {
  if (!profile) return 'Anonymous'
  return profile.full_name || profile.email?.split('@')[0] || 'Anonymous'
}
