import React from 'react';

export function Badge({ status }) {
  const map = {
    'Yayında':'bg-emerald-100 text-emerald-700 border-emerald-200',
    'Aktif':'bg-emerald-100 text-emerald-700 border-emerald-200',
    'Onaylı':'bg-emerald-100 text-emerald-700 border-emerald-200',
    'Kayıt Açık':'bg-sky-100 text-sky-700 border-sky-200',
    'İnceleniyor':'bg-sky-100 text-sky-700 border-sky-200',
    'Beklemede':'bg-amber-100 text-amber-700 border-amber-200',
    'Onay Bekliyor':'bg-amber-100 text-amber-700 border-amber-200',
    'Eşleştirme Bekliyor':'bg-amber-100 text-amber-700 border-amber-200',
    'Kapandı':'bg-gray-100 text-gray-500 border-gray-200',
    'Pasif':'bg-gray-100 text-gray-500 border-gray-200',
    'Dolu':'bg-orange-100 text-orange-700 border-orange-200',
    'PART TIME':'bg-purple-100 text-purple-700 border-purple-200',
    'TAM ZAMANLI':'bg-blue-100 text-blue-700 border-blue-200',
    'STAJ':'bg-indigo-100 text-indigo-700 border-indigo-200',
    'Reddedildi':'bg-red-100 text-red-700 border-red-200',
  };
  return <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${map[status]||'bg-gray-100 text-gray-500 border-gray-200'}`}>{status}</span>;
}

export function Card({ children, className='' }) {
  return <div className={`bg-white/80 backdrop-blur-xl rounded-xl border border-[var(--border-soft)] shadow-[var(--shadow-soft)] ${className}`}>{children}</div>;
}

export function StatCard({ icon, label, value, sub, color='red' }) {
  const colors = {
    red:   { bg:'bg-red-50',    text:'text-red-600',    ring:'ring-red-200'    },
    blue:  { bg:'bg-blue-50',   text:'text-blue-600',   ring:'ring-blue-200'   },
    green: { bg:'bg-emerald-50',text:'text-emerald-600',ring:'ring-emerald-200'},
    purple:{ bg:'bg-purple-50', text:'text-purple-600', ring:'ring-purple-200' },
    orange:{ bg:'bg-orange-50', text:'text-orange-600', ring:'ring-orange-200' },
  };
  const c = colors[color]||colors.red;
  return (
    <Card className="p-5">
      <div className={`w-11 h-11 rounded-xl ${c.bg} ${c.text} flex items-center justify-center mb-4 ring-1 ${c.ring}`}>{icon}</div>
      <p className="text-2xl font-black text-gray-900">{value}</p>
      <p className="text-sm font-semibold text-gray-700 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
    </Card>
  );
}

export function Progress({ value, max, color='red' }) {
  const pct = Math.round((value / (max || 1)) * 100);
  const colors = { red:'bg-red-500', blue:'bg-blue-500', green:'bg-emerald-500', orange:'bg-orange-500', purple:'bg-purple-500' };
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${colors[color]||colors.red} rounded-full transition-all`} style={{width:`${pct}%`}} />
      </div>
      <span className="text-xs font-bold text-gray-600 w-8 text-right">{pct}%</span>
    </div>
  );
}

export function Tbl({ headers, rows, empty='Kayıt bulunamadı' }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            {(headers || []).map((h,i)=><th key={i} className="text-left text-[11px] font-black text-gray-500 uppercase tracking-wider pb-3 pr-4 first:pl-0">{h}</th>)}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {(rows || []).length===0 ? (
            <tr><td colSpan={(headers || []).length} className="py-8 text-center text-gray-500 text-sm">{empty}</td></tr>
          ) : (rows || []).map((row,i)=>(
            <tr key={i} className="hover:bg-gray-50/60 transition-colors">
              {(row || []).map((cell,j)=><td key={j} className="py-3 pr-4 text-gray-700 align-middle first:pl-0 break-words whitespace-normal min-w-[150px] max-w-[200px]">{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function BtnGreen({ onClick, children }) {
  return <button onClick={onClick} className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg text-xs font-bold transition active:scale-95 duration-200">{children}</button>;
}
export function BtnRed({ onClick, children }) {
  return <button onClick={onClick} className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-xs font-bold transition active:scale-95 duration-200">{children}</button>;
}
export function BtnPrimary({ onClick, children, type='button', className='' }) {
  return <button type={type} onClick={onClick} className={`flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition active:scale-95 duration-200 shadow-sm ${className}`}>{children}</button>;
}
