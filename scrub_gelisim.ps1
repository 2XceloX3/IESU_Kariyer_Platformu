$dest = 'C:\Users\celil\.gemini\antigravity\scratch\IESU_Kariyer_Platformu\src'

$filesToProcess = Get-ChildItem -Path $dest -Include *.jsx,*.js,*.css -Recurse | Where-Object { $_.FullName -notmatch '\\data\\' }

foreach ($file in $filesToProcess) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content

    # 1. Colors
    $content = $content -replace 'gelisim-navy', 'iesu-darkRed'
    $content = $content -replace 'gelisim-blue', 'iesu-coral'
    $content = $content -replace 'gelisim-red', 'iesu-red'

    # 2. Text / Info Scrubbing
    $content = $content -replace '(?i)gelişim üniversitesi', 'IESU'
    $content = $content -replace '(?i)gelisim üniversitesi', 'IESU'
    $content = $content -replace '(?i)gelişim kariyer', 'IESU Kariyer'
    $content = $content -replace '(?i)gelisim kariyer', 'IESU Kariyer'
    $content = $content -replace '(?i)gelişim yetenek', 'IESU Yetenek'
    $content = $content -replace '(?i)gelişim platform', 'IESU Platform'
    
    # Very aggressive replacements for lingering Gelişim words 
    # Be careful, but user requested it.
    $content = $content -replace '(?i)\bgelişim\b', 'IESU'
    $content = $content -replace '(?i)\bgelisim\b', 'IESU'
    $content = $content -replace '(?i)\bigu\b', 'IESU'
    $content = $content -replace '(?i)\bıgu\b', 'IESU'
    $content = $content -replace '(?i)\bıgü\b', 'IESU'
    $content = $content -replace '(?i)\bİGÜ\b', 'IESU'

    # URLs and Emails
    $content = $content -replace 'gelisim\.edu\.tr', 'iesu.edu.tr'
    
    if ($content -cne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8
        Write-Host "Scrubbed Gelisim info in: $($file.Name)"
    }
}

Write-Host "Aggressive scrubbing complete!"
