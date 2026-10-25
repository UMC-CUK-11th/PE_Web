$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
if (!(Test-Path -LiteralPath '.env.local')) { throw '먼저 .env.local을 준비해 주세요.' }
$settings = @{}
Get-Content -LiteralPath '.env.local' | ForEach-Object {
    if ($_ -match '^(DB_USER|DB_PW)=(.*)$') { $settings[$Matches[1]] = $Matches[2] }
}
if (!$settings['DB_USER'] -or !$settings['DB_PW']) { throw 'DB_USER/DB_PW 입력이 필요합니다.' }
$mysql = (Get-Command mysql -ErrorAction SilentlyContinue).Source
if (!$mysql) { $mysql = 'C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe' }
$previousPassword = $env:MYSQL_PWD
try {
    $env:MYSQL_PWD = $settings['DB_PW']
    foreach ($file in @('sql/schema.sql', 'sql/seed.sql')) {
        Get-Content -LiteralPath $file -Raw | & $mysql --host=127.0.0.1 "--user=$($settings['DB_USER'])" --default-character-set=utf8mb4
        if ($LASTEXITCODE -ne 0) { throw "DB 초기화 실패: $file" }
    }
    & $mysql --host=127.0.0.1 "--user=$($settings['DB_USER'])" --default-character-set=utf8mb4 umc_movie -e 'SELECT member_id,email,nickname FROM member; SELECT rating_id,member_id,movie_id,score,comment FROM rating ORDER BY rating_id DESC; SHOW TABLES;'
    if ($LASTEXITCODE -ne 0) { throw 'DB 검증 실패' }
} finally {
    $env:MYSQL_PWD = $previousPassword
    $settings.Clear()
}
