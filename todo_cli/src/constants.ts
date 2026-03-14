export const COMMANDS = {
  add: "add",
  list: "list",
  done: "done",
  delete: "delete",
  clear: "clear",
  help: "help",
} as const;

export const MESSAGES = {
  usage: "Usage:npm run dev -- <command> [args]",
  emptyList: "(empty)",
  invalidId: "Invalid id",
  updated: "Updated",
  deleted: "Deleted",
  cleared: "Cleared",
  notFound: "Not found",
  addedPrefix: "Added",
} as const;

export const HELP_MESSAGE = `
Usage:
  npm run dev -- <command> [args]

Commands:
  add <title>              Add a new todo
  list [--done|--open]     List todos (default: all)
  done <id>                Toggle completed
  delete <id>              Delete a todo
  clear                    Remove all todos
  help                     Show help

Examples:
  npm run dev -- add "Buy milk"
  npm run dev -- list
  npm run dev -- list --done
  npm run dev -- list --open
  npm run dev -- done 1700000000000
  npm run dev -- delete 1700000000000
`;

export const DATA_FILE_RELATIVE_PATH = "data/todos.json";

export const INVALID_FILTER = "Invalid filter";
