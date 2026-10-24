/**
 * src/components/composer/CoAuthorSelector.jsx
 * Öğrenci, Kulüp ve Şirket Ortak Yazar (Co-Author) Davet Mekanizması
 * (Instagram Katman 4 / Birlikte Gönderi Yayınlama)
 */

import React, { useState } from 'react';
import { Users, UserPlus, X, Check, Building2, Award } from 'lucide-react';
import { useComposerStore } from '../../store/useComposerStore';
import SafeAvatar from '../shared/SafeAvatar';

const CO_AUTHOR_DIRECTORY = [
  { id: 'clb_yazilim', name: 'İESÜ Yazılım ve İnovasyon Kulübü', title: 'Öğrenci Kulübü', role: 'club', avatar: '/iesu-logo.svg' },
  { id: 'clb_kariyer', name: 'İESÜ Kariyer Geliştirme Kulübü', title: 'Öğrenci Kulübü', role: 'club', avatar: '/iesu-logo.svg' },
  { id: 'clb_ieee', name: 'IEEE İESÜ Öğrenci Kolu', title: 'Öğrenci Kulübü', role: 'club', avatar: '/iesu-logo.svg' },
  { id: 'usr_mehmet', name: 'Mehmet Demir', title: 'Yazılım Kulübü Başkanı', role: 'student', avatar: null },
  { id: 'usr_zeynep', name: 'Zeynep Yıldız', title: 'Mezunlar Temsilcisi', role: 'alumni', avatar: null },
  { id: 'cmp_teknokent', name: 'İESÜ Teknoloji Transfer Ofisi', title: 'Kurumsal Birim', role: 'admin', avatar: '/iesu-logo.svg' }
];

export default function CoAuthorSelector() {
  const coAuthors = useComposerStore(state => state.coAuthors);
  const addCoAuthor = useComposerStore(state => state.addCoAuthor);
  const removeCoAuthor = useComposerStore(state => state.removeCoAuthor);

  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = CO_AUTHOR_DIRECTORY.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-3 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users size={16} className="text-red-600" />
          <span className="text-xs font-bold text-gray-800">Ortak Yazarlık (Co-Author)</span>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700 transition"
        >
          <UserPlus size={14} />
          <span>{isOpen ? 'Kapat' : 'Ortak Yazar Davet Et'}</span>
        </button>
      </div>

      {/* Selected Co-Authors Chips */}
      {coAuthors && coAuthors.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {coAuthors.map(author => (
            <div
              key={author.id}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-gray-300 shadow-xs"
            >
              <SafeAvatar
                src={author.avatar}
                alt={author.name}
                className="w-5 h-5 rounded-full object-cover"
              />
              <span className="text-xs font-bold text-gray-800">{author.name}</span>
              <span className="text-[10px] text-gray-500 font-mono">({author.title})</span>
              <button
                type="button"
                onClick={() => removeCoAuthor(author.id)}
                className="text-gray-400 hover:text-red-600 ml-0.5"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Dropdown Directory Selector */}
      {isOpen && (
        <div className="mt-2 bg-white rounded-xl border border-gray-200 p-2 shadow-lg animate-in fade-in duration-150">
          <input
            type="text"
            placeholder="Kulüp veya öğrenci adı ara..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full px-3 py-1.5 mb-2 rounded-lg border border-gray-200 text-xs focus:outline-none focus:border-red-500"
          />

          <div className="max-h-40 overflow-y-auto space-y-1">
            {filtered.map(item => {
              const isSelected = coAuthors.some(a => a.id === item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    if (isSelected) {
                      removeCoAuthor(item.id);
                    } else {
                      addCoAuthor(item);
                    }
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition ${
                    isSelected ? 'bg-red-50 text-red-900 font-bold' : 'hover:bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <SafeAvatar
                      src={item.avatar}
                      alt={item.name}
                      className="w-6 h-6 rounded-full object-cover shrink-0"
                    />
                    <div className="truncate">
                      <p className="text-xs truncate">{item.name}</p>
                      <p className="text-[10px] text-gray-500">{item.title}</p>
                    </div>
                  </div>
                  {isSelected && <Check size={14} className="text-red-600 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
