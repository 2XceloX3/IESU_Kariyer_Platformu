## Firma ilan/ATS çekirdek tarama
- HEAD: `348590b` (ATS-related fix still present from `2e6826b`; scanned files unchanged since then except Jobs CV-link on `75d44e8`)
- Özet: `CompanyATSBoard` + `JobCreator` tarafında companyId=auth.uid ve INITIAL seed kapatma düzeltmeleri doğrulandı; ancak firma ana sayfa (`CompanyFeed`) hâlâ sabit sahte adayları (PII dahil) her firmaya gösteriyor, ilan Firestore’a yazılmıyor ve firma rolünde Pasife Al/toggle UI’sı yok.

## Bulgular (öncelik sırasıyla)

### F-ATS-001
- Severity: **P0**
- Area: ATS | UI
- Evidence: `src/components/CompanyFeed.jsx` L89–175 — `useState([...])` içinde sabit `APP-CELIL-001` (gerçek isim/telefon/e-posta), `APP-DEMO-002`, `APP-DEMO-003`; L177–197 `allCandidateApps` bu listeyi store başvurularıyla **her zaman birleştirir**.
- Impact: Firma hive ana sayfasındaki aday/ATS bölümünde gerçek başvuru olmasa bile sahte (ve birinde kişisel) adaylar görünür; durum değiştirme yanılsaması yaratır.
- Suggested fix: `companyCandidateApps` başlangıcını `[]` yapın; yalnızca `companyId === currentUser.id|uid` store/Firestore başvurularını gösterin.

### F-ATS-002
- Severity: **P1**
- Area: ATS | auth
- Evidence: `src/components/CompanyFeed.jsx` L178–184 — store filtre hâlâ `companyId` **veya** `company` / `companyName` isim eşleşmesi; `CompanyATSBoard` L221–224’teki sıkı `app.companyId === uid` ile çelişiyor.
- Impact: Aynı isimli firmalar birbirinin başvurularını görebilir; ATS board boşken Feed dolu görünebilir.
- Suggested fix: Feed filtresini ATS ile aynı yapın: yalnız `app.companyId === (currentUser.id || currentUser.uid)`.

### F-ATS-003
- Severity: **P1**
- Area: ilan
- Evidence: `src/components/JobCreator.jsx` L13 `import { auth, db }` — `db` hiç kullanılmıyor; L181 yalnızca `setJobs([...])` (Zustand). Repo genelinde jobs için `setDoc`/`addDoc` yok (başvuru `JobsAndInternships.jsx` L186’da var).
- Impact: İlan oturum/store’da kalır; Firestore `jobs` + rules (`companyId == auth.uid`) ve cihazlar arası ATS senkronu çalışmaz; başvuru kuralları `applicationCompanyMatchesJob` job doc ister.
- Suggested fix: Create sonrası `setDoc(doc(db,'jobs', id), newJob)` ekleyin; `companyId` alanını `auth.currentUser.uid` olarak yazın.

### F-ATS-004
- Severity: **P1**
- Area: ilan | UI
- Evidence: `JobsAndInternships.jsx` L129–135 `handleToggleJobStatus` store-only; L540–550 toggle butonu **yalnız** `effectiveRole === 'admin'`. Firma rolünde aynı yerde “Hemen Başvur” render edilir. Own-job görünürlük L228: `j.companyId === effectiveCurrentUser?.id`.
- Impact: Firma kendi ilanını UI’dan pasife/kapatamaz (audit’teki “edit/close for own companyId” iddiası güncel HEAD’de doğrulanmıyor); değişiklik Firestore’a da gitmez.
- Suggested fix: `company` rolünde `j.companyId === uid` ise Pasife Al/Aktife Al gösterin ve `updateDoc` ile jobs status yazın.

### F-ATS-005
- Severity: **P1**
- Area: rules
- Evidence: `firestore.rules` L71–79 — `jobs` create: `isAuthenticated() && (isCompany() || isAdmin())`; **create’te** `request.resource.data.companyId == request.auth.uid` yok. Update/delete’te companyId==uid var (L75–78).
- Impact: Kötü niyetli client başka `companyId` ile job doc oluşturabilir; sonraki application match/ATS sızıntısı riski.
- Suggested fix: create kuralına `request.resource.data.companyId == request.auth.uid` (admin hariç) ekleyin.

### F-ATS-006
- Severity: **P2**
- Area: ATS | UI
- Evidence: `CompanyATSBoard.jsx` L23–140 `INITIAL_APPLICANTS` hâlâ tanımlı (ölü veri); L195–202 default boş — **doğrulandı fixed** (`2e6826b`). Ancak L199–200 / L348 `localStorage` key `iesu_company_ats_board_v1` eski mock kartları geri yükleyebilir.
- Impact: Eski tarayıcıda board’da hayalet adaylar; yeni kullanıcıda seed yok.
- Suggested fix: `INITIAL_APPLICANTS` silin; LS şema sürümü yükseltin veya mock id’leri yüklerken atın.

### F-ATS-007
- Severity: **P2**
- Area: auth | UI
- Evidence: `JobCreator.jsx` L818 `const compId = currentUser?.id || 'CMP-001'` (profil dock). ATS board dock L1126’da null’a çekilmiş — asimetrık. `JobsAndInternships.jsx` L38–44: id yok + guest değilse company → `'CMP-001'`.
- Impact: Kimliksiz company oturumunda profil/uygulama kimliği Trendyol mock `CMP-001`’e bağlanabilir (guest apply yolu L27–28/48–52 ile engellenmiş).
- Suggested fix: CMP-001 fallback’lerini kaldırın; id yoksa login’e yönlendirin (ATS dock ile aynı).

### F-ATS-008
- Severity: **P2**
- Area: ATS
- Evidence: `ApplicationsPanel.jsx` L123–127 firma yolu isim eşleşmesi; L130–133 status yalnız store (Firestore yok). Hive route: `CompanyHive.jsx` L116–117 `applications` → ApplicationsPanel.
- Impact: İsim çakışması / kalıcı status yok; ana ATS board ile tutarsız.
- Suggested fix: Panel’i ATS ile aynı `companyId` filtresi + `updateDoc` kullanacak şekilde hizalayın.

### F-ATS-009
- Severity: **P2**
- Area: UI
- Evidence: `CompanyATSBoard.jsx` L837 `app.gpa || '3.70'`; L991 `gpa || '3.75'`; L725/872 `%{app.match}` null iken `%null`/boş skor. Store map L234–238 bilinçli `null` (fix sonrası).
- Impact: Gerçek GPA/skor yokken UI sahte 3.70/3.75 gösterir.
- Suggested fix: Yoksa “—” gösterin; match yoksa rozeti gizleyin.

### F-ATS-010
- Severity: **P2**
- Area: ATS
- Evidence: `useAdminStore.js` L30+ `initialApplications` (APP-101… company isimleri, **companyId yok**). `CompanyATSBoard` sıkı filtre bunları göstermez; `CompanyFeed` isim eşleşmesi (F-ATS-002) + sabit seed (F-ATS-001) ile görünür kalır.
- Impact: Admin seed + Feed isim filtresi birleşince yanlış firma aday listesi.
- Suggested fix: Seed’i boşaltın veya gerçek `companyId` ile sınırlayın; Feed’de isim eşleşmesini kaldırın.

## Çalışan / temiz görünenler
- **Job create companyId guard:** `JobCreator.jsx` L158 `auth.currentUser.uid || …`, L177–180 uid yoksa kayıt yok (`2e6826b` doğrulandı).
- **ATS own-applicants filter:** `CompanyATSBoard.jsx` L218–224 yalnız `app.companyId === uid`; test `src/__tests__/coreFlows.progressAndAts.test.jsx` L29–46.
- **INITIAL seed kapalı (default):** ATS `mockApplicants` boş object ile başlıyor (L195–202); audit “no INITIAL mock seed” **ATS board için doğru**.
- **Status → Firestore (store apps):** `CompanyATSBoard.jsx` L331–337 `updateDoc(applications/{id})`; `mock_` id atlanır (L333).
- **Başvuru companyId zorunlu:** `JobsAndInternships.jsx` L149–152; guest apply engeli L26–28, L48–52; Firestore write L186–193 auth uid ile.
- **Rules applications update:** `firestore.rules` L118–129 company kendi `companyId` + job sahipliği; applicant/jobId/companyId yeniden atama yok.
- **Company hive store:** `useCompanyStore.js` fake seed yok; yalnız view/atsBoard/listings.
- **ATS dock CMP-001 kaldırıldı:** `CompanyATSBoard.jsx` L1126 `id || uid || null`.

## Fake/mock envanteri (company ATS path)
| Konum | Ne |
|-------|----|
| `CompanyFeed.jsx` L89–175 | **Aktif seed:** APP-CELIL-001 (PII), APP-DEMO-002, APP-DEMO-003 — her firma Feed ATS’ine merge |
| `CompanyATSBoard.jsx` L23–140 | `INITIAL_APPLICANTS` ölü sabit (Ahmet/Ayşe/…); default seed değil |
| `CompanyATSBoard.jsx` L199–200, L348 | `iesu_company_ats_board_v1` LS — eski mock restore riski |
| `ApplicationsPanel.jsx` L87–118 | `app_demo_1..3` — öğrenci/mezun boş liste fallback (company path değil ama hive’da route var) |
| `JobCreator.jsx` L818 | `CMP-001` profil fallback |
| `JobsAndInternships.jsx` L44 | company `branchTargetId` → `CMP-001` (id yokken) |
| `useAdminStore.js` L30+ | `initialApplications` mock pool (companyId eksik) |
| `mockData.js` L27 | `CMP-001` Trendyol kullanıcı seed (profil/mockData; ATS board filtre dışı) |
| `CompanyFeed.jsx` L221 | kariyer fuarı id: `Math.random()` (fake people değil; client id) |
| `CompanyATSBoard.jsx` L837, L991 | UI GPA placeholder `3.70` / `3.75` |

## Audit vs HEAD notu
`out-core/AUDIT-CORE-FLOWS.md` (eski HEAD `45cff7a`) company satırları kısmen güncel: create/ATS filter/INITIAL seed **CompanyATSBoard+JobCreator** için doğru; “edit/close own” ve “see applicants” **CompanyFeed / Jobs toggle / ApplicationsPanel** için fazla iyimser — F-ATS-001/002/004 ile çelişiyor.
