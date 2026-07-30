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

export default function TrendingHashtags({ posts = [], onTagClick, limit = 6 }) {
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
      onTagClick(tag);
    } else if (window.toast) {
      window.toast.info(`🔍 #${tag} etiketli içerikler aranıyor...`);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden group">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-slate-50">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-gradient-to-br from-red-50 to-red-100 rounded-lg">
            <TrendingUp size={14} className="text-[#990000]" />
          </div>
          <h3 className="text-sm font-black text-slate-800 tracking-tight">Trend Konular</h3>
        </div>
        <Sparkles size={14} className="text-amber-400" />
      </div>

      {/* Trending list */}
      <div className="divide-y divide-slate-50">
        {trendingTags.map((item, i) => (
          <button
            key={item.tag}
            onClick={() => handleClick(item.tag)}
            className="w-full flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors text-left group/item cursor-pointer"
          >
            {/* Rank */}
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
              i === 0 ? 'bg-amber-50 text-amber-700' :
              i === 1 ? 'bg-slate-100 text-slate-500' :
              i === 2 ? 'bg-orange-50 text-orange-600' :
              'bg-slate-50 text-slate-400'
            }`}>
              {i + 1}
            </span>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <Hash size={11} className="text-slate-400 shrink-0" />
                <span className="text-sm font-bold text-slate-800 truncate group-hover/item:text-[#990000] transition-colors">
                  {item.tag}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] font-semibold text-slate-400">{item.count} gönderi</span>
                <span className="text-[9px] text-slate-300">•</span>
                <span className="text-[10px] font-medium text-slate-400">{item.category}</span>
              </div>
            </div>

            <ChevronRight size={14} className="text-slate-300 group-hover/item:text-[#990000] transition-colors shrink-0" />
          </button>
        ))}
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
