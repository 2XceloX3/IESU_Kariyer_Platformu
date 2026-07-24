# Project: IESU Kariyer Platformu Data Integration & Branding QA

## Architecture
- Frontend: React application with components and data files in `src/` (`LandingPage.jsx`, `HeroSlider.jsx`, `mockData.js`, `innerPagesData.js`, `universityData.js`, `liveData.js`, etc.).
- Target Sources: 
  - https://www.esenyurt.edu.tr/
  - https://www.esenyurt.edu.tr/icerik/2355-kariyer-gelistirme-ofisi-koordinatorlugu

## Code Layout
- `src/utils/mockData.js`
- `src/utils/innerPagesData.js`
- `src/utils/universityData.js`
- `src/utils/liveData.js` (or related data adapters)
- `src/components/` (LandingPage, HeroSlider, etc.)

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Web Data Extraction & Analysis | Scrape Esenyurt University sites & analyze codebase schema/branding | none | IN_PROGRESS |
| 2 | UI Integration & Branding Scrub | Integrate extracted data into React components/data files & scrub blue/Gelişim/İGÜ | M1 | PLANNED |
| 3 | Verification & Chaos QA | Run build, unit tests, render crash checks, adversarial testing & forensic audit | M2 | PLANNED |

## Interface Contracts & Branding Rules
- All mock data objects must maintain existing property keys and expected types.
- Arrays must remain arrays (non-null), image strings must be valid URLs or fallbacks, object fields must never cause undefined pointer exceptions during render.
- Strictly adhere to Red (#990000 or #D32F2F), Coral (#FF6F61), and White branding.
- Zero blue classes (`bg-blue-*`, `text-blue-*`, `#0A2342`) and zero "Gelişim" or "İGÜ" text references anywhere in UI text.
