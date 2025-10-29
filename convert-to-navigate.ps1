# PowerShell script to convert useHistory to useNavigate in React Router v7
# This script converts all occurrences of useHistory to useNavigate

$frontendSrc = "c:\dev\ecommerce-fullstack-app\frontend\src"
$files = @()

# Get all .jsx and .js files that contain useHistory
Get-ChildItem -Path $frontendSrc -Recurse -Include *.jsx,*.js | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    if ($content -match "useHistory") {
        $files += $_.FullName
    }
}

Write-Host "Found $($files.Count) files to convert`n"

$convertedCount = 0

foreach ($file in $files) {
    Write-Host "Processing: $file"

    $content = Get-Content $file -Raw
    $original = $content

    # 1. Replace import statement
    $content = $content -replace 'import\s+\{([^}]*)\buseHistory\b([^}]*)\}\s+from\s+["\']react-router-dom["\']', 'import {$1useNavigate$2} from "react-router-dom"'
    $content = $content -replace ',\s*useHistory\s*,', ', useNavigate,'
    $content = $content -replace ',\s*useHistory\s*\}', ', useNavigate}'
    $content = $content -replace '\{\s*useHistory\s*,', '{ useNavigate,'

    # 2. Replace hook declaration
    $content = $content -replace '\bconst\s+history\s*=\s*useHistory\(\)', 'const navigate = useNavigate()'

    # 3. Replace method calls
    # history.push(path) -> navigate(path)
    $content = $content -replace '\bhistory\.push\(([ ]*["\'][^"\']+["\'][^)]*)\)', 'navigate($1)'

    # history.push(path, state) -> navigate(path, { state })
    $content = $content -replace '\bhistory\.push\(([^,]+),\s*(\{[^}]+\})\)', 'navigate($1, { state: $2 })'
    $content = $content -replace '\bhistory\.push\(([^,]+),\s*\{([^}]+)\}\)', 'navigate($1, { state: {$2} })'

    # history.replace(path) -> navigate(path, { replace: true })
    $content = $content -replace '\bhistory\.replace\(([^,)]+)\)', 'navigate($1, { replace: true })'
    $content = $content -replace '\bhistory\.replace\(([^,]+),\s*(\{[^}]+\})\)', 'navigate($1, { replace: true, state: $2 })'

    # history.goBack() -> navigate(-1)
    $content = $content -replace '\bhistory\.goBack\(\)', 'navigate(-1)'

    # 4. Update useEffect dependencies
    $content = $content -replace '\[([^\]]*)\bhistory\b([^\]]*)\]', '[$1navigate$2]'

    # Only write if content changed
    if ($content -ne $original) {
        Set-Content -Path $file -Value $content -NoNewline
        $convertedCount++
        Write-Host "  ✓ Converted" -ForegroundColor Green
    } else {
        Write-Host "  - No changes needed" -ForegroundColor Yellow
    }
}

Write-Host "`nConversion complete!"
Write-Host "Files converted: $convertedCount / $($files.Count)"
