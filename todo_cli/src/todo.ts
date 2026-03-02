import { promises as fs } from 'fs';
import path from "path";
import type {Todo} from "./types.js";

let todos: Todo[] = [];

const DATA_PATH = path.resolve(process.cwd(),"data/todos.json");

async function loadTodos(): Promise<Todo[]> {
    try {
        const raw = await fs.readFile(DATA_PATH,"utf-8");
        const parsed: unknown = JSON.parse(raw);

    if (!Array.isArray(parsed)){ return [];}
    return parsed as Todo[];
    } catch (err: unknown) {
        if ((err as NodeJS.ErrnoException).code === "ENOENT") {
        return [];
        }
        throw err;
    };

}


async function saveTodos(todos: Todo[]): Promise<void> {
    const json = JSON.stringify(todos,null,2);
    await fs.writeFile(DATA_PATH,json,"utf-8");
}


//Todo操作関数
export async function addTodo(title: string ): Promise<Todo> {
    const trimmed = title.trim();
    if (!trimmed) {
        throw new Error("title is empty");
    }

    const todos = await loadTodos();

    const newTodo: Todo = {
        id: Date.now(),
        title,
        completed: false,
    };

    todos.push(newTodo);
    await saveTodos(todos);

    return newTodo;
}

export async function listTodos(): Promise<Todo[]> {
    const todos = await loadTodos();
    return todos;
}

export async function toggleTodo(id: number): Promise<Todo | undefined> {
    const todos = await loadTodos();
    const todo = todos.find((t) => t.id == id);
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

