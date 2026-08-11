if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
  Write-Error "npm not found. Please install Node.js/npm from https://nodejs.org/"
  exit 1
}

# Install dependencies (prefer ci when lockfile exists)
if (Test-Path package-lock.json -or Test-Path yarn.lock) {
  npm ci
} else {
  npm install
}

if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

# Run TypeScript check

npm run lint
exit $LASTEXITCODE