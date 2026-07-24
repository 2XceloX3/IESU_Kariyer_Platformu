# Project: IESU Kariyer Platformu Data Integration & QA

## Architecture
- Frontend: React application with mock data files located in `src/utils/` (`mockData.js`, `innerPagesData.js`, `universityData.js`, etc.).
- Data Source: Esenyurt University Career Development Office web page (https://www.esenyurt.edu.tr/icerik/2355-kariyer-gelistirme-ofisi-koordinatorlugu).

## Code Layout
- `src/utils/mockData.js`
- `src/utils/innerPagesData.js`
- `src/utils/universityData.js`
- `src/components/` (UI components referencing mock data)

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Web Data Extraction & Analysis | Inspect target URL and codebase structures | none | DONE |
| 2 | Mock Data Integration | Update mock data files with extracted structured data | M1 | DONE |
| 3 | Verification & Chaos QA | Run build, verify UI components, null/undefined checks & forensic audit | M2 | DONE |

## Interface Contracts
- All mock data objects must maintain existing property keys and types expected by components.
- Arrays must remain arrays (non-null), image strings must be valid URLs or fallbacks, object fields must never cause undefined pointer exceptions during render.
