import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' => dziala na GitHub Pages niezaleznie od nazwy repo
export default defineConfig({
  base: './',
  plugins: [react()],
})
