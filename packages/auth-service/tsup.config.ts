import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: {
    resolve: true,
  },
  clean: true,
  external: ['react', 'react-router-dom', '@supabase/supabase-js'],
  treeshake: true,
  sourcemap: true
}); 