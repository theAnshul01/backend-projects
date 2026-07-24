import * as fs from "fs";
import type {Task} from "./types.js";

const FILE_PATH = "./tasks.json";

export function readTask() : Task [] {
    if(!fs.existsSync(FILE_PATH)){
        fs.writeFileSync(FILE_PATH, JSON.stringify([]));
    }

    const raw = fs.readFileSync(FILE_PATH, "utf-8");

    return JSON.parse(raw) as Task[];
}

export function writeTask(tasks: Task[]): void {
    fs.writeFileSync(FILE_PATH, JSON.stringify(tasks, null, 2));
}