import {
  addTodo,
  listTodos,
  toggleTodo,
  deleteTodo,
  clearAll,
} from "./services/todoService.js";
import {
  COMMANDS,
  MESSAGES,
  HELP_MESSAGE,
  INVALID_FILTER,
} from "./constants.js";
import { DataFileInvalidError } from "./storage/todoStorage.js";

function printHelp(): void {
  console.log(HELP_MESSAGE);
}

function parseId(raw: string | undefined): number | undefined {
  if (!raw) return undefined;
  const n = Number(raw);
  if (!Number.isFinite(n)) return undefined;
  return n;
}

function parseListFilter(args: string[]): "all" | "done" | "open" | "invalid" {
  const flags = args.filter((a) => a.startsWith("--"));
  if (flags.length === 0) return "all";
  if (flags.length > 1) return "invalid";

  switch (flags[0]) {
    case "--done":
      return "done";
    case "--open":
      return "open";
    default:
      return "invalid";
  }
}

async function printTodos(filter: "all" | "done" | "open"): Promise<void> {
  const todos = await listTodos(filter);

  if (todos.length === 0) {
    console.log(MESSAGES.emptyList);
    return;
  }

  for (const t of todos) {
    console.log(`[${t.completed ? "x" : " "}] ${t.id}: ${t.title}`);
  }
}

async function main(): Promise<void> {
  const [, , command, ...args] = process.argv;

  switch (command) {
    case COMMANDS.add: {
      const title = args.join(" ");
      const todo = await addTodo(title);
      console.log(`${MESSAGES.addedPrefix}: ${todo.id}: ${todo.title}`);
      return;
    }

    case COMMANDS.list: {
      const filter = parseListFilter(args);
      if (filter === "invalid") {
        console.error(INVALID_FILTER);
        process.exit(1);
        return;
      }
      await printTodos(filter);
      return;
    }

    case COMMANDS.done: {
      const id = parseId(args[0]);
      if (id === undefined) {
        console.error(MESSAGES.invalidId);
        process.exit(1);
        return;
      }
      const updated = await toggleTodo(id);
      if (!updated) {
        console.error(MESSAGES.notFound);
        process.exitCode = 1;
        return;
      }
      console.log(
        `${MESSAGES.updated}: [${updated.completed ? "x" : " "}] ${updated.id}: ${updated.title}`,
      );
      return;
    }

    case COMMANDS.delete: {
      const id = parseId(args[0]);
      if (id === undefined) {
        console.error(MESSAGES.invalidId);
        process.exitCode = 1;
        return;
      }
      const ok = await deleteTodo(id);
      if (!ok) {
        console.error(MESSAGES.notFound);
        process.exitCode = 1;
        return;
      }
      console.log("Messages.deleted");
      return;
    }

    case COMMANDS.clear: {
      await clearAll();
      console.log(MESSAGES.cleared);
      return;
    }

    case COMMANDS.help:
    case undefined: {
      printHelp();
      return;
    }

    default: {
      console.error(`Unknown command: ${command}`);
      printHelp();
      process.exitCode = 1;
      return;
    }
  }
}

main().catch((err: unknown) => {
  //
  if (err instanceof DataFileInvalidError) {
    console.error(`Error: data/todos.json is invalid. ${err.message}`);
    process.exitCode = 1;
    return;
  }

  const msg = err instanceof Error ? err.message : String(err);
  console.error(`Error: ${msg}`);
  process.exitCode = 1;
});
