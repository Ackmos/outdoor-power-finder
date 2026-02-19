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

# --- 2. KONFIGURATION ---
$serverUrl = "http://localhost:3000"
$minWidth  = 800   # Mindestbreite
$maxImages = 5     # Maximale Bilder pro Gerät

$serperHeaders = @{ 
    "X-API-KEY"    = $SERPER_API_KEY
    "Content-Type" = "application/json"
}
$authHeaders = @{ "Authorization" = "Bearer $ENRICH_TOKEN" }

# --- 3. TODO LISTE HOLEN ---
Write-Host "`n--- Suche Powerstations ohne Bilder ---" -ForegroundColor Cyan
try {
    $todoList = Invoke-RestMethod -Uri "$serverUrl/api/internal/todo-images" -Headers $authHeaders -Method Get
} catch {
    Write-Host "Fehler beim Abrufen der Liste: $($_.Exception.Message)" -ForegroundColor Red
    return
}

if ($null -eq $todoList -or $todoList.Count -eq 0) {
    Write-Host "Alles erledigt! Keine Eintraege gefunden." -ForegroundColor Green
    return
}

# --- 4. VERARBEITUNG ---
foreach ($station in $todoList) {
    $id   = $station.id
    $name = $station.name
    $brand = if ($station.brand -and $station.brand.name) { $station.brand.name } else { "" }

    $foundUrls = New-Object System.Collections.Generic.List[string]
    Write-Host "`n>>> Starte Enrichment fuer: $brand $name" -ForegroundColor White

    $queries = @(
        "$brand $name powerstation official product",
        "$brand $name ports connectors details"
    )

    foreach ($q in $queries) {
        $cleanQuery = $q.Trim()
        try {
            $body = @{ q = $cleanQuery; num = 10 } | ConvertTo-Json
            $res  = Invoke-RestMethod -Uri "https://google.serper.dev/images" -Method Post -Body $body -Headers $serperHeaders
            
            if ($res.images) {
                foreach ($img in $res.images) {
                    # KORREKTUR: Serper nutzt 'imageWidth' statt 'width'
                    $imgWidth = 0
                    if ($img.imageWidth) { $imgWidth = [int]$img.imageWidth }

                    if ($imgWidth -ge $minWidth -and $foundUrls.Count -lt $maxImages) {
                        if (-not $foundUrls.Contains($img.imageUrl)) {
                            $foundUrls.Add($img.imageUrl)
                        }
                    }
                }
            }
        } catch { 
            Write-Host "    Search-Error: $($_.Exception.Message)" -ForegroundColor Gray 
        }
    }

    Write-Host "    HQ-Bilder gefunden: $($foundUrls.Count)" -ForegroundColor Gray

    # --- 5. SERVER UPDATE ---
    if ($foundUrls.Count -gt 0) {
        $payload = @{ 
            id = $id
            imageUrls = @($foundUrls) 
        } | ConvertTo-Json -Depth 10

        try {
            Invoke-RestMethod -Uri "$serverUrl/api/enrich/image" -Method Post -Body $payload -Headers $authHeaders -ContentType "application/json"
            Write-Host "    [SUCCESS] Galerie gespeichert." -ForegroundColor Green
        } catch {
            Write-Host "    [ERROR] Server-Fehler bei $name" -ForegroundColor Red
        }
    } else {
        Write-Host "    [SKIP] Keine passenden Bilder gefunden." -ForegroundColor Yellow
    }

    Start-Sleep -Seconds 1
}