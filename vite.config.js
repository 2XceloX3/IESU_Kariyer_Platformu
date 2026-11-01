import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import {
  MOCK_IESU_KARIYER_DATA,
  parseIesuRssXml,
  parseIesuHtmlPayload,
  deduplicateFeedItems,
  OFFICIAL_IESU_INSTAGRAM_POSTS,
  deduplicateSocialMediaPosts,
  fetchInstagramGraphMedia
} from './src/services/scraper.js';

function iesuRssScraperPlugin() {
  let cachedPayload = null;
  let lastFetchTime = 0;
  let backgroundInterval = null;
  const REFRESH_INTERVAL_MS = 15 * 60 * 1000; // 15 minutes

  const performUpstreamScrape = async () => {
    const targets = [
      { url: 'https://www.esenyurt.edu.tr/haberler', kind: 'news' },
      { url: 'https://www.esenyurt.edu.tr/etkinlikler', kind: 'events' },
      { url: 'https://www.esenyurt.edu.tr/duyurular', kind: 'announcements' },
      { url: 'https://www.esenyurt.edu.tr/rss', kind: 'rss' }
    ];

    const liveNews = [];
    const liveEvents = [];
    const liveAnnouncements = [];
    let reachedUpstream = false;

    const [igSettled] = await Promise.allSettled([
      fetchInstagramGraphMedia({
        accessToken: process.env.INSTAGRAM_ACCESS_TOKEN || process.env.VITE_INSTAGRAM_ACCESS_TOKEN || '',
        userId: process.env.INSTAGRAM_USER_ID || process.env.VITE_INSTAGRAM_USER_ID || 'me',
        apiVersion: process.env.INSTAGRAM_GRAPH_API_VERSION || 'v21.0',
        limit: 16,
        timeoutMs: 4500
      }),
      ...targets.map(async (target) => {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 5000);
        try {
          const response = await fetch(target.url, {
            signal: controller.signal,
            headers: {
              'User-Agent': 'Mozilla/5.0 (compatible; IESU-Kariyer-RSS-Scraper/2.0; +https://www.esenyurt.edu.tr)',
              'Accept': 'application/rss+xml, application/xml, text/xml, text/html, */*'
            }
          });
          if (!response.ok) return;
          const body = await response.text();
          if (!body || body.length < 80) return;
          reachedUpstream = true;

          if (/<(?:rss|feed)\b/i.test(body)) {
            const parsedRss = parseIesuRssXml(body);
            liveNews.push(...parsedRss.news);
            liveEvents.push(...parsedRss.events);
            liveAnnouncements.push(...parsedRss.announcements);
          } else {
            const parsedHtml = parseIesuHtmlPayload(body);
            if (target.kind === 'news' && Array.isArray(parsedHtml.news)) {
              liveNews.push(...parsedHtml.news);
            } else if (target.kind === 'events' && Array.isArray(parsedHtml.events)) {
              liveEvents.push(...parsedHtml.events);
            } else if (target.kind === 'announcements' && Array.isArray(parsedHtml.announcements)) {
              liveAnnouncements.push(...parsedHtml.announcements);
            }
          }
        } catch (_) {
          // graceful fallback per target
        } finally {
          clearTimeout(timer);
        }
      })
    ]);

    const igPosts = igSettled.status === 'fulfilled' && Array.isArray(igSettled.value?.posts)
      ? igSettled.value.posts
      : OFFICIAL_IESU_INSTAGRAM_POSTS;

    const cleanNews = liveNews.length > 0
      ? deduplicateFeedItems([], liveNews, 20)
      : deduplicateFeedItems([], MOCK_IESU_KARIYER_DATA.news, 20);
    const cleanEvents = liveEvents.length > 0
      ? deduplicateFeedItems([], liveEvents, 20)
      : deduplicateFeedItems([], MOCK_IESU_KARIYER_DATA.events, 20);
    const cleanAnnouncements = liveAnnouncements.length > 0
      ? deduplicateFeedItems([], liveAnnouncements, 20)
      : deduplicateFeedItems([], MOCK_IESU_KARIYER_DATA.announcements, 20);
    const cleanSocialMedia = deduplicateSocialMediaPosts([], igPosts, 20);

    cachedPayload = {
      ok: true,
      source: 'live',
      upstreamReached: reachedUpstream,
      instagramSource: igSettled.status === 'fulfilled' ? igSettled.value?.source : 'official-fallback',
      feedFormat: 'rss+html-scraper+instagram-graph',
      fetchedAt: new Date().toISOString(),
      officeInfo: MOCK_IESU_KARIYER_DATA.officeInfo,
      news: cleanNews,
      events: cleanEvents,
      announcements: cleanAnnouncements,
      socialMedia: cleanSocialMedia
    };
    lastFetchTime = Date.now();
    return cachedPayload;
  };

  const startBackgroundWorker = () => {
    if (backgroundInterval) return;
    const bootTimer = setTimeout(() => {
      performUpstreamScrape().catch(() => {});
    }, 1500);
    if (typeof bootTimer.unref === 'function') {
      bootTimer.unref();
    }
    backgroundInterval = setInterval(() => {
      performUpstreamScrape().catch(() => {});
    }, REFRESH_INTERVAL_MS);
    if (typeof backgroundInterval.unref === 'function') {
      backgroundInterval.unref();
    }
  };

  const handleScrapeRequest = async (req, res) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');

    const force = req.url && req.url.includes('force=1');
    if (!cachedPayload || force || Date.now() - lastFetchTime > REFRESH_INTERVAL_MS) {
      await performUpstreamScrape();
    }

    res.statusCode = 200;
    res.end(JSON.stringify(cachedPayload));
  };

  const handleInstagramFeedRequest = async (req, res) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');

    const force = req.url && req.url.includes('force=1');
    if (!cachedPayload || force || Date.now() - lastFetchTime > REFRESH_INTERVAL_MS) {
      await performUpstreamScrape();
    }

    res.statusCode = 200;
    res.end(
      JSON.stringify({
        ok: true,
        source: cachedPayload?.instagramSource || 'instagram-graph-api',
        fetchedAt: cachedPayload?.fetchedAt || new Date().toISOString(),
        socialMedia: cachedPayload?.socialMedia || OFFICIAL_IESU_INSTAGRAM_POSTS
      })
    );
  };

  return {
    name: 'iesu-rss-scraper-middleware',
    configureServer(server) {
      startBackgroundWorker();
      server.middlewares.use('/api/iesu-rss-scraper', (req, res) => {
        handleScrapeRequest(req, res);
      });
      server.middlewares.use('/api/iesu-instagram-feed', (req, res) => {
        handleInstagramFeedRequest(req, res);
      });
    },
    configurePreviewServer(server) {
      startBackgroundWorker();
      server.middlewares.use('/api/iesu-rss-scraper', (req, res) => {
        handleScrapeRequest(req, res);
      });
      server.middlewares.use('/api/iesu-instagram-feed', (req, res) => {
        handleInstagramFeedRequest(req, res);
      });
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
    host: true,
    hmr: {
      overlay: false
    },
    proxy: {
      '/api/esenyurt-live': {
        target: 'https://www.esenyurt.edu.tr',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/esenyurt-live/, '')
      }
    }
  },
  esbuild: {
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
  },
  optimizeDeps: {
    entries: ['index.html']
  },
  plugins: [
    iesuRssScraperPlugin(),
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png', 'favicon.svg', 'iesu-logo.svg', 'official_pdf_logo.png'],
      workbox: {
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB limit for unminified & production bundles
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
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/patches/**',
      '**/.agents/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',
      '**/*.node.test.js',
    ],
  },
});
