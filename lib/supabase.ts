import { createClient } from '@supabase/supabase-js'

// The publishable key is safe for browser use when database RLS is correctly configured.
// Environment variables remain the preferred deployment configuration and override these fallbacks.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://idvcuvvocxnovybhwykd.supabase.co'
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_6ySWbv0gikCeNFnIaonMiA_zMmokdj_'

export function getSupabase() {
  return createClient(url, key, { auth: { persistSession: false } })
}
