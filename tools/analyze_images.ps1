# Analyze image file sizes and provide optimization recommendations
# Usage: .\analyze_images.ps1

$imagePath = ".\images"
$totalSize = 0
$images = @()

Write-Host "==================== IMAGE ANALYSIS REPORT ====================" -ForegroundColor Cyan
Write-Host ""

# Get all image files and calculate sizes
Get-ChildItem -Path $imagePath -Include @("*.jpg", "*.jpeg", "*.png", "*.gif", "*.webp") -Recurse | ForEach-Object {
    $size = $_.Length
    $sizeKB = [math]::Round($size / 1024, 2)
    $totalSize += $size
    
    $images += @{
        Name = $_.Name
        Path = $_.FullName
        Size = $size
        SizeKB = $sizeKB
    }
}

# Sort by size (largest first)
$images = $images | Sort-Object Size -Descending

# Display results
Write-Host "Files sorted by size (largest first):" -ForegroundColor Yellow
Write-Host ""

$images | ForEach-Object {
    $color = "White"
    if ($_.SizeKB -gt 500) { $color = "Red" }
    elseif ($_.SizeKB -gt 300) { $color = "DarkYellow" }
    elseif ($_.SizeKB -gt 100) { $color = "Yellow" }
    
    Write-Host ("{0:N2} KB - {1}" -f $_.SizeKB, $_.Name) -ForegroundColor $color
}

Write-Host ""
Write-Host "==================== SUMMARY ====================" -ForegroundColor Cyan
Write-Host ("Total images: {0}" -f $images.Count)
Write-Host ("Total size: {0:N2} KB ({1:N2} MB)" -f ($totalSize / 1024), ($totalSize / 1024 / 1024))
Write-Host ""
Write-Host "RECOMMENDATIONS:" -ForegroundColor Green
Write-Host "• Files over 500 KB should be compressed with an image optimizer (e.g., TinyPNG, ImageOptim, or ffmpeg)"
Write-Host "• Consider using WebP format for modern browsers, with JPG fallback for older browsers"
Write-Host "• Hero images can stay larger, but gallery images should ideally be under 200 KB"
Write-Host "• Ensure responsive images use different sizes for mobile/tablet/desktop"
Write-Host ""
Write-Host "NEXT STEPS TO OPTIMIZE:" -ForegroundColor Green
Write-Host "1. Use an online tool like https://tinypng.com or https://imageoptim.com"
Write-Host "2. Compress PNG/JPG files to reduce file size by 30-70%"
Write-Host "3. Consider converting large images to WebP format for 25-35% additional savings"
Write-Host "4. Update src attributes to use optimized versions"
Write-Host ""
