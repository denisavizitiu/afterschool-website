# Lightweight HTML checks using PowerShell (no external deps)
$root = Get-Location
$files = Get-ChildItem -Path $root -Filter *.html | Sort-Object Name
if (-not $files) { Write-Output "No HTML files found in workspace root."; exit 1 }

function CountMatches($text, $pattern) {
    return ([regex]::Matches($text, $pattern)).Count
}

Write-Output "`nHTML Validation Report (basic checks - PowerShell)"
Write-Output "===========================================`n"

$any = $false
foreach ($f in $files) {
    $text = Get-Content -Raw -Path $f.FullName
    Write-Output "File: $($f.Name)"
    $issues = @()

    if ($text -notmatch '^(?si)\s*<!doctype html') { $issues += 'Missing or non-HTML5 DOCTYPE' }

    if ($text -match '(?si)<html([^>]*)>') {
        $attrs = $matches[1]
        if ($attrs -notmatch 'lang\s*=') { $issues += '<html> tag missing lang attribute' }
    } else {
        $issues += 'Missing <html> tag'
    }

    if ($text -match 'style\s*=') { $issues += 'Contains inline style attributes' }

    if ($text -match '(?si)<p[^>]*>\s*<ul') { $issues += 'Found <p> that contains a <ul> (invalid nesting)' }

    # duplicate ids
    $idMatches = [regex]::Matches($text, 'id\s*=\s*"([^"]+)"') | ForEach-Object { $_.Groups[1].Value }
    $dups = $idMatches | Group-Object | Where-Object { $_.Count -gt 1 } | Select-Object -ExpandProperty Name
    if ($dups) { $issues += "Duplicate id values: $($dups -join ', ')" }

    # simple tag count mismatches (best-effort)
    $tags = [regex]::Matches($text, '(?si)<\s*([a-z0-9]+)') | ForEach-Object { $_.Groups[1].Value } | Select-Object -Unique
    $void = 'area base br col embed hr img input link meta param source track wbr'.Split()
    foreach ($t in $tags) {
        if ($void -contains $t) { continue }
        $open = CountMatches $text "(?si)<\s*$t(\s|>)"
        $close = CountMatches $text "(?si)</\s*$t\s*>"
        if ($open -ne $close) { $issues += "Tag count mismatch for <$t>: opens=$open closes=$close" }
    }

    if ($issues.Count -eq 0) {
        Write-Output '  OK — no issues found'
    } else {
        $any = $true
        foreach ($it in $issues) { Write-Output "  - $it" }
    }
    Write-Output ""
}

if ($any) { Write-Output 'Summary: Issues found. Review files above.'; exit 2 } else { Write-Output 'Summary: No issues found by this basic validator.'; exit 0 }
