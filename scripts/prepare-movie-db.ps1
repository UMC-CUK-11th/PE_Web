param(
    [string]$RunConfig = "$PSScriptRoot/../BE/study/.idea/workspace.xml",
    [string]$Mysql = "C:/Program Files/MySQL/MySQL Server 8.0/bin/mysql.exe"
)
$ErrorActionPreference = 'Stop'
$projectRoot = [System.IO.Path]::GetFullPath("$PSScriptRoot/..")
$dbConfig = @{}
if (Test-Path -LiteralPath $RunConfig) {
    [xml]$configXml = Get-Content -LiteralPath $RunConfig -Raw
    foreach ($entry in $configXml.SelectNodes('//env')) {
        $key = $entry.GetAttribute('name')
        if ($key -in @('DB_URL', 'DB_USER', 'DB_PW')) {
            $value = $entry.GetAttribute('value')
            if ($dbConfig.ContainsKey($key) -and $dbConfig[$key] -cne $value) {
                throw 'Existing run configurations have different DB settings. Specify a single configuration.'
            }
            $dbConfig[$key] = $value
        }
    }
}
$dbUser = if ($env:DB_USER) { $env:DB_USER } elseif ($dbConfig['DB_USER']) { $dbConfig['DB_USER'] } else { 'root' }
$dbPassword = if ($env:DB_PASSWORD) { $env:DB_PASSWORD } elseif ($env:DB_PW) { $env:DB_PW } else { $dbConfig['DB_PW'] }
if ([string]::IsNullOrEmpty($dbPassword)) { throw 'Set DB_PASSWORD locally before running this script. Do not send it in chat.' }
$dbHost = '127.0.0.1'
$dbPort = '3306'
if ($dbConfig['DB_URL'] -match '^jdbc:mysql://([^/:?]+)(?::([0-9]+))?/') {
    if ($Matches[1] -notin @('localhost', '127.0.0.1')) { throw 'Only the existing local MySQL server is supported by this helper.' }
    if ($Matches[2]) { $dbPort = $Matches[2] }
}
$previousPassword = $env:MYSQL_PWD
$previousEncoding = $OutputEncoding
try {
    $env:MYSQL_PWD = $dbPassword
    $OutputEncoding = [System.Text.UTF8Encoding]::new($false)
    $mysqlArgs = @("--host=$dbHost", "--port=$dbPort", "--user=$dbUser", '--default-character-set=utf8mb4', '--batch', '--skip-column-names')
    'CREATE DATABASE IF NOT EXISTS umc_movie CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;' | & $Mysql @mysqlArgs
    if ($LASTEXITCODE -ne 0) { throw 'MySQL connection or database creation failed.' }
    foreach ($name in @('schema.sql', 'seed.sql')) {
        Get-Content -LiteralPath "$projectRoot/BE/movie/sql/$name" -Raw -Encoding utf8 | & $Mysql @mysqlArgs '--database=umc_movie'
        if ($LASTEXITCODE -ne 0) { throw "Applying $name failed." }
    }
    function Escape-Property([string]$value) {
        return $value.Replace('\', '\\').Replace("`r", '\r').Replace("`n", '\n').Replace(' ', '\u0020')
    }
    $localProperties = "DB_URL=jdbc:mysql://localhost:$dbPort/umc_movie`nDB_USER=$(Escape-Property $dbUser)`nDB_PASSWORD=$(Escape-Property $dbPassword)`n"
    [System.IO.File]::WriteAllText("$projectRoot/BE/movie/.env.local", $localProperties, [System.Text.UTF8Encoding]::new($false))
    'SELECT ''member'', COUNT(*) FROM member UNION ALL SELECT ''rating'', COUNT(*) FROM rating UNION ALL SELECT ''favorite'', COUNT(*) FROM favorite;' | & $Mysql @mysqlArgs '--database=umc_movie'
    if ($LASTEXITCODE -ne 0) { throw 'Database verification failed.' }
    Write-Output 'Movie DB ready. Credentials saved only in ignored BE/movie/.env.local.'
} finally {
    $env:MYSQL_PWD = $previousPassword
    $OutputEncoding = $previousEncoding
}
