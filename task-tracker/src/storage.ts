import * as fs from "fs";
import type {Task} from "./types.js";

const FILE_PATH = "./tasks.json";

export function readTask() : Task [] {
    if(!fs.existsSync(FILE_PATH)){
        fs.writeFileSync(FILE_PATH, JSON.stringify([]));
    }

    const raw = fs.readFileSync(FILE_PATH, "utf-8");

    try {
        return JSON.parse(raw) as Task[];
    } catch (error) {
        console.error(`Error: tasks.json is not valid JSON. Fix or delete the file and try again.`);
        process.exit(1);
    }
    
}

export function writeTask(tasks: Task[]): void {
    fs.writeFileSync(FILE_PATH, JSON.stringify(tasks, null, 2));
}