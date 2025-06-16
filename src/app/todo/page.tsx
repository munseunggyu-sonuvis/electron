"use client";

import { useState, useEffect } from "react";

interface Todo {
  id: number;
  text: string;
  created_at: string;
}

declare global {
  interface Window {
    electronAPI: {
      getTodos: () => Promise<{ error: boolean; data: Todo[] }>;
      createTodo: (text: string) => Promise<{ error: boolean; data: Todo }>;
      deleteTodo: (id: number) => Promise<{ error: boolean; data: null }>;
    };
  }
}

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setIsLoading(true);
      const response = await window.electronAPI.getTodos();
      if (response.error) {
        throw new Error("Failed to fetch todos");
      }
      setTodos(response.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("할 일을 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      setIsLoading(true);
      const response = await window.electronAPI.createTodo(newTodo);
      if (response.error) {
        throw new Error("Failed to create todo");
      }
      setTodos([response.data, ...todos]);
      setNewTodo("");
      setError(null);
    } catch (err) {
      console.error(err);
      setError("할 일을 추가하는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setIsLoading(true);
      const response = await window.electronAPI.deleteTodo(id);
      if (response.error) {
        throw new Error("Failed to delete todo");
      }
      setTodos(todos.filter((todo) => todo.id !== id));
      setError(null);
    } catch (err) {
      console.error(err);
      setError("할 일을 삭제하는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">할 일 목록</h1>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="새로운 할 일을 입력하세요"
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            추가
          </button>
        </div>
      </form>

      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {isLoading && <div className="text-center py-4">로딩 중...</div>}

      <ul className="space-y-2">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
          >
            <span>{todo.text}</span>
            <button
              onClick={() => handleDelete(todo.id)}
              disabled={isLoading}
              className="px-3 py-1 text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-50"
            >
              삭제
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
