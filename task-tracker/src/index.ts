import { addTask, listAll } from "./command.js"

const rawArgs = process.argv
const command = rawArgs.slice(2, 3)[0];
const args = rawArgs.slice(3);
console.log("join: ", args.join(" "));

switch(command) {
    case "add": {
        const description = args.join(" ");
        addTask(description);
        break;
    }
    case "listAll": {
        listAll();
        break;
    }

    default:
        console.log(`Unknown command: ${command}`);
}

