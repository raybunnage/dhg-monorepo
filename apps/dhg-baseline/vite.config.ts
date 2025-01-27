import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')
  
  console.log('Vite Config Environment:', {
    mode,
    has_supabase_url: !!env.VITE_SUPABASE_URL,
    url_value: env.VITE_SUPABASE_URL
  })

  return {
    plugins: [react()],
    server: {
      port: 5177,
      proxy: {
        '/api': {
          target: 'http://localhost:8000',
          changeOrigin: true,
        },
      },
    },
    define: {
      __ENV_CHECK__: JSON.stringify({
        supabaseUrl: !!env.VITE_SUPABASE_URL,
        anonKey: !!env.VITE_SUPABASE_ANON_KEY
      })
    },
  }
})
