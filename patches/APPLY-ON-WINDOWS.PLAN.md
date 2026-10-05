# Apply ALL-P0 on Windows (PLAN ONLY — do not run from agent)

Project: `C:\Users\celil\.gemini\antigravity\scratch\IESU_Kariyer_Platformu_Active`  
Patch: copy `patches/ALL-P0.diff` + `ALL-P0.FILES.txt` from the box package.

## Preconditions
1. **Backup first** (required): timestamped folder of every path in `ALL-P0.FILES.txt`.
2. Confirm freshness: Windows tree has drifted vs `_orig` on some files (esp. Register / analytics). Re-diff or three-way merge if needed.
3. Repo has `.git` — prefer `git apply` so you can `git checkout -- .` to undo.
4. **Before deploying firestore.rules**: set admin custom claim (`ADMIN-CLAIMS.PLAN.md`) or admins lock out.

## Safe apply steps
```powershell
$root = 'C:\Users\celil\.gemini\antigravity\scratch\IESU_Kariyer_Platformu_Active'
$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$backup = Join-Path $root "_patch_backup_$stamp"
New-Item -ItemType Directory -Path $backup | Out-Null
$files = Get-Content (Join-Path $root 'patches\ALL-P0.FILES.txt')  # after copying patches in
foreach ($rel in $files) {
  $src = Join-Path $root ($rel -replace '/','\')
  if (Test-Path $src) {
    $dest = Join-Path $backup ($rel -replace '/','\')
    New-Item -ItemType Directory -Force -Path (Split-Path $dest) | Out-Null
    Copy-Item -LiteralPath $src -Destination $dest -Force
  }
}
# Copy ALL-P0.diff into repo root, then:
cd $root
git apply --check patches\ALL-P0.diff
if ($LASTEXITCODE -ne 0) { throw 'git apply --check failed — abort' }
git apply patches\ALL-P0.diff
```

### If `git apply` fails (CRLF / drift)
- Convert patch or use **file copy** from a box export zip of the 30 patched files over the backup set.
- Or apply per-file: `git apply --include=src/components/Login.jsx ...`

### After apply
- `npm test` / `npm run build`
- Do **not** deploy rules until admin claim bootstrap
- Review `S3-RULES-BREAKAGE.md`

## Rollback
```powershell
# From backup folder
Copy-Item -Recurse -Force "$backup\*" $root
# or: git checkout -- .
```
