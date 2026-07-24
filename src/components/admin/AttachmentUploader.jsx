import React, { useRef } from 'react';
import { FileText, UploadCloud, X, File } from 'lucide-react';

export default function AttachmentUploader({ fileData, fileName, onFileChange, label = "Belge Yükle (PDF/DOC)", accept=".pdf,.doc,.docx" }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        window.toast.info("Dosya boyutu 5MB'dan büyük olamaz.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        onFileChange(reader.result, file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onFileChange(null, '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-gray-600 block">{label}</label>
      <div role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.currentTarget.click(); } }}  
        onClick={() => !fileData && fileInputRef.current?.click()}
        className={`relative flex items-center justify-between w-full border-2 border-dashed rounded-xl p-4 transition group
          ${fileData ? 'border-red-500 bg-red-50 cursor-default' : 'border-gray-200 cursor-pointer hover:border-red-400 hover:bg-red-50/50'}
        `}
      >
        {fileData ? (
          <div className="flex items-center gap-3 w-full">
            <div className="w-10 h-10 bg-red-100 text-red-600 rounded-lg flex items-center justify-center shrink-0 shadow-sm">
              <FileText size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">{fileName || 'Ekli Belge'}</p>
              <p className="text-[10px] text-gray-500 font-medium mt-0.5">Yüklendi</p>
            </div>
            <button 
              type="button"
              onClick={handleRemove}
              className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition shadow-sm shrink-0"
              title="Dosyayı Kaldır"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3 w-full">
            <div className="w-10 h-10 bg-gray-100 text-gray-500 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-red-100 group-hover:text-red-600 transition">
              <UploadCloud size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-700 group-hover:text-red-600 transition">Tıkla veya Sürükle</p>
              <p className="text-[10px] text-gray-500 mt-0.5">PDF, DOC, DOCX • Max 5MB</p>
            </div>
          </div>
        )}
        <input 
          type="file" 
          ref={fileInputRef}
          className="hidden" 
          accept={accept} 
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}
