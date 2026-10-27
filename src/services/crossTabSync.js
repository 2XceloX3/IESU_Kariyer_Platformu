/**
 * src/services/crossTabSync.js
 * İstanbul Esenyurt Üniversitesi (İESÜ) Gerçek Zamanlı Sekmeler Arası Ağ Motoru
 * (BroadcastChannel + LocalStorage Event Fallback Multi-Window Realtime Mesh)
 */

import eventBus from '../brain/eventBus';
import { useAdminStore } from '../brain/useAdminStore';
import { useSharedStore } from '../brain/useSharedStore';

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

    // Etkinlik İlan Edildiğinde
    eventBus.on('event:announced', (payload) => {
      this.broadcast('event:announced', payload);
    });

    // Bildirim Üretildiğinde
    eventBus.on('notification:dispatched', (payload) => {
      this.broadcast('notification:dispatched', payload);
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
