import React from 'react';
import PanelHeader from './PanelHeader';
import { Card, Tbl, Badge, BtnGreen, BtnRed } from './AdminShared';
import useAppStore from '../../store/useAppStore';

export default function OperasyonPanel() {
  const { jobs, setJobs, voluntaryInternships, setVoluntaryInternships, mentorships } = useAppStore();
  return (
    <div className="animate-fade-in space-y-6">
      <PanelHeader title="Operasyon Özeti" sub="Günlük iş akışı ve onay gerektiren işlemler" />

      <div className="grid grid-cols-3 gap-4">
        <Card className="p-5 border-l-4 border-amber-400">
          <p className="text-3xl font-black text-gray-900">{(jobs || []).filter(j=>j?.status==='Beklemede').length}</p>
          <p className="text-xs font-bold text-gray-500 uppercase mt-1">Onay Bekleyen İlan</p>
        </Card>
        <Card className="p-5 border-l-4 border-blue-400">
          <p className="text-3xl font-black text-gray-900">{(voluntaryInternships || []).filter(v=>v.status==='Onay Bekliyor').length}</p>
          <p className="text-xs font-bold text-gray-500 uppercase mt-1">Staj Onay Bekliyor</p>
        </Card>
        <Card className="p-5 border-l-4 border-purple-400">
          <p className="text-3xl font-black text-gray-900">{(mentorships || []).filter(m=>m.status==='Eşleştirme Bekliyor').length}</p>
          <p className="text-xs font-bold text-gray-500 uppercase mt-1">Mentor Eşleşme Bekliyor</p>
        </Card>
      </div>

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
