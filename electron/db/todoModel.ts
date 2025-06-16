import db from "./db";

export interface Todo {
  id: number;
  text: string;
  created_at: string;
}

export const todoModel = {
  getAll: (): Todo[] => {
    const stmt = db.prepare("SELECT * FROM todos ORDER BY created_at DESC");
    return stmt.all() as Todo[];
  },

  create: (text: string): Todo => {
    const stmt = db.prepare("INSERT INTO todos (text) VALUES (?) RETURNING *");
    return stmt.get(text) as Todo;
  },

  delete: (id: number): void => {
    const stmt = db.prepare("DELETE FROM todos WHERE id = ?");
    stmt.run(id);
  },
};
