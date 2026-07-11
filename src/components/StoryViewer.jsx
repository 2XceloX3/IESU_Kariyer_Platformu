import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Send, Image as ImageIcon, Camera, Aperture } from 'lucide-react';

export default function StoryViewer({ stories, initialIndex = 0, onClose, isCreating, currentUser, setStories }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [newContent, setNewContent] = useState('');
  const [newImage, setNewImage] = useState(null);
  
  // Camera specific states
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // Auto advance stories
  useEffect(() => {
    if (isCreating) return;
    
    const duration = 5000; // 5 seconds per story
    const interval = 50;
    const step = (interval / duration) * 100;
    
    const timer = setInterval(() => {
      setProgress(p => {
        if (p + step >= 100) {
          handleNext();
          return 0;
        }
        return p + step;
      });
    }, interval);
    
    return () => clearInterval(timer);
  }, [currentIndex, isCreating]);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setProgress(0);
    }
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newContent.trim() && !newImage) return;

    const newStory = {
      id: 'STORY-' + Date.now(),
      author: {
        name: currentUser?.name || 'Sen',
        avatar: currentUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || 'S')}&background=132A49&color=fff`,
        role: currentUser?.role || 'student'
      },
      content: newContent,
      image: newImage,
      viewedBy: [],
      createdAt: new Date().toISOString()
    };

    setStories(prev => [newStory, ...(prev || [])]);
    stopCamera();
    onClose();
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      streamRef.current = stream;
      setIsCameraActive(true);
      setNewImage(null); // Clear previous if any
    } catch (err) {
      console.error("Camera access denied:", err);
      alert("Kameraya erişilemedi. Lütfen izinleri kontrol edin.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    if (isCameraActive && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [isCameraActive]);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setNewImage(dataUrl);
      stopCamera();
    }
  };

  useEffect(() => {
    return () => stopCamera(); // Cleanup on unmount
  }, []);

  const currentStory = stories?.[currentIndex];

  if (isCreating) {
    return (
      <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col animate-fade-in">
        <div className="flex justify-between items-center p-4">
          <h2 className="text-white font-bold text-lg">Hikaye Oluştur</h2>
          <button onClick={() => { stopCamera(); onClose(); }} className="p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition">
            <X size={24} />
          </button>
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center p-4 overflow-hidden relative">
          <div className="w-full max-w-sm aspect-[9/16] bg-gray-900 rounded-3xl overflow-hidden relative shadow-2xl border border-gray-800 flex flex-col">
            
            {/* Camera View */}
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted
              className={`absolute inset-0 w-full h-full object-cover ${isCameraActive ? 'block' : 'hidden'}`} 
            />
            <canvas ref={canvasRef} className="hidden" />

            {/* Captured Image View */}
            {newImage && (
              <img src={newImage} className="absolute inset-0 w-full h-full object-cover opacity-80" />
            )}
            
            {/* Empty State */}
            {!newImage && !isCameraActive && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900">
                <Camera size={48} className="text-white/20" />
              </div>
            )}
            
            <textarea 
              value={newContent}
              onChange={e => setNewContent(e.target.value)}
              placeholder={isCameraActive ? "" : "Hikayene bir şeyler yaz..."}
              className="relative z-10 w-full h-full bg-transparent text-white placeholder-white/50 text-center font-bold text-2xl resize-none outline-none p-8 flex items-center justify-center pt-[50%]"
            />

            {/* Capture Button Overlay */}
            {isCameraActive && (
              <div className="absolute bottom-6 left-0 w-full flex justify-center z-20">
                <button onClick={capturePhoto} className="w-16 h-16 rounded-full border-4 border-white/50 flex items-center justify-center bg-white/20 hover:bg-white/40 transition">
                  <div className="w-12 h-12 rounded-full bg-white"></div>
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="p-4 sm:p-6 pb-8 flex flex-wrap justify-center gap-3">
          <button onClick={startCamera} className="flex items-center gap-2 px-4 py-3 bg-white/10 text-white rounded-full font-bold hover:bg-white/20 transition">
            <Aperture size={20} /> Kamera
          </button>
          
          <label className="flex items-center gap-2 px-4 py-3 bg-white/10 text-white rounded-full font-bold hover:bg-white/20 transition cursor-pointer">
            <ImageIcon size={20} /> Galeri
            <input type="file" accept="image/*" className="hidden" onChange={e => {
              if (e.target.files[0]) {
                stopCamera();
                const reader = new FileReader();
                reader.onload = (evt) => setNewImage(evt.target.result);
                reader.readAsDataURL(e.target.files[0]);
              }
            }} />
          </label>
          
          <button 
            onClick={handleCreate}
            disabled={!newContent.trim() && !newImage}
            className="flex items-center gap-2 px-6 py-3 bg-iesu-red text-white rounded-full font-bold hover:bg-red-700 transition disabled:opacity-50"
          >
            Paylaş <Send size={20} />
          </button>
        </div>
      </div>
    );
  }

  if (!currentStory) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center animate-fade-in backdrop-blur-md">
      {/* Desktop Close */}
      <button onClick={onClose} className="absolute top-6 right-6 p-3 bg-white/10 rounded-full text-white hover:bg-white/20 transition hidden sm:block">
        <X size={24} />
      </button>

      {/* Main Story Container */}
      <div className="w-full max-w-[400px] h-[100dvh] sm:h-[80vh] sm:rounded-3xl overflow-hidden relative shadow-2xl bg-black flex flex-col group">
        
        {/* Progress Bars */}
        <div className="absolute top-0 left-0 w-full z-20 p-4 pb-0 flex gap-1 pt-6 sm:pt-4">
          {stories.map((s, idx) => (
            <div key={idx} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-100 ease-linear"
                style={{ width: idx < currentIndex ? '100%' : idx === currentIndex ? `${progress}%` : '0%' }}
              />
            </div>
          ))}
        </div>

        {/* Header (Author) */}
        <div className="absolute top-8 sm:top-6 left-0 w-full z-20 px-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-white/50 overflow-hidden bg-gray-800">
              <img src={currentStory.author.avatar} className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col text-white drop-shadow-md">
              <span className="font-bold text-sm leading-tight flex items-center gap-1">
                {currentStory.author.name}
                {currentStory.author.role === 'admin' && <img src="/iesu-logo.svg" className="w-3 h-3 ml-1 bg-white rounded-full" />}
              </span>
              <span className="text-[10px] opacity-80">{new Date(currentStory.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            </div>
          </div>
          {/* Mobile Close */}
          <button onClick={onClose} className="p-2 sm:hidden text-white drop-shadow-md">
            <X size={24} />
          </button>
        </div>

        {/* Story Content Area */}
        <div className="flex-1 relative bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center">
          {currentStory.image && (
            <img src={currentStory.image} className="absolute inset-0 w-full h-full object-cover" />
          )}
          
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />

          {currentStory.content && (
            <div className="relative z-10 w-full px-8 pb-20">
              <p className={`text-white text-center drop-shadow-lg font-medium leading-relaxed ${currentStory.content.length < 50 ? 'text-2xl sm:text-3xl' : 'text-lg sm:text-xl'}`}>
                {currentStory.content}
              </p>
            </div>
          )}
        </div>

        {/* Touch/Click Areas for Navigation */}
        <div className="absolute inset-0 z-10 flex">
          <div className="w-1/3 h-full cursor-pointer" onClick={handlePrev} />
          <div className="w-2/3 h-full cursor-pointer" onClick={handleNext} />
        </div>
        
        {/* Nav Arrows (Desktop) */}
        <button onClick={(e) => { e.stopPropagation(); handlePrev(); }} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/20 rounded-full text-white hover:bg-black/40 transition hidden sm:block z-30 opacity-0 group-hover:opacity-100">
          <ChevronLeft size={24} />
        </button>
        <button onClick={(e) => { e.stopPropagation(); handleNext(); }} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/20 rounded-full text-white hover:bg-black/40 transition hidden sm:block z-30 opacity-0 group-hover:opacity-100">
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
}
