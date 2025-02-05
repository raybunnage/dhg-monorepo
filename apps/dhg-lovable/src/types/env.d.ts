interface ImportMetaEnv {
  readonly VITE_APP_ENV: 'development' | 'production' | 'preview'
  readonly VITE_API_URL: string
  readonly VITE_SUPABASE_URL: string
  readonly VITE_APP_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 