import React from 'react';
import { MapPin, Phone, Mail, Clock, UserCheck, Building, ExternalLink } from 'lucide-react';
import useAppStore from '../store/useAppStore';

export default function OfficeInfo() {
  const storeOfficeInfo = useAppStore((state) => state.officeInfo) || {};

  const title = storeOfficeInfo.title || "İstanbul Esenyurt Üniversitesi Kariyer Geliştirme Merkezi";
  const description = storeOfficeInfo.description || "Kariyer Geliştirme Merkezi, öğrencilerimizin ve mezunlarımızın mesleki gelişimlerini desteklemek, kariyer planlamalarına rehberlik etmek ve onları iş dünyası ile buluşturmak amacıyla hizmet vermektedir.";
  const address = storeOfficeInfo.address || "Zafer Mah. Adile Naşit Bulv. No:1, Esenyurt, İstanbul / Türkiye";
  const phone = storeOfficeInfo.phone || "444 9 123 / +90 (212) 699 09 90";
  const email = storeOfficeInfo.email || "kariyer@esenyurt.edu.tr";
  const workingHours = storeOfficeInfo.workingHours || "Hafta içi 08:30 - 17:30";
  const coordinators = storeOfficeInfo.coordinators || [];

  return (
    <section className="py-12 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-10 my-8" data-testid="office-info-section">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#A80016]/10 text-[#A80016] flex items-center justify-center font-bold">
            <Building size={24} />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black text-gray-900 leading-tight" data-testid="office-title">
              {title}
            </h2>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">Resmi İletişim & Koordinatörlük Bilgileri</p>
          </div>
        </div>

        <p className="text-sm text-slate-600 font-medium leading-relaxed mb-8" data-testid="office-description">
          {description}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Contact Details */}
          <div className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-4">İletişim Detayları</h3>

            <div className="flex items-start gap-3 text-xs" data-testid="office-address">
              <MapPin size={18} className="text-[#A80016] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-red-900 block">Adres:</span>
                <span className="text-slate-600 font-medium">{address}</span>
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs" data-testid="office-phone">
              <Phone size={18} className="text-[#A80016] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-red-900 block">Telefon:</span>
                <a href={`tel:${phone.replace(/[^0-9+]/g, '')}`} className="text-slate-600 hover:text-[#A80016] font-medium">{phone}</a>
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs" data-testid="office-email">
              <Mail size={18} className="text-[#A80016] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-red-900 block">E-Posta:</span>
                <a href={`mailto:${email}`} className="text-slate-600 hover:text-[#A80016] font-medium">{email}</a>
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs" data-testid="office-working-hours">
              <Clock size={18} className="text-[#A80016] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-red-900 block">Çalışma Saatleri:</span>
                <span className="text-slate-600 font-medium">{workingHours}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Coordinators */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100" data-testid="coordinators-list">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <UserCheck size={16} className="text-[#A80016]" /> Ofis Koordinatörleri
            </h3>

            <div className="space-y-4">
              {coordinators.map((coord) => (
                <div
                  key={coord.id || coord.name}
                  data-testid={`coordinator-card-${coord.id}`}
                  className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-sm font-black text-gray-900" data-testid="coordinator-name">
                      {coord.name}
                    </h4>
                    <p className="text-xs text-red-700 font-bold" data-testid="coordinator-role">
                      {coord.role || coord.title || 'Kariyer Geliştirme Ofisi'}
                    </p>
                    <div className="mt-2 text-[11px] text-slate-500 font-medium space-y-0.5">
                      <p data-testid="coordinator-email">E-posta: {coord.email}</p>
                      {coord.phone && <p data-testid="coordinator-phone">Tel: {coord.phone}</p>}
                    </div>
                    {storeOfficeInfo.sourceUrl && (
                      <a href={storeOfficeInfo.sourceUrl} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-[#990000] hover:underline">
                        Resmî kaynak sayfasını görüntüle <ExternalLink size={13} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
