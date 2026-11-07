import mysql from "mysql2/promise";

// Read-only connection/schema probe. Never log the connection config or errors.
if (!process.env.DB_PASSWORD) {
  console.log("DB_PASSWORD가 비어 있습니다. .env에 직접 입력한 뒤 다시 실행해주세요.");
  process.exitCode = 1;
} else {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || "127.0.0.1",
      port: Number(process.env.DB_PORT || 3307),
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD,
      connectTimeout: 5000,
    });
    const database = process.env.DB_NAME || "umc_movie";
    const [schemas] = await connection.execute(
      "SELECT SCHEMA_NAME FROM information_schema.SCHEMATA WHERE SCHEMA_NAME = ?",
      [database],
    );
    if (!schemas.length) {
      console.log(JSON.stringify({ connected: true, database, databaseExists: false, next: "sql/schema.sql, sql/seed.sql 순서로 최초 한 번 실행" }));
      process.exitCode = 1;
    } else {
      const [tables] = await connection.execute(
        "SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME IN ('member', 'rating', 'favorite') ORDER BY TABLE_NAME",
        [database],
      );
      const names = tables.map((table) => table.TABLE_NAME);
      const missingTables = ["member", "rating", "favorite"].filter((name) => !names.includes(name));
      console.log(JSON.stringify({ connected: true, database, databaseExists: true, tables: names, missingTables }));
      if (missingTables.length) process.exitCode = 1;
    }
  } catch (error) {
    console.log(JSON.stringify({ connected: false, code: typeof error.code === "string" ? error.code : "DB_CONNECTION_ERROR" }));
    process.exitCode = 1;
  } finally {
    if (connection) await connection.end();
  }
}
