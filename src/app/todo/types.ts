export interface Todo {
  id: number;
  text: string;
  created_at: string;
}

export interface CreateTodoRequest {
  text: string;
}
