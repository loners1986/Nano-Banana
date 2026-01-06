Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$cliArgs = $args

function Test-PortAvailable([int]$port) {
  try {
    $listeners = [System.Net.NetworkInformation.IPGlobalProperties]::GetIPGlobalProperties().GetActiveTcpListeners()
    return -not ($listeners | Where-Object { $_.Port -eq $port })
  } catch {
    return $true
  }
}

function Get-PortOwnerPids([int]$port) {
  try {
    $lines = cmd /c "netstat -ano -p tcp | findstr :$port" 2>$null
    if (-not $lines) { return @() }
    $pids = @()
    foreach ($line in $lines) {
      $tokens = ($line -split '\s+') | Where-Object { $_ -ne '' }
      if ($tokens.Length -gt 0 -and $tokens[-1] -match '^\d+$') {
        $pids += [int]$tokens[-1]
      }
    }
    return @($pids | Sort-Object -Unique)
  } catch {
    return @()
  }
}

function Remove-DirectoryWithRetries([string]$path) {
  if (-not (Test-Path $path)) { return }
  $maxAttempts = 20
  for ($i = 0; $i -lt $maxAttempts; $i++) {
    try {
      Remove-Item -LiteralPath $path -Recurse -Force -ErrorAction Stop
      return
    } catch {
      Start-Sleep -Milliseconds 200
    }
  }
  throw "Failed to delete '$path'. Another process may be locking files (e.g., antivirus/indexer)."
}

function Resolve-Port([string[]]$cliArgs) {
  $port = 3000
  for ($i = 0; $i -lt $cliArgs.Length; $i++) {
    $a = $cliArgs[$i]
    if ($a -match '^--port=(\d+)$') { return [int]$Matches[1] }
    if ($a -eq '--port' -or $a -eq '-p') {
      if ($i + 1 -lt $cliArgs.Length -and $cliArgs[$i + 1] -match '^\d+$') { return [int]$cliArgs[$i + 1] }
    }
  }
  if ($env:npm_config_port -and $env:npm_config_port -match '^\d+$') { return [int]$env:npm_config_port }
  if ($env:PORT -and $env:PORT -match '^\d+$') { return [int]$env:PORT }
  return $port
}

function Strip-PortArgs([string[]]$cliArgs) {
  $out = New-Object System.Collections.Generic.List[string]
  for ($i = 0; $i -lt $cliArgs.Length; $i++) {
    $a = $cliArgs[$i]
    if ($a -eq '--') { continue }
    if ($a -match '^--port=\d+$') { continue }
    if ($a -eq '--port' -or $a -eq '-p') {
      if ($i + 1 -lt $cliArgs.Length -and $cliArgs[$i + 1] -match '^\d+$') { $i++; continue }
    }
    $out.Add($a)
  }
  return $out.ToArray()
}

$requestedPort = Resolve-Port $cliArgs
$port = $requestedPort
$passThroughArgs = Strip-PortArgs $cliArgs

$nextBin = Join-Path $PSScriptRoot '..\node_modules\next\dist\bin\next'

$distDir = ".next-dev-$port"
$env:NEXT_DIST_DIR = $distDir

if (-not (Test-PortAvailable $port)) {
  $pids = Get-PortOwnerPids $port
  $pidMsg = if (@($pids).Count -gt 0) { " (PID: $($pids -join ', '))" } else { "" }
  Write-Error "Port $port is already in use$pidMsg. Stop the process using this port, then re-run pnpm dev."
  exit 1
}

try {
  Remove-DirectoryWithRetries $distDir
} catch {
  Write-Error $_
  exit 1
}

Write-Host "Starting Next dev on port $port..."

& node $nextBin dev --port $port --webpack @passThroughArgs
if ($LASTEXITCODE -eq 0) { exit 0 }

Write-Warning "Next dev exited with code $LASTEXITCODE. Falling back to build + start..."

& node $nextBin build
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
& node $nextBin start --port $port @passThroughArgs
exit $LASTEXITCODE
