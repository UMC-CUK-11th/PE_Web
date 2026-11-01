$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
$configFile = Join-Path $PSScriptRoot '.env.local'
if (Test-Path -LiteralPath $configFile) {
    foreach ($configLine in Get-Content -LiteralPath $configFile) {
        if ($configLine -match '^\s*(DB_URL|DB_USER|DB_PASSWORD|PORT)\s*=(.*)$') {
            $configKey = $Matches[1]
            $configValue = $Matches[2].Trim().Trim('"').Trim("'")
            [Environment]::SetEnvironmentVariable($configKey, $configValue, 'Process')
        }
    }
}
$java21 = Get-ChildItem -LiteralPath 'C:\Program Files\Java' -Directory -Filter 'jdk-21*' -ErrorAction SilentlyContinue | Sort-Object Name -Descending | Select-Object -First 1
if ($java21) { $env:JAVA_HOME = $java21.FullName; $env:PATH = "$env:JAVA_HOME\bin;$env:PATH" }
if (-not (Test-Path Env:DB_PASSWORD)) { throw 'Set DB_PASSWORD in .env.local.' }
& .\gradlew.bat bootRun
exit $LASTEXITCODE
