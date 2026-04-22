# scan.ps1 - Ultimate Compact Scanner
# Output: C:\Crawler\scan_[Folder]_[Date].txt

$TargetDir = Get-Location
$TargetPath = $TargetDir.Path
$OutputRoot = "C:\Crawler"
$FolderName = Split-Path $TargetPath -Leaf
$DateStamp = Get-Date -Format "yyyyMMdd_HHmmss"
$FileName = "scan_${FolderName}_${DateStamp}.txt"
$FullPath = Join-Path $OutputRoot $FileName

# 1. Ensure Output Directory
if (-not (Test-Path $OutputRoot)) { New-Item -ItemType Directory -Force -Path $OutputRoot | Out-Null }

Write-Host "[START] Scanning: $FolderName" -ForegroundColor Cyan

# 2. Define Folders to IGNORE (Saves massive space)
$ExcludeDirs = @("node_modules", ".git", "vendor", "dist", "build", ".next", "obj", "bin")

# 3. Get Files (Excluding junk folders)
$Files = Get-ChildItem -Path $TargetPath -Recurse -File -ErrorAction SilentlyContinue | 
         Where-Object { 
             $True 
             foreach ($ex in $ExcludeDirs) { 
                 if ($_.FullName -like "*\$ex\*") { return $False } 
             } 
             return $True 
         }

# 4. Build Report
$Content = @()
$Content += "SUPREME SCAN REPORT | $FolderName | $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
$Content += "--------------------------------------------------"
$Content += ("{0,-50} | {1,-20} | {2,10}" -f "FILE", "FOLDER", "BYTES")
$Content += "--------------------------------------------------"

$TotalSize = 0
$Count = 0

foreach ($File in $Files) {
    $RelPath = $File.FullName.Substring($TargetPath.Length).TrimStart('\')
    $Parent = $File.DirectoryName.Substring($TargetPath.Length).TrimStart('\')
    if ([string]::IsNullOrWhiteSpace($Parent)) { $Parent = "(Root)" }
    
    # Compact Line
    $Line = ("{0,-50} | {1,-20} | {2,10}" -f $RelPath, $Parent, $File.Length)
    $Content += $Line
    
    $TotalSize += $File.Length
    $Count++
}

# 5. Add Summary
$Content += "--------------------------------------------------"
$Content += "TOTAL FILES: $Count"
$Content += "TOTAL SIZE:  $($TotalSize / 1MB) MB"
$Content += "--------------------------------------------------"

# 6. Save
$Content | Out-File -FilePath $FullPath -Encoding utf8

Write-Host "[DONE] Saved to: $FullPath" -ForegroundColor Green
Write-Host "[STATS] Files: $Count | Size: $('{0:N2}' -f ($TotalSize / 1MB)) MB" -ForegroundColor Yellow