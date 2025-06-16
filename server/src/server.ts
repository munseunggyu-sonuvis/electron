import express from "express";
import cors from "cors";
import db from "./db";

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// 모든 할 일 조회
app.get("/todos", (req, res) => {
  const todos = db
    .prepare("SELECT * FROM todos ORDER BY created_at DESC")
    .all();
  res.json(todos);
});

// 할 일 추가
app.post("/todos", (req, res) => {
  const { text } = req.body;
  if (!text) {
    res.status(400).json({ error: "Text is required" });
    return;
  }

  const result = db.prepare("INSERT INTO todos (text) VALUES (?)").run(text);
  const newTodo = db
    .prepare("SELECT * FROM todos WHERE id = ?")
    .get(result.lastInsertRowid);

  res.status(201).json(newTodo);
});

// 할 일 삭제
app.delete("/todos/:id", (req, res) => {
  const { id } = req.params;
  const result = db.prepare("DELETE FROM todos WHERE id = ?").run(id);

  if (result.changes === 0) {
    res.status(404).json({ error: "Todo not found" });
    return;
  }

  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
