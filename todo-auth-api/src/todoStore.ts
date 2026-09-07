import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import type { Todo } from "./types/todo.types.js";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const DATADIR = path.join(dirname, "..", "data");
const DATAFILE = path.join(DATADIR, "database.json");

interface Database {
    users: unknown[],
    todos: Todo[],
    sessions: unknown[],
}

export function readDatabase(): Database {
    const data = fs.readFileSync(DATAFILE, "utf8");

    return JSON.parse(data) as Database;
}

export function writeDatabase(database: Database): void {
    fs.writeFileSync(DATAFILE, JSON.stringify(database, null, 2), "utf-8")
}

export function getNextId(todos: Todo[]): number {
    if(todos.length == 0) return 1;

    return Math.max(...todos.map(a => a.id)) + 1;
}

