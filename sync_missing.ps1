$source = 'C:\Users\celil\.gemini\antigravity\scratch\Gelisim_Kariyer\src'
$dest = 'C:\Users\celil\.gemini\antigravity\scratch\IESU_Kariyer_Platformu\src'

Get-ChildItem -Path $source -Recurse -File | ForEach-Object {
    $destPath = $_.FullName.Replace($source, $dest)
    if (-not (Test-Path $destPath)) {
        $destDir = Split-Path $destPath
        if (-not (Test-Path $destDir)) {
            New-Item -ItemType Directory -Force -Path $destDir | Out-Null
        }
        Copy-Item $_.FullName -Destination $destPath
        Write-Host "Copied: $destPath"
    }
}
