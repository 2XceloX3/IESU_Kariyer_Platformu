import { afterEach, describe, expect, it, vi } from 'vitest';

const unavailableMessage = 'Yapay Zeka servisine şu anda ulaşılamıyor. Lütfen daha sonra tekrar deneyin.';

afterEach(() => {
  vi.resetModules();
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('AI gateway client', () => {
  it('sends AI requests through the configured server-side gateway', async () => {
    vi.stubEnv('VITE_AI_GATEWAY_URL', 'https://gateway.example.test/ai/generate');
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ text: 'Güvenli yanıt' }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const { generateAIResponse } = await import('../lib/gemini');
    const response = await generateAIResponse('CV için öneri ver', 'Kısa ve Türkçe yanıt ver.');

    expect(response).toBe('Güvenli yanıt');
    expect(fetchMock).toHaveBeenCalledWith(
      'https://gateway.example.test/ai/generate',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: 'CV için öneri ver',
          systemInstruction: 'Kısa ve Türkçe yanıt ver.',
        }),
      })
    );
  });

  it('fails closed when the configured gateway returns no usable response', async () => {
    vi.stubEnv('VITE_AI_GATEWAY_URL', 'https://gateway.example.test/ai/generate');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({}),
    }));
    vi.spyOn(console, 'error').mockImplementation(() => {});

    const { generateAIResponse } = await import('../lib/gemini');

    await expect(generateAIResponse('Merhaba')).resolves.toBe(unavailableMessage);
  });

  it('delivers rich autonomous career guidance when no gateway is configured (demo/offline resilience)', async () => {
    vi.stubEnv('VITE_AI_GATEWAY_URL', '');
    vi.stubEnv('VITE_GEMINI_API_KEY', '');

    const { generateAIResponse } = await import('../lib/gemini');

    const mülakatResponse = await generateAIResponse('Yazılım mühendisliği mülakatına nasıl hazırlanmalıyım?');
    expect(mülakatResponse).toContain('İESÜ Kariyer & Mülakat Değerlendirme Raporu');
    expect(mülakatResponse).toContain('STAR Metodu');

    const cvResponse = await generateAIResponse('CV incelemesi yapar mısın?');
    expect(cvResponse).toContain('İESÜ ATS & Özgeçmiş İnceleme Analizi');
  });
});
