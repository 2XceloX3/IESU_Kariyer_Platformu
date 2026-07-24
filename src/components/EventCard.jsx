import React from 'react';
import { Calendar, MapPin, User, ExternalLink, Tag } from 'lucide-react';

export default function EventCard({ event, onSelect }) {
  if (!event) return null;

  return (
    <div
      className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
      data-testid={`event-card-${event.id || 'item'}`}
    >
      <div className="relative h-44 bg-slate-100 overflow-hidden">
        <img
          src={event.image || event.imageUrl || '/assets/events/default.jpg'}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800';
          }}
        />
        <div className="absolute top-3 left-3 bg-[#A80016] text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
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
