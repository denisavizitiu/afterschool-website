$files = @('about.html','gradi.html','programs.html')
foreach ($file in $files) {
  if (-not (Test-Path $file)) { Write-Output "File not found: $file"; continue }
  $lines = Get-Content $file
  $stack = @()
  for ($i=0; $i -lt $lines.Count; $i++) {
    $n = $i+1
    $line = $lines[$i]
    # find all opening divs on the line
    $openMatches = [regex]::Matches($line, '<div[^>]*>')
    foreach ($m in $openMatches) { $stack += ($n.ToString() + ': ' + ($m.Value.Trim())) }

    $closeMatches = [regex]::Matches($line, '</div>')
    foreach ($m in $closeMatches) {
      if ($stack.Count -gt 0) { $stack = $stack[0..($stack.Count-2)] } else { Write-Output "Unmatched closing </div> in $file at line $n" }
    }
  }
  Write-Output "\n$file - unclosed <div> count: $($stack.Count)"
  foreach ($s in $stack) { Write-Output "  opened at L$s.line: $s.text" }
}