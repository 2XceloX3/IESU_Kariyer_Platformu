import React, { useRef } from 'react';
import { Image as ImageIcon, UploadCloud, X } from 'lucide-react';

export default function MediaUploader({ image, onImageChange, label = "Görsel Yükle", aspect = "16:9" }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageChange(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onImageChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-gray-600 block">{label}</label>
      <div role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.currentTarget.click(); } }}  
        onClick={() => fileInputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center w-full border-2 border-dashed rounded-xl cursor-pointer transition overflow-hidden group
          ${image ? 'border-red-500 bg-black' : 'border-gray-200 hover:border-red-400 hover:bg-red-50'}
          ${aspect === '16:9' ? 'aspect-video' : aspect === '1:1' ? 'aspect-square' : 'h-32'}
        `}
      >
        {image ? (
          <>
            <img src={image} alt="Preview" className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
              <span className="bg-white/90 text-gray-900 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">Görseli Değiştir</span>
            </div>
            <button 
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition shadow-md z-10 opacity-0 group-hover:opacity-100"
            >
              <X size={16} />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center p-4 text-center">
            <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition">
              <UploadCloud size={20} />
            </div>
            <p className="text-sm font-bold text-gray-700">Tıkla veya Sürükle</p>
            <p className="text-[10px] text-gray-500 mt-1">PNG, JPG, WEBP • Max 5MB</p>
          </div>
        )}
        <input 
          type="file" 
          ref={fileInputRef}
          className="hidden" 
          accept="image/png, image/jpeg, image/webp" 
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}
