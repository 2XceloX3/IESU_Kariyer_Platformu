/**
 * TrendingHashtags — Keşfet paneli için trend hashtag'ler
 * 
 * LinkedIn/Instagram'daki trending topics mantığı.
 * Post'lardan otomatik çıkarım yapar, manuel de eklenebilir.
 */
import React, { useMemo } from 'react';
import { TrendingUp, Hash, Sparkles, ChevronRight } from 'lucide-react';

const DEFAULT_TRENDS = [
  { tag: 'staj', count: 24, category: '💼 Kariyer' },
  { tag: 'mezun', count: 18, category: '🎓 Mezun' },
  { tag: 'cv', count: 15, category: '📄 Kariyer' },
  { tag: 'kariyer', count: 12, category: '💼 Kariyer' },
  { tag: 'yazılım', count: 10, category: '💻 Teknoloji' },
  { tag: 'mülakat', count: 9, category: '🎯 Kariyer' },
  { tag: 'girişim', count: 7, category: '🚀 Girişim' },
  { tag: 'yapayzeka', count: 6, category: '🤖 Teknoloji' },
  { tag: 'burs', count: 5, category: '📚 Eğitim' },
  { tag: 'network', count: 4, category: '🤝 Sosyal' },
];

export default function TrendingHashtags({ posts = [], onTagClick, limit = 8, activeTag = '' }) {
  // Extract hashtags from post content
  const trendingTags = useMemo(() => {
    if (!posts || posts.length === 0) return DEFAULT_TRENDS.slice(0, limit);

    const tagCounts = {};
    const postContent = posts
      .map(p => `${p.content || ''} ${p.title || ''} ${p.description || ''}`)
      .join(' ');

    // Extract #hashtags or common keywords
    const hashtags = postContent.match(/#\w+/g) || [];
    hashtags.forEach(tag => {
      const key = tag.toLowerCase().slice(1);
      if (key.length > 1 && key.length < 30) {
        tagCounts[key] = (tagCounts[key] || 0) + 1;
      }
    });

    // Also extract keywords from job titles, categories
    const keywords = ['staj', 'mezun', 'cv', 'kariyer', 'yazılım', 'mülakat', 
                      'girişim', 'burs', 'network', 'yapayzeka', 'pazarlama', 
                      'muhasebe', 'insan kaynakları', 'yönetim', 'tasarım',
                      'veri', 'ücretsiz', 'sertifika', 'seminer'];
    keywords.forEach(kw => {
      const count = (postContent.toLowerCase().match(new RegExp(kw, 'g')) || []).length;
      if (count > 0) {
        // Weight by occurrences
        const existing = tagCounts[kw] || 0;
        tagCounts[kw] = existing + count;
      }
    });

    const sorted = Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([tag, count]) => ({
        tag,
        count,
        category: getCategory(tag),
      }));

    return sorted.length > 0 ? sorted : DEFAULT_TRENDS.slice(0, limit);
  }, [posts, limit]);

  const handleClick = (tag) => {
    if (onTagClick) {
      if (activeTag === tag || activeTag === `#${tag}`) {
        onTagClick('');
      } else {
        onTagClick(tag);
      }
    } else if (window.toast) {
      window.toast.info(`🔍 #${tag} etiketli içerikler aranıyor...`);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden group">
      {/* Header - Compact */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 bg-slate-50/60">
        <div className="flex items-center gap-2">
          <div className="p-1 bg-red-50 text-[#990000] rounded-md">
            <TrendingUp size={13} />
          </div>
          <h3 className="text-xs font-black text-slate-800 tracking-tight">Trend Konular</h3>
          <span className="text-[10px] text-slate-400 font-semibold hidden sm:inline">• Popüler Etiketler</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Sparkles size={12} className="text-amber-500" />
          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">Gündem</span>
        </div>
      </div>

      {/* Compact Multi-Column Grid Layout */}
      <div className="p-2.5 sm:p-3">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5 sm:gap-2">
          {trendingTags.map((item, i) => {
            const isSelected = Boolean(activeTag && (activeTag === item.tag || activeTag === `#${item.tag}`));
            return (
              <button
                key={item.tag}
                onClick={() => handleClick(item.tag)}
                className={`flex items-center justify-between gap-1.5 px-2.5 py-1.5 rounded-xl transition-all duration-200 text-left group/item cursor-pointer border ${
                  isSelected
                    ? 'bg-[#990000] text-white border-[#990000] shadow-sm ring-2 ring-red-300'
                    : 'bg-slate-50/80 hover:bg-red-50/60 border-slate-200/70 hover:border-red-200 text-slate-700'
                }`}
                title={`#${item.tag} (${item.count} gönderi - ${item.category})`}
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black shrink-0 ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : i === 0
                        ? 'bg-amber-100 text-amber-800'
                        : i === 1
                          ? 'bg-slate-200 text-slate-700'
                          : i === 2
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-slate-100 text-slate-500'
                  }`}>
                    {i + 1}
                  </span>
                  <span className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'group-hover/item:text-[#990000]'}`}>
                    #{item.tag}
                  </span>
                </div>

                <span className={`text-[10px] font-semibold shrink-0 ml-1 ${isSelected ? 'text-white/90' : 'text-slate-400 group-hover/item:text-slate-600'}`}>
                  {item.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function getCategory(tag) {
  const tech = ['yazılım', 'veri', 'yapayzeka', 'mobil', 'web', 'siber', 'bulut'];
  const career = ['staj', 'cv', 'kariyer', 'mülakat', 'iş', 'iş ilanı', 'başvuru'];
  const edu = ['burs', 'sertifika', 'seminer', 'eğitim', 'yüksek lisans', 'doktora'];
  const social = ['network', 'mezun', 'girişim', 'topluluk'];
  
  if (tech.includes(tag)) return '💻 Teknoloji';
  if (career.includes(tag)) return '💼 Kariyer';
  if (edu.includes(tag)) return '📚 Eğitim';
  if (social.includes(tag)) return '🤝 Sosyal';
  return '🔥 Popüler';
}
