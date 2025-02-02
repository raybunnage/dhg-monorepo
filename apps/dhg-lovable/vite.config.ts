import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  console.log('Vite Config Environment:', {
    mode,
    has_api_url: !!env.VITE_API_URL
  })

  return {
    plugins: [react()],
    server: {
      port: 5179,
      host: true,
      proxy: {
        '/api': {
          target: 'http://localhost:8000',
          changeOrigin: true,
        },
      },
      allowedHosts: [
        'localhost',
        '.ngrok-free.app',
        '.ngrok.io'
      ],
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
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
