import { readTask, writeTask } from "./storage.js";
import type { Task } from "./types.js"

export function addTask(description: string): void {
    const tasks = readTask();

    const nextId = tasks.length === 0 ?
        1 :
        Math.max(...tasks.map((t) => t.id)) + 1;

    const now = new Date().toISOString();

    const newTask: Task = {
        id: nextId,
        description: description,
        status: "todo",
        createdAt: now,
        updatedAt: now,
    }

    tasks.push(newTask);
    writeTask(tasks);

    console.log(`Task added successfully (ID: ${newTask.id})`);

}

export function listAll(): void {
    const tasks = readTask();
    console.log(tasks);
}