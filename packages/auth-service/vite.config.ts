import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'js'}`
    },
    rollupOptions: {
      external: ['react', 'react-router-dom', '@supabase/supabase-js'],
      output: {
        globals: {
          react: 'React',
          'react-router-dom': 'ReactRouterDOM',
          '@supabase/supabase-js': 'SupabaseJs'
        }
      }
    }
  }
}); 