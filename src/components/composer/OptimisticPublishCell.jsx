/**
 * src/components/composer/OptimisticPublishCell.jsx
 * Instagram Tarzı İyimser Akış (Optimistic UI) & SVG İlerleme Halkası Hücresi
 * (Dairesel İlerleme %0-100, Kesinti Kurtarma & Taslak Saklama)
 */

import React from 'react';
import { RefreshCw, Save, AlertCircle, CheckCircle2, UploadCloud } from 'lucide-react';
import { useComposerStore } from '../../store/useComposerStore';
import { useTranslation } from '../../i18n';

export default function OptimisticPublishCell({ onRetry, onSaveDraft }) {
  const { t } = useTranslation();
  const isPublishing = useComposerStore(state => state.isPublishing);
  const publishProgress = useComposerStore(state => state.publishProgress);
  const publishStatus = useComposerStore(state => state.publishStatus);
  const errorMessage = useComposerStore(state => state.errorMessage);
  const optimisticPost = useComposerStore(state => state.optimisticPost);
  const reset = useComposerStore(state => state.reset);

  if (!isPublishing && publishStatus !== 'error' && !optimisticPost) {
    return null;
  }

  // SVG Dairesel İlerleme Hesaplaması
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (publishProgress / 100) * circumference;

  const getStatusLabel = () => {
    switch (publishStatus) {
      case 'preprocessing':
        return t('composer.statusPreprocessing') || 'Görseller WebP formatına optimize ediliyor...';
      case 'uploading':
        return t('composer.statusUploading', { progress: publishProgress }) || `RUpload parçalı yükleme sürüyor (%${publishProgress})...`;
      case 'committing':
        return t('composer.statusCommitting') || 'Akışa işleniyor...';
      case 'success':
        return t('composer.statusSuccess') || 'Yayınlandı!';
      case 'error':
        return errorMessage || t('composer.statusNetworkError') || 'Yükleme sırasında ağ bağlantısı kesildi.';
      default:
        return t('composer.statusDefault') || 'Gönderi hazırlanıyor...';
    }
  };

  return (
    <div className={`mb-4 p-4 rounded-2xl border transition-all duration-300 shadow-sm ${
      publishStatus === 'error'
        ? 'bg-red-50/90 border-red-200 text-red-900'
        : 'bg-white border-slate-200 text-slate-800'
    }`}>
      <div className="flex items-center justify-between gap-4">
        {/* Sol: İlerleme veya İkon */}
        <div className="flex items-center gap-3 min-w-0">
          {publishStatus === 'error' ? (
            <div className="w-11 h-11 rounded-full bg-red-100 flex items-center justify-center shrink-0 text-red-600">
              <AlertCircle size={24} />
            </div>
          ) : (
            <div className="relative w-11 h-11 shrink-0 flex items-center justify-center">
              <svg className="w-11 h-11 -rotate-90 transform" viewBox="0 0 44 44">
                {/* Arka Plan Halkası */}
                <circle
                  cx="22"
                  cy="22"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="3.5"
                  className="text-slate-100"
                  fill="transparent"
                />
                {/* Dinamik İlerleme Halkası */}
                <circle
                  cx="22"
                  cy="22"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="3.5"
                  className="text-red-600 transition-all duration-300 ease-out"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute font-mono text-[10px] font-extrabold text-slate-700">
                %{publishProgress}
              </span>
            </div>
          )}

          {/* Orta: Açıklama ve Gönderi Önizlemesi */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-extrabold tracking-tight truncate">
                {publishStatus === 'error' ? (t('composer.failed') || 'Paylaşım Başarısız Oldu') : (t('composer.publishingTitle') || 'Gönderiniz Paylaşılıyor')}
              </p>
              {publishStatus !== 'error' && (
                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              )}
            </div>
            <p className="text-[11px] text-slate-500 truncate mt-0.5">
              {getStatusLabel()}
            </p>
          </div>
        </div>

        {/* Sağ: Hata Durumunda Kurtarma Eylemleri */}
        {publishStatus === 'error' && (
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onRetry || (() => useComposerStore.getState().retryPublish())}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition shadow-xs cursor-pointer active:scale-95"
            >
              <RefreshCw size={12} />
              <span>{t('composer.retry') || t('common.retry') || 'Tekrar Dene'}</span>
            </button>
            <button
              type="button"
              onClick={onSaveDraft || (async () => {
                await useComposerStore.getState().autoSaveDraft();
                reset();
                if (window.toast?.success) window.toast.success(t('composer.draftSaved') || 'İçerik taslaklara kaydedildi.');
              })}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition shadow-xs cursor-pointer active:scale-95"
            >
              <Save size={12} />
              <span>{t('composer.saveDraft') || t('common.saveDraft') || 'Taslağa Kaydet'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
