$path = "src\App.jsx"
Copy-Item $path "$path.bak2" -Force
$content = Get-Content $path -Raw

$anchor1 = "const CompanyATSBoard = lazy(() => import('./components/CompanyATSBoard'));"
$add1 = @'
const CompanyATSBoard = lazy(() => import('./components/CompanyATSBoard'));
const AlumniAssocPortal = lazy(() => import('./components/AlumniAssocPortal'));
const KnowledgePortal = lazy(() => import('./components/KnowledgePortal'));
const BMICalculatorModal = lazy(() => import('./components/BMICalculatorModal'));
'@
$content = $content.Replace($anchor1, $add1)

$anchor2 = "{view === 'company_ats' && <CompanyATSBoard setView={setView} currentUser={currentUser} />}"
$add2 = @'
{view === 'company_ats' && <CompanyATSBoard setView={setView} currentUser={currentUser} />}
        {view === 'alumni_assoc_portal' && <AlumniAssocPortal setView={setView} currentUser={currentUser} userRole={userRole} setSelectedUserId={setSelectedUserId} academicRole={academicRole} />}
        {view === 'bmi_calculator' && (
          <div className="min-h-screen bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
            <BMICalculatorModal isOpen={true} onClose={() => setView(previousView || 'student')} />
          </div>
        )}
'@
$content = $content.Replace($anchor2, $add2)

$anchor3 = "{view === 'research_hub' && <ResearchOSHub currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />}"
$add3 = @'
{view === 'research_hub' && <ResearchOSHub currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />}
        {view === 'knowledge_portal' && <KnowledgePortal currentUser={currentUser} userRole={userRole} setView={setView} />}
'@
$content = $content.Replace($anchor3, $add3)

$anchor4 = "'club_portal', 'student',"
$add4 = "'club_portal', 'student', 'alumni_assoc_portal', 'knowledge_portal', 'bmi_calculator',"
$content = $content.Replace($anchor4, $add4)

Set-Content -Path $path -Value $content -NoNewline
Write-Host "TAMAMLANDI - App.jsx guncellendi"