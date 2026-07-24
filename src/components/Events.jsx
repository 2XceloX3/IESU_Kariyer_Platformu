import React from 'react';
import useAppStore from '../store/useAppStore';
import EventCard from './EventCard';

export default function Events({ onSelectEvent, limit }) {
  const storeEvents = useAppStore((state) => state.events) || [];
  const events = limit ? storeEvents.slice(0, limit) : storeEvents;

  return (
    <section className="py-12 bg-transparent" data-testid="events-section">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-[11px] font-black uppercase tracking-widest text-[#A80016] bg-red-50 px-3.5 py-1.5 rounded-full border border-red-100">
              Kariyer Etkinlikleri Takvimi
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-2 tracking-tight">
              Öne Çıkan Kariyer Etkinlikleri & Seminerler
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="events-list">
          {events.map((evt) => (
            <EventCard key={evt.id || evt.title} event={evt} onSelect={onSelectEvent} />
          ))}
        </div>
      </div>
    </section>
  );
}
