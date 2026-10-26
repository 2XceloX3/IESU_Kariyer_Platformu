import React, { useRef, useState } from 'react';

const VideoInterviewModal = ({ isOpen, onClose, onSave }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState(null);
  const chunksRef = useRef([]);

  const handleSave = async () => {
    if (!recordedVideoUrl) return;
    setIsLoading(true);
    try {
      const file = new File([new Blob(chunksRef.current, { type: 'video/webm' })], 'interview.webm', { type: 'video/webm' });

      if (onSave) {
        await onSave(file);
      }
      onClose();
    } catch (err) {
      console.error('Error saving video:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" data-testid="video-interview-modal">
       <button onClick={() => setRecordedVideoUrl('test')}>Record</button>
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default VideoInterviewModal;
