import {
    addTodo, 
    listTodos,
    toggleTodo,
    deleteTodo,
    clearAll
} from "./todo.js";

function printHelp():void {
    console.log(`Usage:npm run dev -- <command> [args]`);
}

async function printTodos(): Promise<void> {
    const todos = await listTodos();

    if (todos.length === 0) {
        console.log("(empty)");
        return;
    }

    for (const t of todos) {
        console.log(`[${t.completed ? "x" : " "}] ${t.id}: ${t.title}`);
    }

}

function parseId(raw: string | undefined): number | undefined {
    if (!raw) return undefined;
    const n = Number(raw);
    if (!Number.isFinite(n)) return undefined;
    return n;
}

async function main(): Promise<void> {
    const [,, command, ...args] = process.argv;

    switch (command) {
        case "add": {
            const title = args.join(" ");
            const todo = await addTodo(title);
            console.log(`Added: ${todo.id}: ${todo.title}`);
            break;
        }
        case "list": {
            await printTodos();
            break;
        }
        case "done" : {
            const id = parseId(args[0]);
            if (id === undefined){
                console.error("Invalid id");
                return;
            }
            const updated = await toggleTodo(id);
            console.log(updated ? "Updated" : "Not found");
            break;
        }
        case "delete" : {
            const id = parseId(args[0]);
            if (id === undefined){
                console.error("Invalid id");
                return;
            }
            const ok = await deleteTodo(id);
            console.log(ok ? "Deleted" : "Not found");
            break;
        }case "clear" :  {
            await clearAll();
            console.log("Cleared");
            break;
        }default: {
            printHelp();
        }
    }
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
