import Database from "better-sqlite3";
import path from "path";

const db = new Database(path.join(__dirname, "../todo.db"));

// 테이블 생성
db.exec(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export default db;
