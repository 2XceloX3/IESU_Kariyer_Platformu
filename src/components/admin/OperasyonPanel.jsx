import React, { useState } from 'react';
import PanelHeader from './PanelHeader';
import { Card, Tbl, Badge, BtnGreen, BtnRed } from './AdminShared';
import useAppStore from '../../store/useAppStore';
import SGKExportPanel from '../internship/SGKExportPanel';
import CorporateProtocolCRM from '../protocol/CorporateProtocolCRM';
import { SAMPLE_ENTERPRISE_INTERNSHIPS } from '../../services/internshipWorkflow';
import { SAMPLE_CORPORATE_PROTOCOLS, calculateProtocolStatus, PROTOCOL_STATUS } from '../../services/protocolWorkflow';
import { FileSpreadsheet, ShieldCheck, ChevronRight, Building2 } from 'lucide-react';

export default function OperasyonPanel() {
  const { 
    jobs, setJobs, 
    voluntaryInternships, setVoluntaryInternships, 
    mentorships, 
    internships = [], setInternships,
    corporateProtocols = [],
    currentUser 
  } = useAppStore();

  const [showSGKExport, setShowSGKExport] = useState(false);
  const [showProtocolCRM, setShowProtocolCRM] = useState(false);

  const activeInternships = Array.isArray(internships) && internships.length > 0 
    ? internships 
    : SAMPLE_ENTERPRISE_INTERNSHIPS;

  const activeProtocolsList = Array.isArray(corporateProtocols) && corporateProtocols.length > 0
    ? corporateProtocols
    : SAMPLE_CORPORATE_PROTOCOLS;

  const activeProtocolsCount = activeProtocolsList.filter(p => {
    const st = calculateProtocolStatus(p);
    return st === PROTOCOL_STATUS.ACTIVE || st === PROTOCOL_STATUS.EXPIRING_SOON;
  }).length;

  const handleUpdateInternship = (updated) => {
    const list = activeInternships.map(i => i.id === updated.id ? updated : i);
    if (setInternships) setInternships(list);
  };

  return (
    <div className="animate-fade-in space-y-6">
      <PanelHeader 
        title="Operasyon Özeti, SGK Masası & Sanayi Protokol CRM" 
        sub="Günlük iş akışı, onay bekleyen ilan/stajlar, Personel Dairesi 5510/5-b SGK ihracı ve kurumsal protokol kontenjan takibi" 
      />

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
        <Card className="p-5 border-l-4 border-amber-400">
          <p className="text-3xl font-black text-gray-900">{(jobs || []).filter(j=>j?.status==='Beklemede').length}</p>
          <p className="text-xs font-bold text-gray-500 uppercase mt-1">Onay Bekleyen İlan</p>
        </Card>
        <Card className="p-5 border-l-4 border-red-400">
          <p className="text-3xl font-black text-gray-900">{(voluntaryInternships || []).filter(v=>v.status==='Onay Bekliyor').length}</p>
          <p className="text-xs font-bold text-gray-500 uppercase mt-1">Staj Onay Bekliyor</p>
        </Card>
        <Card className="p-5 border-l-4 border-purple-400">
          <p className="text-3xl font-black text-gray-900">{(mentorships || []).filter(m=>m.status==='Eşleştirme Bekliyor').length}</p>
          <p className="text-xs font-bold text-gray-500 uppercase mt-1">Mentor Eşleşme</p>
        </Card>
        <Card className="p-5 border-l-4 border-emerald-500 bg-emerald-50/20 flex flex-col justify-between">
          <div>
            <p className="text-3xl font-black text-emerald-800">{activeInternships.length}</p>
            <p className="text-xs font-black text-emerald-700 uppercase mt-1">SGK 5510/5-b Dosyası</p>
          </div>
          <button 
            type="button"
            onClick={() => setShowSGKExport(!showSGKExport)}
            className="mt-2 text-left text-xs font-black text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
          >
            <span>{showSGKExport ? 'Konsolu Kapat' : 'SGK Masasını Aç'}</span>
            <ChevronRight size={14} />
          </button>
        </Card>
        <Card className="p-5 border-l-4 border-blue-600 bg-blue-50/20 flex flex-col justify-between">
          <div>
            <p className="text-3xl font-black text-blue-900">{activeProtocolsCount}</p>
            <p className="text-xs font-black text-blue-700 uppercase mt-1">Sanayi Protokol CRM</p>
          </div>
          <button 
            type="button"
            onClick={() => setShowProtocolCRM(!showProtocolCRM)}
            className="mt-2 text-left text-xs font-black text-blue-700 hover:text-blue-900 flex items-center gap-1 cursor-pointer"
          >
            <span>{showProtocolCRM ? 'Konsolu Kapat' : 'Protokol Masasını Aç'}</span>
            <ChevronRight size={14} />
          </button>
        </Card>
      </div>

      {/* SGK 5510/5-b Toplu İşe Giriş Masası (Genişletilebilir) */}
      {showSGKExport && (
        <div className="p-6 bg-slate-50/50 rounded-3xl border border-slate-200">
          <SGKExportPanel 
            internships={activeInternships}
            onUpdateInternship={handleUpdateInternship}
            currentUser={currentUser}
          />
        </div>
      )}

      {/* Kurumsal Protokol & Sanayi CRM Masası (Genişletilebilir) */}
      {showProtocolCRM && (
        <div className="p-6 bg-slate-50/50 rounded-3xl border border-slate-200">
          <CorporateProtocolCRM currentUser={currentUser} />
        </div>
      )}

      <Card className="p-6">
        <h3 className="font-black text-gray-900 mb-4">Onay Bekleyen İlanlar</h3>
        {(jobs || []).filter(j=>j?.status==='Beklemede').length===0
          ? <p className="text-gray-500 text-sm text-center py-6">✓ Onay bekleyen ilan yok</p>
          : <Tbl
              headers={['İlan','Firma','Tür','Tarih','İşlem']}
              rows={(jobs || []).filter(j=>j?.status==='Beklemede').map(j=>[
                <span className="font-bold text-gray-900">{j?.title}</span>,
                j?.company, <Badge status={j?.type}/>, j?.date,
                <div className="flex gap-2">
                  <BtnGreen onClick={()=>setJobs((jobs || []).map(x=>x.id===j?.id?{...x,status:'Yayında'}:x))}>Onayla</BtnGreen>
                  <BtnRed onClick={()=>setJobs((jobs || []).filter(x=>x.id!==j?.id))}>Reddet</BtnRed>
                </div>
              ])}
            />}
      </Card>

      <Card className="p-6">
        <h3 className="font-black text-gray-900 mb-4">Onay Bekleyen Stajlar</h3>
        {(voluntaryInternships || []).filter(v=>v.status==='Onay Bekliyor').length===0
          ? <p className="text-gray-500 text-sm text-center py-6">✓ Onay bekleyen staj yok</p>
          : <Tbl
              headers={['Öğrenci','Firma','Pozisyon','Başlangıç','İşlem']}
              rows={(voluntaryInternships || []).filter(v=>v.status==='Onay Bekliyor').map(v=>[
                <span className="font-bold">{v.student}</span>,
                v.company, v.position, v.startDate,
                <div className="flex gap-2">
                  <BtnGreen onClick={()=>setVoluntaryInternships((voluntaryInternships || []).map(x=>x.id===v.id?{...x,status:'Onaylı'}:x))}>Onayla</BtnGreen>
                  <BtnRed onClick={()=>setVoluntaryInternships((voluntaryInternships || []).map(x=>x.id===v.id?{...x,status:'Reddedildi'}:x))}>Reddet</BtnRed>
                </div>
              ])}
            />}
      </Card>
    </div>
  );
}
