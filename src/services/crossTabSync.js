/**
 * src/services/crossTabSync.js
 * İstanbul Esenyurt Üniversitesi (İESÜ) Gerçek Zamanlı Sekmeler Arası Ağ Motoru
 * (BroadcastChannel + LocalStorage Event Fallback Multi-Window Realtime Mesh)
 */

import eventBus from '../brain/eventBus';
import { useAdminStore } from '../brain/useAdminStore';
import { useSharedStore } from '../brain/useSharedStore';
import useAppStore from '../store/useAppStore';

const CHANNEL_NAME = 'iesu_realtime_mesh';

class CrossTabSyncEngine {
  constructor() {
    this.channel = null;
    this.isInitialized = false;
    this.clientId = 'CLIENT_' + Math.random().toString(36).substring(2, 9);
  }

  init() {
    if (this.isInitialized || typeof window === 'undefined') return;
    this.isInitialized = true;

    // 1. BroadcastChannel Entegrasyonu (Modern Çapraz Sekme / Çoklu Pencere)
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        this.channel = new BroadcastChannel(CHANNEL_NAME);
        this.channel.onmessage = (event) => this.handleIncomingBroadcast(event.data);
      } catch (err) {
        console.warn('[CrossTabSync] BroadcastChannel initialization failed, falling back to storage listener:', err);
      }
    }

    // 2. Storage Event Yedekleme Hattı (BroadcastChannel bulunmayan veya kısıtlı tarayıcılar için)
    window.addEventListener('storage', (event) => {
      if (event.key === 'iesu_cross_tab_envelope' && event.newValue) {
        try {
          const envelope = JSON.parse(event.newValue);
          if (envelope && envelope.originClient !== this.clientId) {
            this.handleIncomingBroadcast(envelope.data);
          }
        } catch (_) {}
      }
    });

    // 3. Yerel EventBus Olaylarını Dinle ve Diğer Sekmelere Yay
    this.setupLocalEventHooks();
  }

  setupLocalEventHooks() {
    // Mesaj Gönderildiğinde
    eventBus.on('chat:message_sent', (payload) => {
      this.broadcast('chat:message_sent', payload);
    });

    // Gönderi Yayınlandığında
    eventBus.on('post:created', (payload) => {
      this.broadcast('post:created', payload);
    });

    // Gönderi Güncellendiğinde (Beğeni, Yorum, Etkinlik Katılımı)
    eventBus.on('post:updated', (payload) => {
      this.broadcast('post:updated', payload);
    });

    // Etkinlik İlan Edildiğinde
    eventBus.on('event:announced', (payload) => {
      this.broadcast('event:announced', payload);
    });

    // Bildirim Üretildiğinde
    eventBus.on('notification:dispatched', (payload) => {
      this.broadcast('notification:dispatched', payload);
    });

    // Kulüp Talep Formu Gönderildiğinde
    eventBus.on('club:request_submitted', (payload) => {
      this.broadcast('club:request_submitted', payload);
    });

    // SKS / Admin Kulüp Kararı Verildiğinde
    eventBus.on('club:request_decision', (payload) => {
      this.broadcast('club:request_decision', payload);
    });

    // İş / Staj Başvuru ve ATS Durum Değişikliğinde
    eventBus.on('application:status', (payload) => {
      this.broadcast('application:status', payload);
    });

    // Mentörlük Randevu Talebi ve Durumunda
    eventBus.on('mentorship:requested', (payload) => {
      this.broadcast('mentorship:requested', payload);
    });

    eventBus.on('mentorship:status', (payload) => {
      this.broadcast('mentorship:status', payload);
    });
  }

  /**
   * Çapraz Sekmeye Veri Yayınla (Multi-Window Broadcast)
   */
  broadcast(type, payload) {
    const message = {
      type,
      payload,
      originClient: this.clientId,
      timestamp: Date.now()
    };

    // BroadcastChannel ile anlık ilet
    if (this.channel) {
      try {
        this.channel.postMessage(message);
      } catch (_) {}
    }

    // Storage Event ile yedekle
    try {
      localStorage.setItem('iesu_cross_tab_envelope', JSON.stringify({
        data: message,
        originClient: this.clientId,
        ts: Date.now()
      }));
    } catch (_) {}
  }

  /**
   * Diğer Sekmelerden Gelen Canlı Olayları Karşıla & Durumu Senkronize Et
   */
  handleIncomingBroadcast(data) {
    if (!data || data.originClient === this.clientId) return;

    const { type, payload } = data;

    switch (type) {
      case 'chat:message_sent': {
        const msg = payload?.message;
        if (!msg) break;

        // 1. Admin / İletişim Store Havuzuna Ekle
        try {
          const adminStore = useAdminStore.getState();
          const existing = adminStore.messages || [];
          if (!existing.some(m => m.id === msg.id)) {
            adminStore.setMessages([...existing, msg]);
          }
        } catch (_) {}

        // 2. Açık Olan MessagingInterface Bileşenine Canlı Olay Fırlat
        try {
          eventBus.emit('chat:message_received', { message: msg });
        } catch (_) {}
        break;
      }

      case 'post:created': {
        const post = payload?.post;
        if (!post) break;

        try {
          const sharedStore = useSharedStore.getState();
          const currentPosts = sharedStore.posts || [];
          if (!currentPosts.some(p => p.id === post.id)) {
            sharedStore.setPosts([post, ...currentPosts]);
          }
        } catch (_) {}

        try {
          eventBus.emit('post:received', { post });
        } catch (_) {}
        break;
      }

      case 'post:updated': {
        const post = payload?.post;
        if (!post) break;

        try {
          const sharedStore = useSharedStore.getState();
          const currentPosts = sharedStore.posts || [];
          sharedStore.setPosts(currentPosts.map(p => p.id === post.id ? { ...p, ...post } : p));
        } catch (_) {}

        try {
          eventBus.emit('post:updated_received', { post });
        } catch (_) {}
        break;
      }

      case 'event:announced': {
        const eventData = payload?.event;
        if (!eventData) break;

        try {
          const sharedStore = useSharedStore.getState();
          const currentEvents = sharedStore.events || [];
          if (!currentEvents.some(e => e.id === eventData.id)) {
            sharedStore.setEvents([eventData, ...currentEvents]);
          }
        } catch (_) {}

        try {
          eventBus.emit('event:received', { event: eventData });
        } catch (_) {}
        break;
      }

      case 'club:request_submitted': {
        const req = payload?.request;
        if (!req) break;

        try {
          const adminStore = useAdminStore.getState();
          const current = adminStore.clubApplications || [];
          if (!current.some(a => a.id === req.id)) {
            adminStore.setClubApplications([req, ...current]);
          }
        } catch (_) {}
        break;
      }

      case 'club:request_decision': {
        const { request, status, decision } = payload || {};
        if (!request?.id) break;

        try {
          const adminStore = useAdminStore.getState();
          const currentApps = adminStore.clubApplications || [];
          const nextStatus = status || decision || 'approved';
          adminStore.setClubApplications(currentApps.map(a => a.id === request.id ? { ...a, status: nextStatus } : a));

          const currentClubs = adminStore.clubs || [];
          adminStore.setClubs(currentClubs.map(c => {
            if (c.id === request.clubId || c.name === request.club) {
              return {
                ...c,
                budgetRequests: (c.budgetRequests || []).map(r => r.id === request.id ? { ...r, status: nextStatus } : r)
              };
            }
            return c;
          }));
        } catch (_) {}
        break;
      }

      case 'application:status': {
        const { type, application, applicationId, status, notes, company, applicantName } = payload || {};
        
        // 1. Yeni başvuru yapıldığında
        if (type === 'applied' && application) {
          try {
            const appStore = useAppStore.getState();
            const currentApps = appStore.applications || [];
            if (!currentApps.some(a => a.id === application.id)) {
              appStore.setApplications([...currentApps, application]);
            }
          } catch (_) {}
        } 
        // 2. Durum güncellemesi (Kanban hareketi veya karar)
        else if (applicationId && status) {
          try {
            const appStore = useAppStore.getState();
            const currentApps = appStore.applications || [];
            appStore.setApplications(currentApps.map(a => {
              if (a.id === applicationId || (applicantName && a.applicantName === applicantName)) {
                return { ...a, status, notes: notes || `Aşama "${status}" olarak güncellendi (${company || 'İESÜ'}).` };
              }
              return a;
            }));
          } catch (_) {}
        }

        // Yerel bileşenlerin (ApplicationsPanel, CompanyATSBoard vb.) anında tetiklenmesi için
        try {
          eventBus.emit('application:status', payload);
        } catch (_) {}
        break;
      }

      case 'mentorship:requested': {
        const req = payload?.request || payload;
        if (!req) break;

        try {
          const adminStore = useAdminStore.getState();
          const current = adminStore.mentorships || [];
          if (!current.some(r => r.id === req.id)) {
            adminStore.setMentorships([req, ...current]);
          }
          if (adminStore.addCoffeeChat && (req.type === 'coffee' || req.isCoffeeChat)) {
            adminStore.addCoffeeChat(req);
          }
        } catch (_) {}

        try {
          eventBus.emit('mentorship:received', payload);
        } catch (_) {}
        break;
      }

      case 'mentorship:status': {
        const { requestId, status } = payload || {};
        if (requestId && status) {
          try {
            const adminStore = useAdminStore.getState();
            const current = adminStore.mentorships || [];
            adminStore.setMentorships(current.map(r => r.id === requestId ? { ...r, status } : r));
            if (adminStore.updateCoffeeChatStatus) {
              adminStore.updateCoffeeChatStatus(requestId, status);
            }
          } catch (_) {}
        }
        try {
          eventBus.emit('mentorship:status_received', payload);
        } catch (_) {}
        break;
      }

      default:
        break;
    }
  }

  destroy() {
    if (this.channel) {
      try { this.channel.close(); } catch (_) {}
      this.channel = null;
    }
    this.isInitialized = false;
  }
}

export const crossTabSync = new CrossTabSyncEngine();

// Tarayıcı ortamında tekil motoru başlat
if (typeof window !== 'undefined') {
  crossTabSync.init();
}

export default crossTabSync;
