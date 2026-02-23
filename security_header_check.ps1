# Hier die Bild-URL aus deinem Report einfügen
$url = "https://powerstation-finder.de/powerstation-test/allpowers-s200?_rsc=vm5dr"


# Führt eine HEAD-Anfrage aus (lädt nur die Header, nicht das ganze Bild)
try {
    $response = Invoke-WebRequest -Uri $url -Method Head -ErrorAction Stop
    
    Write-Host "`n--- Security Header Check ---" -ForegroundColor Cyan
    Write-Host "URL: $url`n"
    
    # Liste der relevanten Header, die im Crawler bemängelt wurden
    $headersToCheck = @(
        "X-Content-Type-Options",
        "X-Frame-Options",
        "X-XSS-Protection",
        "Referrer-Policy",
        "Content-Security-Policy"
    )

    foreach ($h in $headersToCheck) {
        $value = $response.Headers[$h]
        if ($value) {
            Write-Host "[OK] $h : " -NoNewline -ForegroundColor Green
            Write-Host $value
        } else {
            Write-Host "[FEHLT] $h" -ForegroundColor Red
        }
    }
} catch {
    Write-Host "Fehler beim Abrufen der URL: $_" -ForegroundColor Red
}