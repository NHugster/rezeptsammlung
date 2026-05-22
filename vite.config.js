import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Rezeptsammlung',
        short_name: 'Rezepte',
        description: 'Persönliche Rezeptsammlung',
        theme_color: '#f97316',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        // Cache-Strategie: Netzwerk zuerst, dann Cache-Fallback
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.+/,
            handler: 'NetworkFirst',
            options: { cacheName: 'external-images', expiration: { maxEntries: 50 } },
          },
        ],
      },
    }),
  ],
})
