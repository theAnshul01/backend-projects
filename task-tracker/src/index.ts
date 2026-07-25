import { addTask, updateTask, deleteTask, markTodo, markInProgress, markDone, listTasks } from "./command.js"

const rawArgs = process.argv
const command = rawArgs.slice(2, 3)[0];
const args = rawArgs.slice(3);

if(!command){
    console.log("Welcome to the CLI task-tracker!");
}
if(command){
    switch (command) {
        case "add": {
            const description = args.join(" ");
            addTask(description);
            break;
        }
        case "update": {
            const id = Number(args[0]);
            const description = args.slice(0).join(" ");
            // const [idArg, ...description] = args;
            updateTask(id, description);
            break;
        }
        case "delete": {
            const id = args;
            deleteTask(Number(id));
            break;
        }
        case "mark-todo": {
            const id = args;
            markTodo(Number(id));
            break;
        }
        case "mark-in-progress": {
            const id = args;
            markInProgress(Number(id));
            break;
        }
        case "mark-done": {
            const id = args;
            markDone(Number(id));
            break;
        }
        case "list" : {
            const subCommand = args[0];
            listTasks(subCommand);
            break;
        }

        default:
            console.log(`Unknown command: ${command}`);
    }
}


