$source = 'C:\Users\celil\.gemini\antigravity\scratch\Gelisim_Kariyer\src'
$dest = 'C:\Users\celil\.gemini\antigravity\scratch\IESU_Kariyer_Platformu\src'

$foldersToCopy = @('components', 'store', 'utils', 'lib', 'services')
$filesToCopy = @('App.jsx', 'main.jsx', 'index.css', 'App.css')

# 1. Copy Folders
foreach ($folder in $foldersToCopy) {
    $srcPath = Join-Path $source $folder
    $destPath = Join-Path $dest $folder
    if (Test-Path $srcPath) {
        Copy-Item -Path "$srcPath\*" -Destination $destPath -Recurse -Force
        Write-Host "Copied folder: $folder"
    }
}

# 2. Copy Files
foreach ($file in $filesToCopy) {
    $srcPath = Join-Path $source $file
    $destPath = Join-Path $dest $file
    if (Test-Path $srcPath) {
        Copy-Item -Path $srcPath -Destination $destPath -Force
        Write-Host "Copied file: $file"
    }
}

# 3. Replace Text in .jsx, .js, .css files (Excluding data folder)
$filesToProcess = Get-ChildItem -Path $dest -Include *.jsx,*.js,*.css -Recurse | Where-Object { $_.FullName -notmatch '\\data\\' }

foreach ($file in $filesToProcess) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content

    $content = $content -replace '(?i)Gelişim Üniversitesi', 'IESU'
    $content = $content -replace '(?i)Gelisim Üniversitesi', 'IESU'
    $content = $content -replace '(?i)Gelişim Kariyer', 'IESU Kariyer'
    $content = $content -replace '(?i)Gelisim Kariyer', 'IESU Kariyer'
    $content = $content -replace '(?i)Gelişim Yetenek', 'IESU Yetenek'
    $content = $content -replace '(?i)Gelişim Platform', 'IESU Platform'
    $content = $content -replace '(?i)\bIGU\b', 'IESU'
    $content = $content -replace '(?i)\bİGÜ\b', 'IESU'
    
    if ($content -cne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8
        Write-Host "Replaced text in: $($file.Name)"
    }
}

Write-Host "Sync and Replace Complete!"
