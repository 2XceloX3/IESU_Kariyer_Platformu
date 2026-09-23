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
  events: Array.isArray(liveEventData) ? [...liveEventData] : [],
  news: Array.isArray(liveNewsData) ? [...liveNewsData] : [],
  announcements: Array.isArray(liveAnnouncementData) ? [...liveAnnouncementData] : [],
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
    (set, get) => {
      const setter = (key) => (val) =>
        set((state) => ({ [key]: typeof val === 'function' ? val(state[key]) : val }));

      return {
        // Read-shared collections
        ...getInitialSharedState(),

        setPosts: setter('posts'),
        addPost: (post) => set((s) => ({ posts: [post, ...(s.posts || [])] })),

        setStories: setter('stories'),

        setJobs: setter('jobs'),
        addJob: (job) => set((s) => ({ jobs: [job, ...(s.jobs || [])] })),

        setSwipedJobs: setter('swipedJobs'),

        setInternships: setter('internships'),

        setVoluntaryInternships: setter('voluntaryInternships'),

        setEvents: setter('events'),
        addEvent: (evt) => set((s) => ({ events: [evt, ...(s.events || [])] })),

        setNews: setter('news'),

        setAnnouncements: setter('announcements'),
        addAnnouncement: (ann) => set((s) => ({ announcements: [ann, ...(s.announcements || [])] })),

        setGeneralEvents: setter('generalEvents'),

        setCareerOpportunities: setter('careerOpportunities'),

        setFeaturedOpportunities: setter('featuredOpportunities'),

        setSemCourses: setter('semCourses'),

        setInnerPagesData: setter('innerPagesData'),

        // Scraper Synchronization Pipeline
        setLastUpdated: setter('lastUpdated'),
        setSource: setter('source'),
        setStatus: setter('status'),
        setIsScraperLoading: setter('isScraperLoading'),

        refreshScrapedData: async (forceRefresh = false) => {
          set({ isScraperLoading: true });
          let lastErr = null;
          for (let attempt = 0; attempt < 2; attempt++) {
            try {
              const { scrapeLiveOrFallback } = await import('../services/scraper');
              const data = await scrapeLiveOrFallback({ forceRefresh });
              set((state) => ({
                ...(data.announcements && Array.isArray(data.announcements) && data.announcements.length > 0 ? { announcements: data.announcements } : {}),
                ...(data.events && Array.isArray(data.events) && data.events.length > 0 ? { events: data.events } : {}),
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
      name: 'iesu-career-shared-store',
      partialize: (state) => ({
        posts: state.posts,
        stories: state.stories,
        jobs: state.jobs,
        swipedJobs: state.swipedJobs,
        internships: state.internships,
        voluntaryInternships: state.voluntaryInternships,
        events: state.events,
        news: state.news,
        announcements: state.announcements,
        generalEvents: state.generalEvents,
        careerOpportunities: state.careerOpportunities,
        featuredOpportunities: state.featuredOpportunities,
        semCourses: state.semCourses,
        lastUpdated: state.lastUpdated,
        source: state.source,
        status: state.status
      })
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
      } catch (_) {}
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
      } catch (_) {}
    });
    sharedStoreUnsubscribers = [];
  };
}

// Wire EventBus listeners to update shared state reactively on module load
initSharedStoreSubscriptions();

export default useSharedStore;
