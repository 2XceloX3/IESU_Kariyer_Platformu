/**
 * src/brain/useSharedStore.js
 * Shared Brain Store: Read-shared platform data for all Hive portals.
 * Part of Requirement R1 (Beehive Architecture).
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import eventBus from './eventBus';
import {
  initialPosts,
  initialJobs,
  initialSemCourses,
  initialFeatured,
  initialCareerOpportunities,
  initialGeneralEvents,
  initialInternships,
  initialVoluntaryInternships
} from '../utils/mockData';
import { liveEventData, liveAnnouncementData, liveNewsData } from '../utils/liveData';
import { innerPagesData } from '../utils/innerPagesData';
import { OFFICIAL_IESU_INSTAGRAM_POSTS } from '../services/instagramService';
import { deduplicateFeedItems, normalizeTitleForDedup } from '../services/scraper';

const initialStories = [
  {
    id: 1,
    author: {
      name: 'Kariyer Geliştirme Koordinatörlüğü',
      avatar: '/logo.png',
      role: 'admin'
    },
    content: 'İESÜ Kariyer Günleri başlıyor! 🎉',
    image: 'https://panel.esenyurt.edu.tr/assets/2025/resimler/hitdb/cd8eee1b7fa146fd8e952b0c7d012305_fcf735c1ca7f470c8fe6bd98923cf369.jpg',
    viewedBy: [],
    createdAt: new Date().toISOString()
  }
];

function isSameItemTitle(a, b) {
  const ka = normalizeTitleForDedup(a?.title || a?.content || '');
  const kb = normalizeTitleForDedup(b?.title || b?.content || '');
  return Boolean(ka && kb && ka.length >= 6 && ka === kb);
}

/**
 * Returns fresh clone of initial shared state to prevent cross-test and cross-session contamination.
 */
export const getInitialSharedState = () => ({
  posts: Array.isArray(initialPosts) ? [...initialPosts] : [],
  stories: [...initialStories],
  jobs: Array.isArray(initialJobs) ? [...initialJobs] : [],
  swipedJobs: [],
  internships: Array.isArray(initialInternships) ? [...initialInternships] : [],
  voluntaryInternships: Array.isArray(initialVoluntaryInternships) ? [...initialVoluntaryInternships] : [],
  events: Array.isArray(liveEventData) ? deduplicateFeedItems([], liveEventData, 25) : [],
  news: Array.isArray(liveNewsData) ? deduplicateFeedItems([], liveNewsData, 25) : [],
  announcements: Array.isArray(liveAnnouncementData) ? deduplicateFeedItems([], liveAnnouncementData, 25) : [],
  socialMedia: Array.isArray(OFFICIAL_IESU_INSTAGRAM_POSTS) ? [...OFFICIAL_IESU_INSTAGRAM_POSTS] : [],
  generalEvents: Array.isArray(initialGeneralEvents) ? [...initialGeneralEvents] : [],
  careerOpportunities: Array.isArray(initialCareerOpportunities) ? [...initialCareerOpportunities] : [],
  featuredOpportunities: Array.isArray(initialFeatured) ? [...initialFeatured] : [],
  semCourses: Array.isArray(initialSemCourses) ? [...initialSemCourses] : [],
  innerPagesData: typeof innerPagesData === 'object' && innerPagesData !== null ? { ...innerPagesData } : innerPagesData,
  lastUpdated: new Date().toISOString(),
  source: 'live',
  status: 'aktif',
  isScraperLoading: false
});

export const useSharedStore = create(
  persist(
    (set) => {
      const setter = (key) => (val) =>
        set((state) => ({ [key]: typeof val === 'function' ? val(state[key]) : val }));

      const dedupFeedSetter = (key) => (val) =>
        set((state) => {
          const nextArr = typeof val === 'function' ? val(state[key]) : val;
          const fallbackPool =
            key === 'events' ? liveEventData : key === 'news' ? liveNewsData : key === 'announcements' ? liveAnnouncementData : [];
          return {
            [key]: Array.isArray(nextArr)
              ? deduplicateFeedItems(fallbackPool, nextArr, 25)
              : deduplicateFeedItems([], fallbackPool, 25)
          };
        });

      return {
        // Read-shared collections
        ...getInitialSharedState(),

        setPosts: setter('posts'),
        addPost: (post) =>
          set((s) => ({
            posts: [
              post,
              ...(s.posts || []).filter((p) => p?.id !== post?.id && !isSameItemTitle(p, post))
            ]
          })),

        setStories: setter('stories'),

        setJobs: setter('jobs'),
        addJob: (job) => set((s) => ({ jobs: [job, ...(s.jobs || []).filter(j => j?.id !== job?.id)] })),

        setSwipedJobs: setter('swipedJobs'),

        setInternships: setter('internships'),
        addInternship: (item) => set((s) => ({ internships: [item, ...(s.internships || []).filter(i => i?.id !== item?.id)] })),
        updateInternship: (item) => set((s) => ({ internships: (s.internships || []).map(i => i?.id === item?.id ? item : i) })),

        setVoluntaryInternships: setter('voluntaryInternships'),

        setEvents: dedupFeedSetter('events'),
        addEvent: (evt) =>
          set((s) => ({
            events: deduplicateFeedItems(
              (s.events || []).filter((e) => e?.id !== evt?.id && !isSameItemTitle(e, evt)),
              [evt],
              25
            )
          })),

        setNews: dedupFeedSetter('news'),

        setAnnouncements: dedupFeedSetter('announcements'),
        addAnnouncement: (ann) =>
          set((s) => ({
            announcements: deduplicateFeedItems(
              (s.announcements || []).filter((a) => a?.id !== ann?.id && !isSameItemTitle(a, ann)),
              [ann],
              25
            )
          })),

        setSocialMedia: setter('socialMedia'),
        addSocialMediaPost: (post) => set((s) => ({ socialMedia: [post, ...(s.socialMedia || []).filter(p => p?.id !== post?.id)] })),

        setGeneralEvents: setter('generalEvents'),

        setCareerOpportunities: setter('careerOpportunities'),

        setFeaturedOpportunities: setter('featuredOpportunities'),

        setSemCourses: setter('semCourses'),

        setInnerPagesData: setter('innerPagesData'),

        // Scraper & Firestore Synchronization Pipeline
        setLastUpdated: setter('lastUpdated'),
        setSource: setter('source'),
        setStatus: setter('status'),
        setIsScraperLoading: setter('isScraperLoading'),

        hydrateFromFirestore: async () => {
          try {
            const [{ loadScrapedFeedFromFirestore }, { deduplicateSocialMediaPosts }] = await Promise.all([
              import('../services/dbSync'),
              import('../services/scraper')
            ]);
            const res = await loadScrapedFeedFromFirestore();
            if (res && res.success && res.data) {
              set((state) => ({
                news: res.data.news?.length > 0
                  ? deduplicateFeedItems([], res.data.news, 20)
                  : deduplicateFeedItems([], state.news, 20),
                events: res.data.events?.length > 0
                  ? deduplicateFeedItems([], res.data.events, 20)
                  : deduplicateFeedItems([], state.events, 20),
                announcements: res.data.announcements?.length > 0
                  ? deduplicateFeedItems([], res.data.announcements, 20)
                  : deduplicateFeedItems([], state.announcements, 20),
                socialMedia: res.data.socialMedia?.length > 0
                  ? deduplicateSocialMediaPosts([], res.data.socialMedia, 20)
                  : deduplicateSocialMediaPosts([], state.socialMedia, 20),
                lastUpdated: res.data.lastUpdated || state.lastUpdated,
                source: res.data.source || 'firestore',
                status: res.data.status || 'aktif'
              }));
              return res.data;
            }
          } catch (err) {
            console.warn('[SharedStore] Firestore hydration warning:', err?.message);
          }
          return null;
        },

        refreshScrapedData: async (forceRefresh = false) => {
          set({ isScraperLoading: true });
          let lastErr = null;
          for (let attempt = 0; attempt < 2; attempt++) {
            try {
              const { scrapeLiveOrFallback, deduplicateSocialMediaPosts } = await import('../services/scraper');
              const data = await scrapeLiveOrFallback({ forceRefresh, persistToFirestore: true });
              set(() => ({
                ...(data.announcements && Array.isArray(data.announcements) && data.announcements.length > 0
                  ? { announcements: deduplicateFeedItems([], data.announcements, 20) }
                  : {}),
                ...(data.events && Array.isArray(data.events) && data.events.length > 0
                  ? { events: deduplicateFeedItems([], data.events, 20) }
                  : {}),
                ...(data.news && Array.isArray(data.news) && data.news.length > 0
                  ? { news: deduplicateFeedItems([], data.news, 20) }
                  : {}),
                ...(data.socialMedia && Array.isArray(data.socialMedia) && data.socialMedia.length > 0
                  ? { socialMedia: deduplicateSocialMediaPosts([], data.socialMedia, 20) }
                  : {}),
                lastUpdated: data.lastUpdated || new Date().toISOString(),
                source: data.source || 'live',
                status: data.status || 'aktif',
                isScraperLoading: false
              }));
              return data;
            } catch (err) {
              lastErr = err;
              if (attempt === 0) {
                await new Promise((r) => setTimeout(r, 600));
              }
            }
          }
          console.error('[SharedStore] Failed to refresh scraped data after retries:', lastErr);
          set({ isScraperLoading: false, status: 'error' });
          throw lastErr;
        },

        /**
         * Reset store to initial state (for tests and session logout).
         */
        reset: () => set(getInitialSharedState())
      };
    },
    {
      name: 'iesu-career-shared-store-v2',
      partialize: (state) => ({
        posts: Array.isArray(state.posts) ? state.posts.slice(0, 100).map(p => {
          if (!p || typeof p !== 'object') return p;
          let safeImg = p.image;
          if (typeof safeImg === 'string' && safeImg.startsWith('data:image/') && safeImg.length > 50000) {
            safeImg = ''; // Bozuk veri üretmemek için büyük base64 dizgisini sıfırla (IndexedDB / CDN ile yönetilir)
          }
          let safeSlides = p.slides;
          if (Array.isArray(safeSlides)) {
            safeSlides = safeSlides.map(s => {
              if (s && typeof s.previewUrl === 'string' && s.previewUrl.startsWith('data:image/') && s.previewUrl.length > 50000) {
                return { ...s, previewUrl: '' };
              }
              return s;
            });
          }
          return { ...p, image: safeImg, slides: safeSlides };
        }) : [],
        stories: Array.isArray(state.stories) ? state.stories.slice(0, 30) : [],
        jobs: Array.isArray(state.jobs) ? state.jobs.slice(0, 50) : [],
        swipedJobs: Array.isArray(state.swipedJobs) ? state.swipedJobs.slice(-100) : [],
        internships: Array.isArray(state.internships) ? state.internships.slice(0, 50) : [],
        voluntaryInternships: Array.isArray(state.voluntaryInternships) ? state.voluntaryInternships.slice(0, 50) : [],
        events: Array.isArray(state.events) ? state.events.slice(0, 25) : [],
        news: Array.isArray(state.news) ? state.news.slice(0, 25) : [],
        announcements: Array.isArray(state.announcements) ? state.announcements.slice(0, 25) : [],
        socialMedia: Array.isArray(state.socialMedia) ? state.socialMedia.slice(0, 24) : [],
        generalEvents: Array.isArray(state.generalEvents) ? state.generalEvents.slice(0, 50) : [],
        careerOpportunities: Array.isArray(state.careerOpportunities) ? state.careerOpportunities.slice(0, 50) : [],
        featuredOpportunities: Array.isArray(state.featuredOpportunities) ? state.featuredOpportunities.slice(0, 50) : [],
        semCourses: Array.isArray(state.semCourses) ? state.semCourses.slice(0, 50) : [],
        lastUpdated: state.lastUpdated,
        source: state.source,
        status: state.status
      }),
      merge: (persistedState, currentState) => {
        const p = persistedState && typeof persistedState === 'object' ? persistedState : {};
        const mergeByIdWithDefaults = (defaults = [], persisted = []) => {
          const defMap = new Map((defaults || []).filter(Boolean).map(item => [String(item.id), item]));
          const result = [];
          const seen = new Set();
          if (Array.isArray(persisted)) {
            for (const item of persisted) {
              if (!item || typeof item !== 'object') continue;
              const idStr = String(item.id || '');
              if (idStr && seen.has(idStr)) continue;
              if (idStr) seen.add(idStr);
              const defItem = idStr ? defMap.get(idStr) : null;
              result.push(defItem ? { ...defItem, ...item, isJob: defItem.isJob ?? item.isJob, jobData: item.jobData || defItem.jobData, eventPost: defItem.eventPost ?? item.eventPost, isGeneralEvent: defItem.isGeneralEvent ?? item.isGeneralEvent, authorId: item.authorId || defItem.authorId, author: (typeof defItem.author === 'object' && defItem.author) ? defItem.author : item.author } : item);
            }
          }
          for (const defItem of (defaults || [])) {
            if (!defItem || typeof defItem !== 'object') continue;
            const idStr = String(defItem.id || '');
            if (idStr && !seen.has(idStr)) {
              seen.add(idStr);
              result.push(defItem);
            }
          }
          return result;
        };
        return {
          ...currentState,
          ...p,
          posts: mergeByIdWithDefaults(initialPosts, p.posts),
          jobs: mergeByIdWithDefaults(initialJobs, p.jobs),
          generalEvents: mergeByIdWithDefaults(initialGeneralEvents, p.generalEvents),
          careerOpportunities: mergeByIdWithDefaults(initialCareerOpportunities, p.careerOpportunities),
          events: deduplicateFeedItems(liveEventData, Array.isArray(p.events) ? p.events : [], 25),
          news: deduplicateFeedItems(liveNewsData, Array.isArray(p.news) ? p.news : [], 25),
          announcements: deduplicateFeedItems(liveAnnouncementData, Array.isArray(p.announcements) ? p.announcements : [], 25)
        };
      }
    }
  )
);

// Managed listener unbinders tracking
let sharedStoreUnsubscribers = [];

/**
 * Explicit subscriber initialization/re-attachment mechanism for useSharedStore.
 * Safely unbinds any previous listeners to prevent memory leaks or duplicate handlers.
 * Can be called automatically on module import and explicitly whenever needed (e.g. in beforeEach).
 * @returns {Function} Clean unsubscribe function for all 4 listeners.
 */
export function initSharedStoreSubscriptions() {
  if (sharedStoreUnsubscribers.length > 0) {
    sharedStoreUnsubscribers.forEach((unsub) => {
      try {
        if (typeof unsub === 'function') unsub();
      } catch { /* intentional */ }
    });
    sharedStoreUnsubscribers = [];
  }

  const unsubPost = eventBus.on('post:created', (payload) => {
    if (payload && (payload.post || payload.content)) {
      const post = payload.post || payload;
      useSharedStore.getState().addPost(post);
    }
  });

  const unsubJob = eventBus.on('job:published', (payload) => {
    if (payload && (payload.job || payload.title)) {
      const job = payload.job || payload;
      useSharedStore.getState().addJob(job);
    }
  });

  const unsubEvent = eventBus.on('event:announced', (payload) => {
    if (payload && (payload.event || payload.title)) {
      const evt = payload.event || payload;
      useSharedStore.getState().addEvent(evt);
    }
  });

  const unsubAnnouncement = eventBus.on('announcement:broadcast', (payload) => {
    if (payload && (payload.announcement || payload.title)) {
      const ann = payload.announcement || payload;
      useSharedStore.getState().addAnnouncement(ann);
    }
  });

  sharedStoreUnsubscribers = [unsubPost, unsubJob, unsubEvent, unsubAnnouncement];

  return () => {
    sharedStoreUnsubscribers.forEach((unsub) => {
      try {
        if (typeof unsub === 'function') unsub();
      } catch { /* intentional */ }
    });
    sharedStoreUnsubscribers = [];
  };
}

// Wire EventBus listeners to update shared state reactively on module load
initSharedStoreSubscriptions();

export default useSharedStore;
