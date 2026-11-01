import React from 'react';
import { Calendar, MapPin, User, ExternalLink } from 'lucide-react';
import SafeEventImage from './shared/SafeEventImage';

export default function EventCard({ event, onSelect }) {
  if (!event) return null;

  return (
    <div
      className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
      data-testid={`event-card-${event.id || 'item'}`}
    >
      <div className="relative aspect-[4/5] bg-slate-100 overflow-hidden">
        <SafeEventImage
          src={event.image || event.imageUrl}
          alt={event.title}
          fallbackType="event"
          mode="poster"
          className="w-full h-full"
        />
        <div className="absolute top-3 left-3 z-20 bg-[#A80016] text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
          {event.status || 'Etkinlik'}
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold mb-2" data-testid="event-date">
            <Calendar size={13} className="text-red-700" />
            <span>{event.date || 'Tarih Belirtilmedi'}</span>
          </div>

          <h4 className="text-base font-black text-red-950 leading-snug mb-3 hover:text-[#A80016] transition-colors" data-testid="event-title">
            {event.title}
          </h4>

          <div className="space-y-1.5 text-xs text-slate-600 font-medium mb-4">
            {event.location && (
              <div className="flex items-center gap-1.5" data-testid="event-location">
                <MapPin size={13} className="text-slate-400" />
                <span>{event.location}</span>
              </div>
            )}
            {event.speaker && (
              <div className="flex items-center gap-1.5" data-testid="event-speaker">
                <User size={13} className="text-slate-400" />
                <span>Konuşmacı: {event.speaker}</span>
              </div>
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
          {event.link && event.link !== '#' ? (
            <a
              href={event.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#A80016] font-bold flex items-center gap-1 hover:underline"
              data-testid="event-link"
            >
              Etkinlik Sayfası <ExternalLink size={13} />
            </a>
          ) : (
            <button
              onClick={() => onSelect && onSelect(event)}
              className="text-[#A80016] font-bold hover:underline cursor-pointer"
              data-testid="event-details-btn"
            >
              Detayları Gör
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
