Write-Host "wglEngine - Jaume Pla Ferriol 2024" -ForegroundColor Gray
# Check if Python is installed
$python = Get-Command python -ErrorAction SilentlyContinue
if (-not $python) {
    Write-Host "Python is not installed. Please install Python to continue."
    exit 1
}

# Start the HTTP server
Start-Process -NoNewWindow -FilePath "python" -ArgumentList "-m http.server 8000"
Write-Host "... Setting up server ..." -ForegroundColor Green
# Explain controls to user
Write-Host "Controls:" -ForegroundColor DarkBlue
Write-Host "    Movement:" -ForegroundColor Blue
Write-Host "      W - Move Forward" -ForegroundColor Cyan
Write-Host "      A - Move Left" -ForegroundColor Cyan
Write-Host "      S - Move Backward" -ForegroundColor Cyan
Write-Host "      D - Move Right" -ForegroundColor Cyan
Write-Host "      Space - Move Up" -ForegroundColor Cyan
Write-Host "      Q - Move Down" -ForegroundColor Cyan
Write-Host "      Shift - Sprint" -ForegroundColor Cyan
Write-Host "      Scroll wheel to adjust speed" -ForegroundColor Cyan
Write-Host "    Look:" -ForegroundColor Blue
Write-Host "      Click on the canvas to lock the mouse pointer" -ForegroundColor Cyan
Write-Host "      Move the mouse to look around" -ForegroundColor Cyan
Write-Host "      Press ESC to unlock the mouse pointer" -ForegroundColor Cyan
Write-Host "    Rendering:" -ForegroundColor Blue
Write-Host "      1: Draw mode Triangles" -ForegroundColor Cyan
Write-Host "      2: Draw mode Lines" -ForegroundColor Cyan
Write-Host "      3: Draw mode Points" -ForegroundColor Cyan
Write-Host "      4: Draw mode Triangles+Wireframe" -ForegroundColor Cyan
Write-Host "      5: Draw mode Triangles+Points" -ForegroundColor Cyan
Write-Host "      6: Draw mode Triangles+Lines+Points" -ForegroundColor Cyan
Write-Host "      7: Draw mode Normal visualization" -ForegroundColor Cyan
# Wait a moment to ensure the server starts
Start-Sleep -Seconds 2
Write-Host "... Opening webGL2 engine in your browser ... Keep this window open ..." -ForegroundColor Green

# Open the default browser to the specified URL
Start-Process "http://localhost:8000/baseScene.html" #change for final scene file
