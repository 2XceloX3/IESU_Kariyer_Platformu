import { describe, it, expect, vi, beforeEach } from 'vitest';
import crossTabSync from '../services/crossTabSync';
import eventBus from '../brain/eventBus';
import { useAdminStore } from '../brain/useAdminStore';
import { useSharedStore } from '../brain/useSharedStore';

describe('Cross-Tab Realtime Synchronization Mesh Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('broadcasts chat messages and ingests them into state across mock multi-tab instances', () => {
    const mockMsg = {
      id: 'MSG-CROSS-1',
      senderId: 'USR-TAB-1',
      senderName: 'Deniz',
      receiverId: 'USR-TAB-2',
      content: 'Canlı senkronizasyon mesajı',
      timestamp: new Date().toISOString()
    };

    // Simulate incoming broadcast from another tab
    crossTabSync.handleIncomingBroadcast({
      type: 'chat:message_sent',
      payload: { message: mockMsg },
      originClient: 'ANOTHER_TAB_CLIENT'
    });

    const messages = useAdminStore.getState().messages || [];
    expect(messages.some(m => m.id === 'MSG-CROSS-1')).toBe(true);
  });

  it('broadcasts published posts and synchronizes feed store across tabs', () => {
    const mockPost = {
      id: 'POST-CROSS-1',
      author: { name: 'Ahmet Yılmaz', role: 'student' },
      content: 'Sekmeler arası anlık gönderi akışı',
      createdAt: new Date().toISOString()
    };

    crossTabSync.handleIncomingBroadcast({
      type: 'post:created',
      payload: { post: mockPost },
      originClient: 'ANOTHER_TAB_CLIENT'
    });

    const posts = useSharedStore.getState().posts || [];
    expect(posts.some(p => p.id === 'POST-CROSS-1')).toBe(true);
  });

  it('ignores broadcast packets originated from its own client instance (echo prevention)', () => {
    const selfMsg = { id: 'MSG-ECHO-1', content: 'Kendi mesajım' };

    const initialLen = (useAdminStore.getState().messages || []).length;

    crossTabSync.handleIncomingBroadcast({
      type: 'chat:message_sent',
      payload: { message: selfMsg },
      originClient: crossTabSync.clientId // same client
    });

    const afterLen = (useAdminStore.getState().messages || []).length;
    expect(afterLen).toBe(initialLen);
  });
});
