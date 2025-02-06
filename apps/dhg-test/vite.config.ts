import { type UserConfig, defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// Using type assertion to ensure correct plugin type
const config: UserConfig = {
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
}

export default defineConfig(config)
