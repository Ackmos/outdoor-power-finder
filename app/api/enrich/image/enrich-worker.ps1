# --- 1. UMGEBUNGSVARIABLEN LADEN ---
$currentDir = $PSScriptRoot
while ($currentDir -and -not (Test-Path (Join-Path $currentDir ".env"))) {
    $currentDir = Split-Path $currentDir -Parent
}

if ($currentDir) {
    Get-Content (Join-Path $currentDir ".env") | ForEach-Object {
        if ($_ -match '^\s*[^#\s]+=' ) {
            $key, $value = $_.Split('=', 2).Trim()
            $value = $value.Trim('"').Trim("'")
            Set-Variable -Name $key -Value $value -Force
        }
    }
    Write-Host "[OK] Umgebungsvariablen geladen." -ForegroundColor Green
} else {
    Write-Host "[ERR] .env Datei nicht gefunden!" -ForegroundColor Red
    return
}

# --- enrich-worker.ps1 ---
# (Umgebungsvariablen-Check bleibt wie gehabt)

# --- KONFIGURATION ---
$serverUrl = "http://localhost:3000"
$authHeaders = @{ "Authorization" = "Bearer $ENRICH_TOKEN" }
$serperHeaders = @{ "X-API-KEY" = $SERPER_API_KEY; "Content-Type" = "application/json" }

# --- TODO LISTE HOLEN ---
$todoList = Invoke-RestMethod -Uri "$serverUrl/api/internal/todo-images" -Headers $authHeaders -Method Get

foreach ($station in $todoList) {
    $id = $station.id
    $name = $station.name
    $brand = $station.brand.name
    $needed = $station.missingCount # Der Wert von der neuen API

    Write-Host "`n>>> Enrichment fuer: $brand $name ($($station.currentCount)/5 Bildern)" -ForegroundColor White
    Write-Host "    Benötige noch $needed Bilder..." -ForegroundColor Gray

    # 1. Nur wenn gar kein Thumbnail da ist (currentCount ist 0), suchen wir eines
    $foundThumbnail = $null
    if ($station.currentCount -eq 0) {
        $thumbQuery = "$brand $name powerstation official product png"
        $thumbRes = Invoke-RestMethod -Uri "https://google.serper.dev/images" -Method Post -Body (@{q=$thumbQuery; num=1} | ConvertTo-Json) -Headers $serperHeaders
        $foundThumbnail = $thumbRes.images[0].imageUrl
    }

    # 2. Suche nach der EXAKTEN Anzahl fehlender Galerie-Bilder
    $galleryQuery = "$brand $name powerstation features details"
    $galleryRes = Invoke-RestMethod -Uri "https://google.serper.dev/images" -Method Post -Body (@{q=$galleryQuery; num=$needed} | ConvertTo-Json) -Headers $serperHeaders
    
    $foundGallery = New-Object System.Collections.Generic.List[string]
    foreach($img in $galleryRes.images) { $foundGallery.Add($img.imageUrl) }

    # --- SERVER UPDATE ---
    $payload = @{ 
        id = $id
        thumbnailUrl = $foundThumbnail
        galleryUrls = @($foundGallery) 
        append = $true # Ein Signal an die API: "Bitte hinzufügen, nicht löschen"
    } | ConvertTo-Json -Depth 10

    Invoke-RestMethod -Uri "$serverUrl/api/enrich/image" -Method Post -Body $payload -Headers $authHeaders -ContentType "application/json"
    Write-Host "    [OK] $needed neue Bilder zur Warteschlange hinzugefügt." -ForegroundColor Green
    
    Start-Sleep -Seconds 1
}