<#
.SYNOPSIS
    Reorganiza VEXORA de tres niveles a dos niveles sin perder datos ni historial Git.

.DESCRIPCION
    Estado actual (tres niveles):
      C:\docker_moviles\                                   <- nivel 1 (L1)
      C:\docker_moviles\docker_moviles\                    <- nivel 2 (L2, repo Git + .freebuff)
      C:\docker_moviles\docker_moviles\docker_moviles\     <- nivel 3 (L3, proyecto real + docker-compose.yml)

    Estado final (dos niveles):
      C:\docker_moviles\                                   <- L2 (repo Git)
      C:\docker_moviles\docker_moviles\                    <- L3 (proyecto real)

    Solo se hacen DOS movimientos en el mismo volumen (no hay copia de datos):
      1) C:\docker_moviles                -> C:\vexora_old
      2) C:\vexora_old\docker_moviles     -> C:\docker_moviles

    El respaldo C:\docker_moviles\docker_moviles_respaldo NO se toca: queda en
    C:\vexora_old\docker_moviles_respaldo.

.MODO DE USO
    # 1. Revision sin cambios (solo lecturas):
    powershell -NoProfile -ExecutionPolicy Bypass -File .\reorganizar-vexora.ps1

    # 2. Ejecucion real (pide confirmacion escrita):
    powershell -NoProfile -ExecutionPolicy Bypass -File .\reorganizar-vexora.ps1 -Execute

    # 3. Reversion manual:
    powershell -NoProfile -ExecutionPolicy Bypass -File .\reorganizar-vexora.ps1 -Rollback

    # 4. Ejecucion sin pregunta interactiva (solo si ya se autorizo):
    ... -Execute -Force

.LINEA BASE OBLIGATORIA (estado real medido el 2026-11-24)
    HEAD              05294bf
    Rama              main
    git status        196 filas (166 modificadas / 30 no rastreadas)
    MD5 del status    DFA7549CAEF7FC66EA1BBA12BC9572AD
    directus_files    2

    Cualquier diferencia detiene el script ANTES de tocar nada. Si el arbol
    cambia de forma esperada y revisada, se pueden ajustar con -ExpectedHead,
    -ExpectedBranch, -ExpectedStatusHash, -ExpectedModified, -ExpectedUntracked.

.GARANTIAS
    - Nunca usa "docker compose down -v", "docker volume prune", "git reset --hard"
      ni "git clean": los cinco volumenes vexora_* y los cinco docker_moviles_*
      antiguos se conservan.
    - Los movimientos usan [System.IO.Directory]::Move, que falla si el destino
      ya existe: no puede sobrescribir ni anidar carpetas.
    - Si falla cualquier paso posterior a "docker compose down" (primer movimiento,
      segundo movimiento, "up -d" o cualquier verificacion) se revierte solo.
    - Verifica conexion real a MariaDB (consulta de conteos), la evidencia por API
      con bytes y MD5 identicos, los volumenes y el respaldo.
    - No modifica documentacion, .env, credenciales, permisos, RLS, esquema ni
      datos originales: solo renombra directorios y recrea contenedores.

.NOTAS
    - Al terminar, la ruta de este script pasa a ser:
        C:\docker_moviles\docker_moviles\reorganizar-vexora.ps1
#>

[CmdletBinding()]
param(
    [switch]$Execute,
    [switch]$Rollback,
    [switch]$Force,
    [string]$ExpectedHead         = '05294bf',
    [string]$ExpectedBranch       = 'main',
    [string]$ExpectedStatusHash   = 'DFA7549CAEF7FC66EA1BBA12BC9572AD',
    [int]$ExpectedModified        = 166,
    [int]$ExpectedUntracked       = 30,
    [int]$ExpectedStatusRows      = 196
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

# ---------------------------------------------------------------- rutas fijas
$Root           = 'C:\docker_moviles'
$RepoOld        = 'C:\docker_moviles\docker_moviles'
$ProjectOld     = 'C:\docker_moviles\docker_moviles\docker_moviles'
$Parking        = 'C:\vexora_old'
$RepoNew        = 'C:\docker_moviles'
$ProjectNew     = 'C:\docker_moviles\docker_moviles'
$ComposeOld     = Join-Path $ProjectOld 'docker-compose.yml'
$ComposeNew     = Join-Path $ProjectNew 'docker-compose.yml'
$BackupDir      = 'C:\vexora_old\docker_moviles_respaldo'
$CurrentBackup  = 'C:\docker_moviles\docker_moviles_respaldo'

$ExpectedVolumes = @(
    'vexora_mariadb_data',
    'vexora_directus_uploads',
    'vexora_directus_extensions',
    'vexora_cloudbeaver_data',
    'vexora_ionic_node_modules'
)

$ExpectedLegacyVolumes = @(
    'docker_moviles_mariadb_data',
    'docker_moviles_directus_uploads',
    'docker_moviles_directus_extensions',
    'docker_moviles_cloudbeaver_data',
    'docker_moviles_ionic_node_modules'
)

$ExpectedFiles         = 2
$EvidenceAssetId       = '45fed52e-aa65-4a94-82d6-f2e90355510a'
$EvidenceAssetBytes    = 728842
$ApiBase               = 'http://localhost:8000'

$script:GitBaseline       = $null
$script:DbBaseline        = $null
$script:EvidenceBaseline  = $null
$script:VolumesBaseline   = $null
$script:BackupBaseline    = $null
$script:ProtectedBaseline = $null
$script:DownAttempted     = $false
$script:LastComposePath  = $null

# ------------------------------------------------------------------- helpers
function Write-Step([string]$Text) {
    Write-Host ''
    Write-Host "== $Text" -ForegroundColor Cyan
}

function Write-Ok([string]$Text) {
    Write-Host "   OK   $Text" -ForegroundColor Green
}

function Write-Warn([string]$Text) {
    Write-Host "   AVISO $Text" -ForegroundColor Yellow
}

function Assert-True([bool]$Condition, [string]$Message) {
    if (-not $Condition) { throw $Message }
    Write-Ok $Message
}

function Invoke-Compose {
    param([string]$ComposeFile, [string[]]$ComposeArgs)
    $script:LastComposePath = $ComposeFile
    & docker compose -f $ComposeFile --project-name vexora @ComposeArgs
    if ($LASTEXITCODE -ne 0) {
        throw "docker compose $($ComposeArgs -join ' ') fallo con exit $LASTEXITCODE"
    }
}

function Invoke-SafeDirectoryMove {
    <#  Mueve un directorio en el mismo volumen.
        Rechaza movimientos que pudieran sobrescribir, anidar o perder datos.  #>
    param([string]$Source, [string]$Destination)

    Assert-True (Test-Path -LiteralPath $Source) "Origen presente: $Source"
    Assert-True (-not (Test-Path -LiteralPath $Destination)) "Destino libre (no existe): $Destination"

    $parent = Split-Path -Parent $Destination
    Assert-True (Test-Path -LiteralPath $parent) "Carpeta contenedora del destino existe: $parent"

    # Directory.Move falla con IOException si el destino ya existe: nunca sobrescribe.
    [System.IO.Directory]::Move($Source, $Destination)

    Assert-True (Test-Path -LiteralPath $Destination) "Movimiento aplicado: $Source -> $Destination"
    Assert-True (-not (Test-Path -LiteralPath $Source)) "El origen ya no existe: $Source"
}

function Get-GitSnapshot {
    param([string]$RepoPath)

    if (-not (Test-Path (Join-Path $RepoPath '.git'))) {
        throw "No hay repositorio Git en $RepoPath"
    }
    if (Test-Path (Join-Path $RepoPath '.git\index.lock')) {
        throw "Existe $RepoPath\.git\index.lock; cierra Git/IDE y elimina el lock antes de continuar"
    }

    $head = (& git -C $RepoPath rev-parse --short HEAD).Trim()
    if ($LASTEXITCODE -ne 0) { throw "git rev-parse HEAD fallo en $RepoPath" }

    $branch = (& git -C $RepoPath rev-parse --abbrev-ref HEAD).Trim()
    if ($LASTEXITCODE -ne 0) { throw "git rev-parse --abbrev-ref fallo en $RepoPath" }

    $statusLines = @(& git -C $RepoPath status --porcelain)
    if ($LASTEXITCODE -ne 0) { throw "git status fallo en $RepoPath" }

    # Ojo: '?' es comodin en -like; se compara el prefijo literal "?? " de porcelain.
    $untracked = @($statusLines | Where-Object { $_.StartsWith('?? ') })
    $modified  = @($statusLines | Where-Object { -not $_.StartsWith('?? ') })
    $deleted   = @($modified | Where-Object { $_ -match '^( D|D |AD|MD)' })

    $statusText = ($statusLines -join "`n")
    $hash = [System.BitConverter]::ToString(
        [System.Security.Cryptography.MD5]::Create().ComputeHash(
            [System.Text.Encoding]::UTF8.GetBytes($statusText)
        )
    ) -replace '-', ''

    [pscustomobject]@{
        Head       = $head
        Branch     = $branch
        StatusHash = $hash
        StatusRows = $statusLines.Count
        Modified   = $modified.Count
        Untracked  = $untracked.Count
        Deleted    = $deleted.Count
    }
}

function Assert-GitBaseline($Snapshot, [string]$Label) {
    Assert-True ($Snapshot.Head -eq $ExpectedHead)           "HEAD $Label = $($Snapshot.Head) (esperado $ExpectedHead)"
    Assert-True ($Snapshot.Branch -eq $ExpectedBranch)       "Rama $Label = $($Snapshot.Branch) (esperada $ExpectedBranch)"
    Assert-True ($Snapshot.StatusRows -eq $ExpectedStatusRows) "git status $Label tiene $($Snapshot.StatusRows) filas (esperadas $ExpectedStatusRows)"
    Assert-True ($Snapshot.Modified -eq $ExpectedModified)   "Archivos modificados $Label = $($Snapshot.Modified) (esperados $ExpectedModified)"
    Assert-True ($Snapshot.Untracked -eq $ExpectedUntracked) "Archivos no rastreados $Label = $($Snapshot.Untracked) (esperados $ExpectedUntracked)"
    Assert-True ($Snapshot.StatusHash -eq $ExpectedStatusHash) "MD5 de git status $Label = $($Snapshot.StatusHash) (esperado $ExpectedStatusHash)"
    if ($Snapshot.Deleted -gt 0) {
        Write-Warn "git status incluye $($Snapshot.Deleted) archivo(s) borrado(s) ya existentes; se conservan como estan."
    }
}

function Get-DbSnapshot {
    # El script se envia por stdin: la contrasena la expande sh dentro del
    # contenedor y nunca aparece en la linea de comandos ni en la salida.
    $query = 'SELECT (SELECT COUNT(*) FROM workorders),(SELECT COUNT(*) FROM diagnoses),(SELECT COUNT(*) FROM quotes),(SELECT COUNT(*) FROM quoteitems),(SELECT COUNT(*) FROM quoteparts),(SELECT COUNT(*) FROM evidence),(SELECT COUNT(*) FROM fuels),(SELECT COUNT(*) FROM methods),(SELECT COUNT(*) FROM directus_files);'
    $scriptText = 'mariadb -uroot -p"$MARIADB_ROOT_PASSWORD" workshop -N -B -e "' + $query + '"'
    $raw = @($scriptText | & docker exec -i moviles-db sh)
    if ($LASTEXITCODE -ne 0) { throw "No se pudo consultar la base (exit $LASTEXITCODE)" }
    $line = ($raw | Where-Object { $_ -match '\S' } | Select-Object -First 1)
    if (-not $line) { throw 'La consulta de conteos devolvio vacio' }
    $v = $line -split "`t"
    if ($v.Count -lt 9) { throw "Respuesta inesperada de la base: $line" }
    [pscustomobject]@{
        Workorders = $v[0]
        Diagnoses  = $v[1]
        Quotes     = $v[2]
        QuoteItems = $v[3]
        QuoteParts = $v[4]
        Evidence   = $v[5]
        Fuels      = $v[6]
        Methods    = $v[7]
        Files      = $v[8]
        Text       = $line
    }
}

function Get-DbSnapshotWithRetry([int]$TimeoutSeconds = 180) {
    $deadline = (Get-Date).AddSeconds($TimeoutSeconds)
    $last = $null
    do {
        try { return Get-DbSnapshot } catch { $last = $_.Exception.Message }
        Start-Sleep -Seconds 3
    } while ((Get-Date) -lt $deadline)
    throw "MariaDB no respondio la consulta de conteos en $TimeoutSeconds s. Ultimo error: $last"
}

function Wait-Http([string]$Url, [int]$TimeoutSeconds = 120) {
    $deadline = (Get-Date).AddSeconds($TimeoutSeconds)
    while ((Get-Date) -lt $deadline) {
        try {
            $r = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 10 -MaximumRedirection 5
            if ($r.StatusCode -ge 200 -and $r.StatusCode -lt 400) { return $r.StatusCode }
        } catch {
            Start-Sleep -Seconds 2
        }
    }
    throw "El endpoint $Url no respondio en $TimeoutSeconds s"
}

function Get-AdminToken {
    # Antes del movimiento el .env esta en L3; despues, en la ruta nueva.
    $envPath = $null
    foreach ($candidate in @((Join-Path $ProjectNew '.env'), (Join-Path $ProjectOld '.env'))) {
        if (Test-Path -LiteralPath $candidate) { $envPath = $candidate; break }
    }
    if (-not $envPath) { throw "No existe .env en $ProjectNew ni en $ProjectOld" }

    $map = @{}
    foreach ($l in Get-Content -LiteralPath $envPath) {
        if ($l -match '^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$') {
            $value = $Matches[2].Trim().Trim('"').Trim("'")
            $map[$Matches[1]] = $value
        }
    }
    if (-not $map.ContainsKey('DIRECTUS_ADMIN_EMAIL') -or -not $map.ContainsKey('DIRECTUS_ADMIN_PASSWORD')) {
        throw 'Faltan DIRECTUS_ADMIN_EMAIL / DIRECTUS_ADMIN_PASSWORD en .env'
    }

    $body = @{ email = $map['DIRECTUS_ADMIN_EMAIL']; password = $map['DIRECTUS_ADMIN_PASSWORD'] } | ConvertTo-Json
    $login = Invoke-RestMethod -Uri "$ApiBase/auth/login" -Method Post -ContentType 'application/json' -Body $body -TimeoutSec 20
    if (-not $login.data.access_token) { throw 'Login de administrador sin access_token' }
    return $login.data.access_token
}

function Test-EvidenceAsset {
    param([switch]$Capture)

    $token = Get-AdminToken
    $headers = @{ Authorization = "Bearer $token" }
    $asset = Invoke-WebRequest -Uri "$ApiBase/assets/$EvidenceAssetId" -Headers $headers -UseBasicParsing -TimeoutSec 30

    $bytes = $asset.Content
    if ($bytes -is [string]) {
        $bytes = [System.Text.Encoding]::GetEncoding(28591).GetBytes($bytes)
    }
    $length = [int64]$bytes.Length
    if ($length -ne $EvidenceAssetBytes) {
        throw "Evidencia $EvidenceAssetId mide $length bytes; se esperaban $EvidenceAssetBytes"
    }
    $type = $asset.Headers['Content-Type']
    if ($type -notmatch 'image/png') {
        throw "Evidencia $EvidenceAssetId con Content-Type $type"
    }
    $md5 = [System.BitConverter]::ToString(
        [System.Security.Cryptography.MD5]::Create().ComputeHash($bytes)
    ) -replace '-', ''

    if ($Capture) {
        $script:EvidenceBaseline = $md5
        Write-Ok "Evidencia $EvidenceAssetId (baseline): $length bytes image/png md5 $md5"
        return
    }

    if ($script:EvidenceBaseline) {
        if ($md5 -ne $script:EvidenceBaseline) {
            throw "La evidencia $EvidenceAssetId cambio de contenido: md5 $md5 (baseline $($script:EvidenceBaseline))"
        }
        Write-Ok "Evidencia $EvidenceAssetId intacta: $length bytes image/png md5 $md5 (identico al baseline)"
    } else {
        Write-Ok "Evidencia $EvidenceAssetId responde $length bytes image/png md5 $md5"
    }
}

function Assert-Endpoints {
    $checks = @(
        @{ Url = "$ApiBase/server/health"; Name = 'Directus (8000)' },
        @{ Url = 'http://localhost:8100/'; Name = 'Frontend Ionic (8100)' },
        @{ Url = 'http://localhost:8081/'; Name = 'Swagger (8081)' },
        @{ Url = 'http://localhost:8978/'; Name = 'CloudBeaver (8978)' }
    )
    foreach ($c in $checks) {
        $code = Wait-Http -Url $c.Url -TimeoutSeconds 180
        Write-Ok "$($c.Name) -> HTTP $code"
    }
}

function Assert-Containers {
    $deadline = (Get-Date).AddSeconds(180)
    do {
        $running = @(& docker ps --filter 'name=moviles-' --format '{{.Names}}')
        $healthy = (& docker inspect --format '{{.State.Health.Status}}' moviles-db 2>$null)
        if ($running.Count -ge 5 -and $healthy -eq 'healthy') {
            Write-Ok "5 contenedores arriba y moviles-db healthy: $($running -join ', ')"
            return
        }
        Start-Sleep -Seconds 3
    } while ((Get-Date) -lt $deadline)
    throw "Contenedores no listos. Arriba: $($running -join ', '); salud db: $healthy"
}

function Assert-Volumes([string]$ProjectPath) {
    $present = @(& docker volume ls --format '{{.Name}}')
    foreach ($vol in $ExpectedVolumes) {
        if ($present -notcontains $vol) { throw "Falta el volumen $vol" }
    }
    Write-Ok "Los 5 volumenes vexora_* existen: $($ExpectedVolumes -join ', ')"

    $composePath = Join-Path $ProjectPath 'docker-compose.yml'
    $declared = @(& docker compose -f $composePath config --volumes)
    if ($LASTEXITCODE -ne 0) { throw "docker compose config fallo en $composePath" }
    if ($declared.Count -ne 5) {
        throw "docker-compose.yml declara $($declared.Count) volumenes; se esperaban 5"
    }
    Write-Ok "docker-compose.yml declara exactamente 5 volumenes: $($declared -join ', ')"
}

function Get-VolumeSnapshot { @(& docker volume ls --format '{{.Name}}') }

function Assert-VolumesPreserved {
    $now = Get-VolumeSnapshot
    foreach ($vol in $script:VolumesBaseline) {
        if ($now -notcontains $vol) { throw "El volumen $vol desaparecio durante la reorganizacion" }
    }
    foreach ($vol in $ExpectedVolumes) {
        if ($now -notcontains $vol) { throw "Falta el volumen $vol tras la reorganizacion" }
    }
    foreach ($vol in $ExpectedLegacyVolumes) {
        if ($now -notcontains $vol) { throw "Falta el volumen antiguo $vol" }
    }
    Write-Ok "Volumenes conservados: $($script:VolumesBaseline.Count) previos siguen presentes (incluye los 5 vexora_* y los 5 docker_moviles_*)"
}

function Get-BackupSnapshot([string]$Path) {
    if (-not (Test-Path -LiteralPath $Path)) { throw "No existe la carpeta de respaldo $Path" }
    @(Get-ChildItem -LiteralPath $Path -Force | Sort-Object Name | Select-Object -ExpandProperty Name)
}

function Assert-BackupPreserved {
    $now = Get-BackupSnapshot -Path $BackupDir
    foreach ($name in $script:BackupBaseline) {
        if ($now -notcontains $name) { throw "El respaldo perdio el elemento $name" }
    }
    if ($now -notcontains 'docker-compose.yml') { throw 'El respaldo ya no contiene docker-compose.yml' }
    Write-Ok "Respaldo intacto en $BackupDir ($($now.Count) elementos, todos los previos presentes)"
}

function Get-ProtectedSnapshot([string]$ProjectPath) {
    <#  Huella (ruta relativa + tamano + fecha) de la documentacion y archivos
        sensibles. Si algo se modifica durante el movimiento, cambia la huella.  #>
    $targets = New-Object System.Collections.Generic.List[string]

    foreach ($single in @('ESTADO_VEXORA.md', 'AGENTS.md', 'README.md', 'docker-compose.yml', '.gitignore', '.env', 'directus.config.json')) {
        $p = Join-Path $ProjectPath $single
        if (Test-Path -LiteralPath $p) { $targets.Add($p) }
    }
    foreach ($dir in @('docs', 'pruebas')) {
        $d = Join-Path $ProjectPath $dir
        if (Test-Path -LiteralPath $d) {
            foreach ($f in Get-ChildItem -LiteralPath $d -Recurse -File -Force -ErrorAction SilentlyContinue) {
                $targets.Add($f.FullName)
            }
        }
    }

    $lines = New-Object System.Collections.Generic.List[string]
    foreach ($t in ($targets | Sort-Object)) {
        $i = Get-Item -LiteralPath $t -Force
        $rel = $i.FullName.Substring($ProjectPath.Length).TrimStart('\')
        $lines.Add(('{0}|{1}|{2}' -f $rel, $i.Length, $i.LastWriteTimeUtc.ToString('o')))
    }

    $text = ($lines -join "`n")
    $hash = [System.BitConverter]::ToString(
        [System.Security.Cryptography.MD5]::Create().ComputeHash(
            [System.Text.Encoding]::UTF8.GetBytes($text)
        )
    ) -replace '-', ''

    [pscustomobject]@{ Hash = $hash; Count = $lines.Count }
}

# ------------------------------------------------------------------- rollback
function Invoke-Rollback {
    param([switch]$Automatic)

    Write-Step 'REVERSION'

    Set-Location -LiteralPath 'C:\'

    $parkedRepo   = Join-Path $Parking 'docker_moviles'
    $rootExists   = Test-Path -LiteralPath $Root
    $parkedExists = Test-Path -LiteralPath $parkedRepo
    $threeLevel   = Test-Path -LiteralPath $ComposeOld
    $twoLevel     = (Test-Path -LiteralPath $ComposeNew) -and (-not $threeLevel)

    if (-not $rootExists -and -not $parkedExists) {
        throw "No se reconoce el estado: ni $Root ni $parkedRepo existen. Revisar manualmente antes de continuar."
    }

    if (-not $Automatic -and -not $Force) {
        $answer = Read-Host 'Escribe REVERTIR para restaurar la estructura original'
        if ($answer -ne 'REVERTIR') { throw 'Reversion cancelada por el usuario' }
    }

    try {
        if ($twoLevel) {
        # Movimiento completo hecho: deshacer los dos movimientos.
        if (Test-Path -LiteralPath $ComposeNew) {
            try { Invoke-Compose -ComposeFile $ComposeNew -ComposeArgs @('down') }
            catch {
                # No se oculta el error de Docker: se registra en rojo y se continua
                # para verificar si los contenedores quedaron arriba antes de mover.
                Write-Host "ERROR Docker (down, ruta nueva $ComposeNew): $($_.Exception.Message)" -ForegroundColor Red
                $script:LastComposePath = $ComposeNew
            }
        }
        $stillUp = @(& docker ps --filter 'name=moviles-' --format '{{.Names}}')
        if ($stillUp.Count -gt 0) {
            throw "No se puede revertir con contenedores usando la ruta nueva ($($stillUp -join ', ')). Detenlos con: docker compose -f $ComposeNew down; y repite -Rollback"
        }
        Invoke-SafeDirectoryMove -Source $Root -Destination $parkedRepo
        Invoke-SafeDirectoryMove -Source $Parking -Destination $Root
    }
    elseif ((-not $rootExists) -and $parkedExists) {
        # Primer movimiento hecho, segundo fallido: restaurar el nivel superior.
        Invoke-SafeDirectoryMove -Source $Parking -Destination $Root
    }
    else {
        # Estructura original intacta (fallo antes de mover): solo reanudar servicios.
        Write-Warn 'La estructura original sigue en su sitio; se reanudan los servicios sin mover carpetas.'
    }

    if (-not (Test-Path -LiteralPath $ComposeOld)) { throw "No se encontro $ComposeOld tras revertir" }
    if (-not (Test-Path -LiteralPath $CurrentBackup)) { throw "No se encontro $CurrentBackup tras revertir" }

    Invoke-Compose -ComposeFile $ComposeOld -ComposeArgs @('up', '-d')
    Assert-Containers
    Assert-Endpoints

    $db = Get-DbSnapshotWithRetry
    if ($null -ne $script:DbBaseline) {
        if ($db.Text -ne $script:DbBaseline.Text) {
            throw "Tras revertir, los conteos no coinciden con el baseline: $($db.Text) vs $($script:DbBaseline.Text)"
        }
        Write-Ok "Tras revertir, los conteos coinciden con el baseline: $($db.Text)"
    } else {
        Write-Ok "Base accesible tras revertir: $($db.Text)"
    }

    Write-Ok 'Reversion completada: servicios arriba en la ruta original.'
    } catch {
        Write-Host '' -ForegroundColor Red
        Write-Host "FALLO EN REVERSION: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host 'Contenedores activos:' -ForegroundColor Red
        $active = @(& docker ps --filter 'name=moviles-' --format '{{.Names}}' 2>&1)
        if ($active.Count -gt 0) { $active | ForEach-Object { Write-Host "  $_" -ForegroundColor Red } } else { Write-Host '  (ninguno)' -ForegroundColor Red }
        Write-Host "Ultima ruta de Compose utilizada: $(if ($script:LastComposePath) { $script:LastComposePath } else { '(ninguna)' })" -ForegroundColor Red
        Write-Host 'Estado de rutas (revisar manualmente, no se perdio ningun dato):' -ForegroundColor Red
        foreach ($p in @($Root, $Parking, (Join-Path $Parking 'docker_moviles'), $ComposeOld, $ComposeNew)) {
            Write-Host ("  {0} -> {1}" -f $p, (Test-Path -LiteralPath $p)) -ForegroundColor Red
        }
        throw
    }
}

# ----------------------------------------------------------------------- main
Write-Host 'VEXORA - reorganizacion de carpetas (tres niveles -> dos niveles)' -ForegroundColor White
Set-Location -LiteralPath 'C:\'

if ($Rollback) {
    Invoke-Rollback
    return
}

try {
    # 1. Validacion de rutas y destinos
    Write-Step '1/8 Validacion de rutas y destinos'
    Assert-True (Test-Path $Root)       "Existe $Root"
    Assert-True (Test-Path $RepoOld)    "Existe $RepoOld"
    Assert-True (Test-Path $ProjectOld) "Existe $ProjectOld"
    Assert-True (Test-Path $ComposeOld) "Existe $ComposeOld"
    Assert-True (Test-Path (Join-Path $ProjectOld 'mobile')) 'Existe la carpeta mobile del bind mount'
    Assert-True (Test-Path $CurrentBackup) "Existe el respaldo actual $CurrentBackup"
    Assert-True (-not (Test-Path $Parking)) "El destino temporal $Parking no existe (no se sobrescribe nada)"
    # El repositorio Git real es L2 ($RepoOld), no L1 ($RepoNew), que tiene su propio .git distinto.
    Assert-True (Test-Path (Join-Path $RepoOld '.git')) "El repositorio Git real esta en $RepoOld"
    # El proyecto real no debe estar ya en la ruta que ocupara el nuevo repositorio ($RepoNew).
    Assert-True (-not (Test-Path (Join-Path $RepoNew 'docker-compose.yml'))) "El futuro repositorio $RepoNew no contiene ya el proyecto (docker-compose.yml)"
    Assert-True (-not (Test-Path (Join-Path $RepoNew 'mobile'))) "El futuro repositorio $RepoNew no contiene ya la carpeta mobile"
    # No debe existir index.lock en el .git de L1 (el de $RepoOld ya se comprueba en Get-GitSnapshot).
    Assert-True (-not (Test-Path (Join-Path $RepoNew '.git\index.lock'))) "No existe index.lock en $RepoNew\.git"
    Assert-True (-not (Test-Path (Join-Path $ProjectNew 'docker-compose.yml'))) "El destino final $ProjectNew aun no contiene el proyecto (docker-compose.yml)"
    Assert-True (-not (Test-Path (Join-Path $ProjectNew 'mobile'))) "El destino final $ProjectNew no tiene ya una carpeta mobile"

    $composeText = Get-Content -LiteralPath $ComposeOld -Raw
    Assert-True ($composeText -match '(?m)^name:\s*vexora\s*$') 'docker-compose.yml declara "name: vexora"'
    Assert-True ($composeText -match '(?m)^\s*-\s*\./mobile:/app\s*$') 'El bind mount es relativo (./mobile:/app)'
    Assert-True ((Get-Item $ProjectOld).LinkType -eq $null) 'El proyecto es un directorio real (no junction/symlink)'
    Assert-True (-not (Test-Path (Join-Path $ProjectOld '.git')) -and (Test-Path (Join-Path $RepoOld '.git'))) 'Solo L2 contiene el repositorio Git'

    $free = [math]::Round((Get-PSDrive C).Free / 1GB, 1)
    Write-Ok "Espacio libre en C: $free GB (el movimiento es un renombrado, no consume espacio)"

    # 2. Verificacion de Git y estado inicial (HEAD, rama, modificados, no rastreados, MD5)
    Write-Step '2/8 Verificacion de Git y estado inicial'
    $script:GitBaseline = Get-GitSnapshot -RepoPath $RepoOld
    Assert-GitBaseline -Snapshot $script:GitBaseline -Label 'inicial'
    $script:ProtectedBaseline = Get-ProtectedSnapshot -ProjectPath $ProjectOld
    Write-Ok "Huella de documentacion y archivos sensibles: $($script:ProtectedBaseline.Count) archivos, md5 $($script:ProtectedBaseline.Hash)"

    # 3. Volumenes
    Write-Step '3/8 Confirmacion de los cinco volumenes vexora_*'
    Assert-Volumes -ProjectPath $ProjectOld
    $script:VolumesBaseline = Get-VolumeSnapshot
    foreach ($vol in $ExpectedLegacyVolumes) {
        Assert-True ($script:VolumesBaseline -contains $vol) "El volumen antiguo $vol sigue presente (no se toca)"
    }
    $script:BackupBaseline = Get-BackupSnapshot -Path $CurrentBackup
    Write-Ok "Respaldo $CurrentBackup con $($script:BackupBaseline.Count) elementos (baseline)"

    # 4. Estado de la base y de la evidencia antes de detener
    Write-Step '4/8 Conexion real a MariaDB y evidencia (linea base)'
    Assert-Containers
    $script:DbBaseline = Get-DbSnapshotWithRetry
    Assert-True ($script:DbBaseline.Files -eq "$ExpectedFiles") "directus_files = $($script:DbBaseline.Files)"
    Write-Ok "workorders=$($script:DbBaseline.Workorders) diagnoses=$($script:DbBaseline.Diagnoses) quotes=$($script:DbBaseline.Quotes) quoteitems=$($script:DbBaseline.QuoteItems) quoteparts=$($script:DbBaseline.QuoteParts) evidence=$($script:DbBaseline.Evidence) fuels=$($script:DbBaseline.Fuels) methods=$($script:DbBaseline.Methods) files=$($script:DbBaseline.Files)"
    Test-EvidenceAsset -Capture

    # 5. Avisos de procesos con la carpeta abierta
    Write-Step '5/8 Avisos de bloqueos'
    $noise = @(Get-Process -ErrorAction SilentlyContinue | Where-Object {
        $_.Path -and $_.Path.StartsWith($Root, [System.StringComparison]::OrdinalIgnoreCase)
    })
    if ($noise.Count -gt 0) {
        Write-Warn "Procesos con ejecutable dentro de $Root (pueden bloquear el renombrado):"
        $noise | ForEach-Object { Write-Warn ("  {0} (PID {1}) {2}" -f $_.ProcessName, $_.Id, $_.Path) }
        if ($Execute) {
            throw "Hay $($noise.Count) ejecutable(s) corriendo desde $Root. Cierralos antes de ejecutar -Execute."
        }
    } else {
        Write-Ok 'Ningun ejecutable corre desde dentro de la carpeta a mover'
    }
    Write-Warn 'Cierra Freebuff, Explorador de Windows, terminales y antivirus sobre C:\docker_moviles antes de ejecutar.'
    Write-Warn 'Si el renombrado falla, no se pierde nada: los datos siguen en su ruta y se reanudan los servicios.'

    # 6. Modo revision
    if (-not $Execute) {
        Write-Step 'MODO REVISION (no se modifico nada)'
        Write-Host '   Preflight correcto. Para ejecutar:' -ForegroundColor White
        Write-Host '   powershell -NoProfile -ExecutionPolicy Bypass -File .\reorganizar-vexora.ps1 -Execute' -ForegroundColor White
        return
    }

    if (-not $Force) {
        Write-Host ''
        Write-Host 'Se detendran los 5 contenedores (sin -v), se renombraran dos carpetas y se recrearan los servicios.' -ForegroundColor Yellow
        $answer = Read-Host 'Escribe CONFIRMAR para continuar'
        if ($answer -ne 'CONFIRMAR') { throw 'Ejecucion cancelada por el usuario' }
    }

    # 7. Detener, mover y recrear
    Write-Step '6/8 Detener contenedores (sin -v)'
    $script:DownAttempted = $true
    Invoke-Compose -ComposeFile $ComposeOld -ComposeArgs @('down')
    Write-Ok 'docker compose down completado (volumenes conservados)'

    $upNow = @(& docker ps --filter 'name=moviles-' --format '{{.Names}}')
    Assert-True ($upNow.Count -eq 0) "No quedan contenedores moviles-* arriba tras el down"

    Write-Step '7/8 Movimientos y recreacion'
    # Revalidar justo antes de mover: nada cambio mientras se detenian servicios.
    Assert-True (-not (Test-Path $Parking)) "El destino temporal $Parking sigue libre"
    Assert-True (-not (Test-Path (Join-Path $ProjectNew 'docker-compose.yml'))) "El destino final sigue sin proyecto"
    $gitPreMove = Get-GitSnapshot -RepoPath $RepoOld
    Assert-True ($gitPreMove.StatusHash -eq $ExpectedStatusHash) "git status no cambio antes de mover (md5 $($gitPreMove.StatusHash))"

    Invoke-SafeDirectoryMove -Source $Root -Destination $Parking
    Invoke-SafeDirectoryMove -Source (Join-Path $Parking 'docker_moviles') -Destination $Root

    Assert-True (Test-Path $ComposeNew) "Nueva ruta del proyecto: $ProjectNew"
    Assert-True (-not (Test-Path $ProjectOld)) "La ruta de tres niveles ya no existe"
    Assert-True (Test-Path $BackupDir) "El respaldo sigue intacto en $BackupDir"
    Assert-True (Test-Path (Join-Path $ProjectNew 'mobile')) 'La carpeta mobile del bind mount esta en la ruta nueva'

    Invoke-Compose -ComposeFile $ComposeNew -ComposeArgs @('up', '-d')

    Write-Step '8/8 Verificacion posterior'
    Assert-Containers
    Assert-Endpoints

    $after = Get-DbSnapshotWithRetry
    Assert-True ($after.Text -eq $script:DbBaseline.Text) "Conteos de base identicos al baseline ($($after.Text))"
    Assert-True ($after.Files -eq "$ExpectedFiles") "directus_files sigue en $($after.Files)"
    Test-EvidenceAsset

    Assert-Volumes -ProjectPath $ProjectNew
    Assert-VolumesPreserved
    Assert-BackupPreserved

    $gitAfter = Get-GitSnapshot -RepoPath $RepoNew
    Assert-GitBaseline -Snapshot $gitAfter -Label 'final'
    Assert-True ($gitAfter.StatusHash -eq $script:GitBaseline.StatusHash) 'git status final identico al inicial'

    $protectedAfter = Get-ProtectedSnapshot -ProjectPath $ProjectNew
    Assert-True ($protectedAfter.Count -eq $script:ProtectedBaseline.Count) "Documentacion y archivos sensibles: mismos $($protectedAfter.Count) archivos"
    Assert-True ($protectedAfter.Hash -eq $script:ProtectedBaseline.Hash) "Documentacion y archivos sensibles sin cambios (md5 $($protectedAfter.Hash))"

    $mounts = (& docker inspect moviles-ionic --format '{{range .Mounts}}{{.Source}} -> {{.Destination}}{{"\n"}}{{end}}')
    Write-Ok "Bind mount actual: $($mounts -join ' ')"

    Write-Host ''
    Write-Host 'RESULTADO: reorganizacion completada y verificada.' -ForegroundColor Green
    Write-Host '  Proyecto: C:\docker_moviles\docker_moviles' -ForegroundColor White
    Write-Host '  Git:      C:\docker_moviles' -ForegroundColor White
    Write-Host '  Respaldo: C:\vexora_old\docker_moviles_respaldo (intacto)' -ForegroundColor White
}
catch {
    Write-Host ''
    Write-Host "FALLO: $($_.Exception.Message)" -ForegroundColor Red

    if ($script:DownAttempted) {
        Write-Host 'Intentando reversion automatica...' -ForegroundColor Yellow
        try {
            Invoke-Rollback -Automatic
        } catch {
            Write-Host "La reversion automatica fallo: $($_.Exception.Message)" -ForegroundColor Red
            Write-Host 'Contenedores activos:' -ForegroundColor Red
            $active = @(& docker ps --filter 'name=moviles-' --format '{{.Names}}' 2>&1)
            if ($active.Count -gt 0) { $active | ForEach-Object { Write-Host "  $_" -ForegroundColor Red } } else { Write-Host '  (ninguno)' -ForegroundColor Red }
            Write-Host "Ultima ruta de Compose utilizada: $(if ($script:LastComposePath) { $script:LastComposePath } else { '(ninguna)' })" -ForegroundColor Red
            Write-Host 'Estado actual (revisar manualmente, no se perdio ningun dato):' -ForegroundColor Red
            foreach ($p in @($Root, $Parking, (Join-Path $Parking 'docker_moviles'), $ComposeOld, $ComposeNew)) {
                Write-Host ("  {0} -> {1}" -f $p, (Test-Path -LiteralPath $p)) -ForegroundColor Red
            }
        }
    }
    throw
}
