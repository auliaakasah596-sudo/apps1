param(
  [switch]$Release
)

function Fail([string]$msg) {
  Write-Error $msg
  exit 1
}

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) { Fail "npm not found. Install Node.js/npm from https://nodejs.org/" }
if (-not (Get-Command adb -ErrorAction SilentlyContinue)) { Fail "adb not found. Install Android Platform Tools and ensure 'adb' is in PATH." }

Write-Host "Installing dependencies..."
if (Test-Path package-lock.json) { npm ci } else { npm install }
if ($LASTEXITCODE -ne 0) { Fail "npm install failed." }

Write-Host "Building web assets..."
npm run build
if ($LASTEXITCODE -ne 0) { Fail "Build failed." }

Write-Host "Preparing Capacitor Android platform..."
# If android folder missing, add the Android platform
if (-not (Test-Path "android")) {
  Write-Host "Android platform not found. Adding Android platform via Capacitor..."
  npx cap add android
  if ($LASTEXITCODE -ne 0) { Fail "Capacitor add android failed." }
} else {
  Write-Host "Android platform exists; syncing..."
}

Write-Host "Syncing Capacitor Android..."
npx cap sync android
if ($LASTEXITCODE -ne 0) { Fail "Capacitor sync failed." }

Push-Location android
try {
  if ($Release) {
    Write-Host "Assembling Release APK..."
    & .\gradlew.bat assembleRelease
    if ($LASTEXITCODE -ne 0) { Fail "Gradle assembleRelease failed." }
    $apk = Get-ChildItem -Recurse -Filter "*-release.apk" | Select-Object -First 1
  } else {
    Write-Host "Assembling Debug APK..."
    & .\gradlew.bat assembleDebug
    if ($LASTEXITCODE -ne 0) { Fail "Gradle assembleDebug failed." }
    $apk = Get-ChildItem -Recurse -Filter "*-debug.apk" | Select-Object -First 1
  }

  if (-not $apk) { Fail "APK not found after build." }

  Write-Host "Checking connected devices (adb devices):"
  $devices = adb devices
  Write-Host $devices

  $lines = (adb devices) -split "`n" | Where-Object { $_ -match "\tdevice$" }
  if ($lines.Count -eq 0) { Fail "No device detected. Enable USB debugging and connect your device." }

  Write-Host "Installing APK: $($apk.FullName)"
  adb install -r $apk.FullName
  if ($LASTEXITCODE -ne 0) { Fail "adb install failed." }

  Write-Host "APK installed successfully."
} finally {
  Pop-Location
}
