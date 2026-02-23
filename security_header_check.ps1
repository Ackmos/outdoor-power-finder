# Hier die Bild-URL aus deinem Report einfügen
$url = "https://powerstation-finder.de/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fdw8mkffls%2Fimage%2Fupload%2Ff_auto%2Cq_auto%2Cc_pad%2Cb_white%2Cw_600%2Ch_450%2Fv1771702041%2Fpowerstations%2Fallpowers%2Fs200%2Fs200-gallery-1.jpg&w=640&q=75"


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