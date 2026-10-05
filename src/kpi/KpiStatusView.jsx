import React from 'react';
import { formatKpiUi } from './compute';

/** Shared KPI card UI per kabul kriterleri A.7 */
export default function KpiStatusView({ kpi, title, formHref, formLabel = 'Formu aç', className = '' }) {
  const ui = formatKpiUi(kpi, { formHref });
  return (
    <div className={`p-4 rounded-2xl border bg-white/10 border-white/10 ${className}`} data-testid={`kpi-${kpi?.kpiKey || 'unknown'}`} data-status={kpi?.status || 'empty'}>
      {title ? <p className="text-[10px] font-black uppercase tracking-wider text-slate-300 mb-1">{title}</p> : null}
      <p className="text-2xl font-black text-white">{ui.headline}</p>
      {ui.detail ? <p className="text-[11px] text-blue-200 font-semibold mt-1">{ui.detail}</p> : null}
      {kpi?.status === 'empty' && formHref ? (
        <a href={formHref} onClick={(e) => { /* SPA: parent may intercept */ }} className="inline-block mt-2 text-[11px] font-bold text-amber-300 underline" data-testid="kpi-empty-form-link">
          {formLabel}
        </a>
      ) : null}
    </div>
  );
}

export function KpiStatusViewLight({ kpi, title, formHref, formLabel = 'İlgili forma git', onNavigate }) {
  const ui = formatKpiUi(kpi, { formHref });
  return (
    <div className="p-4 bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200" data-testid={`kpi-light-${kpi?.kpiKey || 'unknown'}`} data-status={kpi?.status || 'empty'}>
      {title ? <p className="text-[11px] font-black text-slate-600 uppercase tracking-wider">{title}</p> : null}
      <p className="text-3xl font-black text-gray-900 mt-1">{ui.headline}</p>
      {ui.detail ? <p className="text-[10px] font-semibold text-slate-500 mt-1">{ui.detail}</p> : null}
      {kpi?.status === 'empty' && (formHref || onNavigate) ? (
        <button
          type="button"
          data-testid="kpi-empty-form-link"
          className="mt-2 text-[11px] font-bold text-[#990000] underline"
          onClick={() => (onNavigate ? onNavigate(formHref) : null)}
        >
          {formLabel}
        </button>
      ) : null}
    </div>
  );
}
