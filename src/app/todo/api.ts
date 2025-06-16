import { Todo, CreateTodoRequest } from "./types";

const API_URL = "http://localhost:3001";

export async function getTodos(): Promise<Todo[]> {
  const response = await fetch(`${API_URL}/todos`);
  if (!response.ok) {
    throw new Error("Failed to fetch todos");
  }
  return response.json();
}

export async function createTodo(todo: CreateTodoRequest): Promise<Todo> {
  const response = await fetch(`${API_URL}/todos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(todo),
  });
  if (!response.ok) {
    throw new Error("Failed to create todo");
  }
  return response.json();
}

export async function deleteTodo(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/todos/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete todo");
  }
}
