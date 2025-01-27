export function testEnvironment() {
  return {
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
    hasAnonKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
    mode: import.meta.env.MODE,
    isDev: import.meta.env.DEV
  };
} 