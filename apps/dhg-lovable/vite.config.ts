import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  console.log('Vite Config Environment:', {
    mode,
    has_api_url: !!env.VITE_API_URL
  })

  return {
    base: '/',
    plugins: [react()],
    server: {
      port: 5179,
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target: 'http://localhost:8000',
          changeOrigin: true,
        },
      },
      allowedHosts: [
        'localhost',
        '10.0.0.177',
        '.ngrok-free.app',
        '.ngrok.io'
      ],
      strictPort: false,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      },
    },
    build: {
      sourcemap: true,
      rollupOptions: {
        external: [/test\/.*/],
      },
    },
    test: {
      globals: true,
      setupFiles: ['./tests/setup.ts'],
      environment: 'jsdom',
      include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
      typecheck: {
        enabled: true,
        tsconfig: './tsconfig.test.json'
      },
      pool: 'threads',
      isolate: true,
      deps: {
        optimizer: {
          web: {
            include: ['vitest']
          }
        }
      },
      coverage: {
        provider: 'v8',
        enabled: true,
        reporter: ['text', 'html'],
        reportsDirectory: './coverage',
        include: ['src/**/*.{ts,tsx}'],
        exclude: [
          'node_modules/',
          'dist/',
          '**/*.d.ts',
          '**/*.test.{ts,tsx}',
          '**/test-utils.tsx'
        ]
      }
    }
  }
})
