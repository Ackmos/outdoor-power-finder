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
    Write-Host "`n>>> Starte Enrichment fuer: $brand $name" -ForegroundColor White

    # 1. Suche nach dem perfekten THUMBNAIL (Transparent/PNG)
    $thumbQuery = "$brand $name powerstation official product transparent background png -sketch -vector -drawing -schematic"
    $thumbRes = Invoke-RestMethod -Uri "https://google.serper.dev/images" -Method Post -Body (@{q=$thumbQuery; num=1} | ConvertTo-Json) -Headers $serperHeaders
    $foundThumbnail = $thumbRes.images[0].imageUrl

    # 2. Suche nach GALERIE-BILDERN (Details/Anschluesse)
    $galleryQuery = "$brand $name powerstation ports connectors details -drawing -schematic -sketch -vector"
    $galleryRes = Invoke-RestMethod -Uri "https://google.serper.dev/images" -Method Post -Body (@{q=$galleryQuery; num=5} | ConvertTo-Json) -Headers $serperHeaders
    $foundGallery = New-Object System.Collections.Generic.List[string]
    foreach($img in $galleryRes.images) { $foundGallery.Add($img.imageUrl) }

    # --- SERVER UPDATE ---
    if ($foundThumbnail) {
        $payload = @{ 
            id = $id
            thumbnailUrl = $foundThumbnail
            galleryUrls = @($foundGallery) 
        } | ConvertTo-Json -Depth 10

        try {
            Invoke-RestMethod -Uri "$serverUrl/api/enrich/image" -Method Post -Body $payload -Headers $authHeaders -ContentType "application/json"
            Write-Host "    [SUCCESS] Thumbnail und $($foundGallery.Count) Galerie-Bilder gesendet." -ForegroundColor Green
        } catch {
            Write-Host "    [ERROR] Server-Fehler bei $name" -ForegroundColor Red
        }
    }
    Start-Sleep -Seconds 1
}