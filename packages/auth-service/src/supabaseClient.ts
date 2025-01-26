import { createClient } from '@supabase/supabase-js'

let supabaseUrl = ''
let supabaseAnonKey = ''

// Try to get environment variables from different sources
if (typeof process !== 'undefined' && process.env) {
  supabaseUrl = process.env.VITE_SUPABASE_URL || ''
  supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || ''
} else if (typeof import.meta !== 'undefined' && import.meta.env) {
  supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
  supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Please check your environment variables.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey) 