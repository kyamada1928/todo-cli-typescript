import { promises as fs } from "fs";
import path from "path";
import type { Todo } from "../types/todo.js";
import { DATA_FILE_RELATIVE_PATH } from "../constants.js";

export class DataFileInvalidError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DataInvalidError";
  }
}

const DATA_PATH = path.resolve(process.cwd(), DATA_FILE_RELATIVE_PATH);

// ---------- 型ガード（unknown → Todo） ----------

function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null;
}

function isTodo(x: unknown): x is Todo {
  if (!isRecord(x)) return false;

  return (
    typeof x.id === "number" &&
    Number.isFinite(x.id) &&
    typeof x.title === "string" &&
    typeof x.completed === "boolean"
  );
}

function parseTodos(parsed: unknown): Todo[] {
  if (!Array.isArray(parsed)) {
    throw new DataFileInvalidError("Expected an array at root");
  }

  const todos: Todo[] = [];
  for (const item of parsed) {
    if (!isTodo(item)) {
      throw new DataFileInvalidError("Array contains invalid Todo shape");
    }

    todos.push(item);
  }
  return todos;
}

// ---------- 公開API（I/Oだけ） ----------

export async function loadTodos(): Promise<Todo[]> {
  try {
    const raw = await fs.readFile(DATA_PATH, "utf-8");
    let parsed: unknown;

    try {
      parsed = JSON.parse(raw) as unknown;
    } catch {
      throw new DataFileInvalidError("Invalid JSON.");
    }

    return parseTodos(parsed);
  } catch (err: unknown) {
    const e = err as NodeJS.ErrnoException;

    // 初回起動：ファイルが無ければ空で開始
    if (e.code === "ENOENT") return [];

    throw err;
  }
}

export async function saveTodos(todos: Todo[]): Promise<void> {
  const json = JSON.stringify(todos, null, 2);
  await fs.writeFile(DATA_PATH, json, "utf-8");
}
