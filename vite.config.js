import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 5175,
    host: true,
    hmr: {
      overlay: false
    }
  },
  esbuild: {
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
  },
  optimizeDeps: {
    entries: ['index.html']
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      workbox: {
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
        maximumFileSizeToCacheInBytes: 500 * 1024, // 500KB limit
        globIgnores: [
          '**/admin-cms-core*.js',
          '**/admin-cms-academic*.js',
          '**/admin-cms-panels*.js',
          '**/vendor-documents*.js',
        ],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              },
            }
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30 // <== 30 days
              }
            }
          }
        ]
      },
      manifest: {
        name: 'İESÜ Kariyer Platformu',
        short_name: 'İESÜ Kariyer',
        description: 'İstanbul Esenyurt Üniversitesi Kariyer ve Geliştirme Ofisi Platformu',
        theme_color: '#990000',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  build: {
    minify: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          const normalizedId = id.replaceAll('\\', '/');
          if (normalizedId.includes('/src/components/admin/')) {
            if (
              normalizedId.includes('CMSStudents') ||
              normalizedId.includes('CMSAlumni') ||
              normalizedId.includes('CMSCompanies') ||
              normalizedId.includes('CMSJobs') ||
              normalizedId.includes('CMSApplicationsPool') ||
              normalizedId.includes('CMSCandidatePool')
            ) {
              return 'admin-cms-core';
            }
            if (normalizedId.includes('CMSAcademic') || normalizedId.includes('AkademikPanel')) {
              return 'admin-cms-academic';
            }
            if (
              normalizedId.includes('CMSNews') ||
              normalizedId.includes('CMSAnnouncements') ||
              normalizedId.includes('CMSEvents') ||
              normalizedId.includes('CMSGeneralEvents') ||
              normalizedId.includes('CMSCareerOpportunities') ||
              normalizedId.includes('CMSFeatured')
            ) {
              return 'admin-cms-content';
            }
            if (
              normalizedId.includes('CMSUserTypeManager') ||
              normalizedId.includes('CMSAuditTrail') ||
              normalizedId.includes('PlatformSettings') ||
              normalizedId.includes('InstitutionalStatsManager') ||
              normalizedId.includes('CMSSyncCenter') ||
              normalizedId.includes('DataCleanup') ||
              normalizedId.includes('OfficialContentImport') ||
              normalizedId.includes('CMSIntegrations') ||
              normalizedId.includes('CMSMessageAudit') ||
              normalizedId.includes('CMSFirestoreBackup') ||
              normalizedId.includes('CMSSiteEditor')
            ) {
              return 'admin-cms-system';
            }
            return 'admin-cms-panels';
          }

          if (!normalizedId.includes('/node_modules/')) return;

          const isFrameworkModule = [
            '/node_modules/react/',
            '/node_modules/react-dom/',
            '/node_modules/react-router/',
            '/node_modules/react-router-dom/',
            '/node_modules/scheduler/',
          ].some((segment) => normalizedId.includes(segment));

          if (isFrameworkModule) return 'vendor-react';
          if (normalizedId.includes('/node_modules/lucide-react/')) return 'vendor-lucide';
          if (normalizedId.includes('/node_modules/framer-motion/')) return 'vendor-framer';
          if (normalizedId.includes('/node_modules/firebase/') || normalizedId.includes('/node_modules/@firebase/')) return 'vendor-firebase';
          if (normalizedId.includes('/node_modules/recharts/') || normalizedId.includes('/node_modules/d3-')) return 'vendor-charts';
          if (normalizedId.includes('/node_modules/react-simple-maps/') || normalizedId.includes('/node_modules/topojson-client/')) return 'vendor-maps';
          if (normalizedId.includes('/node_modules/html2pdf.js/') || normalizedId.includes('/node_modules/pdfkit/')) return 'vendor-documents';
          if (normalizedId.includes('/node_modules/react-icons/')) return 'vendor-icons';
          if (normalizedId.includes('/node_modules/react-confetti/') || normalizedId.includes('/node_modules/canvas-confetti/')) return 'vendor-effects';
          if (normalizedId.includes('/node_modules/@supabase/')) return 'vendor-supabase';
        }
      }
    }
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.js',
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',
      '.agents/**',
    ],
  },
});
