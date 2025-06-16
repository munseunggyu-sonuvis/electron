import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { app } from "electron";

const isDev = process.env.NODE_ENV === "development";

let dbPath: string;

if (isDev) {
  dbPath = path.join(__dirname, "db.db");
} else {
  // userData 경로 (쓰기 가능)
  const userDataPath = app.getPath("userData");
  dbPath = path.join(userDataPath, "db.db");

  // 만약 userData에 db.db가 없고, asar 옆에 기본 db가 있다면 복사
  const defaultDbPath = path.join(process.resourcesPath, "db.db");
  if (!fs.existsSync(dbPath)) {
    if (fs.existsSync(defaultDbPath)) {
      fs.copyFileSync(defaultDbPath, dbPath);
    }
  }
}

// 폴더가 없으면 생성
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

console.log("dbPath", dbPath);

const db = new Database(dbPath);

// 테이블 생성
db.exec(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export default db;
