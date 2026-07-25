#!/usr/bin/env node
import { addTask, updateTask, deleteTask, markTodo, markInProgress, markDone, listTasks } from "./command.js"

const rawArgs = process.argv
const command = rawArgs.slice(2, 3)[0];
const args = rawArgs.slice(3);

function printUsage(): void {
    console.log(`Usage:
  task-cli add "<description>"
  task-cli update <id> "<description>"
  task-cli delete <id>
  task-cli mark-in-progress <id>
  task-cli mark-done <id>
  task-cli list [done|todo|in-progress]`);
}


try {
    switch (command) {
        case "add": {
            if (args.length === 0) {
                console.log("Error: description is required. Usage: task-cli add \"<description>\"");
                break;
            }
            const description = args.join(" ");
            addTask(description);
            break;
        }
        case "update": {
            // const id = Number(args[0]);
            // const description = args.slice(0).join(" ");
            const [id, ...description] = args;
            if (!id || description.length === 0) {
                console.log("Error: usage: task-cli update <id> \"<description>\"");
                break;
            }
            updateTask(Number(id), description.join(" "));
            break;
        }
        case "delete": {
            const id = args;
            if(!id){
                console.log("Error: usage: task-cli delete <id>");
            }
            deleteTask(Number(id));
            break;
        }
        case "mark-todo": {
            const id = args;
            if (!id) {
                console.log("Error: usage: task-cli mark-todo <id>");
                break;
            }
            markTodo(Number(id));
            break;
        }
        case "mark-in-progress": {
            const id = args;
            if (!id) {
                console.log("Error: usage: task-cli mark-in-progress <id>");
                break;
            }
            markInProgress(Number(id));
            break;
        }
        case "mark-done": {
            const id = args;
            if (!id) {
                console.log("Error: usage: task-cli mark-done <id>");
                break;
            }
            markDone(Number(id));
            break;
        }
        case "list": {
            const subCommand = args[0];
            listTasks(subCommand);
            break;
        }

        default:
            printUsage();
    }
} catch (error) {
    const message = error instanceof Error ? error?.message : String(error);
    console.error(`Unexpected error: ${message}`);
    process.exit(1);
}




