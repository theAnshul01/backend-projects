import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import type { Todo } from "./types/todo.types.js";
import type { Database } from "./types/database.types.js";
import type { User } from "./types/user.types.js";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const DATADIR = path.join(dirname, "..", "data");
const DATAFILE = path.join(DATADIR, "database.json");

export function readDatabase(): Database {
    const data = fs.readFileSync(DATAFILE, "utf8");

    return JSON.parse(data) as Database;
}

export function writeDatabase(database: Database): void {
    fs.writeFileSync(DATAFILE, JSON.stringify(database, null, 2), "utf-8")
}

export function getNextId(todos: Todo[] | User[]): number {
    if(todos.length == 0) return 1;

    return Math.max(...todos.map(a => a.id)) + 1;
}

export function findUserByUsername(username: string): User | undefined {
    const data = readDatabase();

    return data.users.find(user => user.username === username);
}   

