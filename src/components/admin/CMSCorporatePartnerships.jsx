/**
 * src/components/admin/CMSCorporatePartnerships.jsx
 * İstanbul Esenyurt Üniversitesi (İESÜ) Resmî Sektör Protokolleri & Şirket Anlaşmaları Masası
 *
 * Requirements:
 * - AGENTS.md Corporate Standards
 * - Resmî Kurum Adı: İstanbul Esenyurt Üniversitesi (İESÜ)
 * - Yönetici Unvanı: Kariyer Geliştirme Koordinatörlüğü
 * - Full CorporateProtocolCRM integration (Protokoller, Kontenjan Takibi, İŞKUR, ESBİM, Senato Raporu)
 */

import React from 'react';
import CorporateProtocolCRM from '../protocol/CorporateProtocolCRM';

export default function CMSCorporatePartnerships(props) {
  return (
    <div className="animate-fade-in">
      <CorporateProtocolCRM {...props} />
    </div>
  );
}
