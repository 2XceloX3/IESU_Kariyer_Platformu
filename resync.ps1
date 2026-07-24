$source = 'C:\Users\celil\.gemini\antigravity\scratch\Gelisim_Kariyer\src'
$dest = 'C:\Users\celil\.gemini\antigravity\scratch\IESU_Kariyer_Platformu\src'

Get-ChildItem -Path $source -Recurse | Where-Object { 
    $_.FullName -notmatch '\\data\\' -and 
    $_.Name -notmatch 'mockData.js' -and 
    $_.Name -notmatch 'universityData.js' -and 
    $_.Name -notmatch 'innerPagesData.js' 
} | ForEach-Object { 
    $destPath = $_.FullName -replace [regex]::Escape($source), $dest
    if ($_.PSIsContainer) { 
        if (-not (Test-Path $destPath)) { 
            New-Item -ItemType Directory -Path $destPath | Out-Null
        } 
    } else { 
        Copy-Item -Path $_.FullName -Destination $destPath -Force 
    } 
}
