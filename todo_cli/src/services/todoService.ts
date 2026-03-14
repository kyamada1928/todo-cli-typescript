import type { Todo } from "../types/todo.js";
import { loadTodos, saveTodos } from "../storage/todoStorage.js";

let todos: Todo[] = [];

function normalizeTitle(title: string): string {
  return title.trim();
}

export async function addTodo(title: string): Promise<Todo> {
  const t = normalizeTitle(title);
  if (!t) throw new Error("title is empty");

  const todos = await loadTodos();

  const newTodo: Todo = {
    id: Date.now(),
    title: t,
    completed: false,
  };

  todos.push(newTodo);
  await saveTodos(todos);

  return newTodo;
}

export async function listTodos(
  filter?: "all" | "done" | "open",
): Promise<Todo[]> {
  const todos = await loadTodos();

  switch (filter ?? "all") {
    case "done":
      return todos.filter((t) => t.completed);
    case "done":
      return todos.filter((t) => !t.completed);
    default:
      return todos;
  }
}

export async function toggleTodo(id: number): Promise<Todo | undefined> {
  const todos = await loadTodos();
  const todo = todos.find((t) => t.id === id);
  if (!todo) return undefined;

  todo.completed = !todo.completed;
  await saveTodos(todos);

  return todo;
}

export async function deleteTodo(id: number): Promise<boolean> {
  const todos = await loadTodos();
  const next = todos.filter((t) => t.id !== id);

  if (next.length === todos.length) return false;

  await saveTodos(next);
  return true;
}

export async function clearAll(): Promise<void> {
  await saveTodos([]);
}
