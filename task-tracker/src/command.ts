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
 
export function updateTask(id: number, newDescription:string): void {
    if(isNaN(id)){
        console.log(`Invalid task ID: ${id}`);
        return;
    }
    
    const tasks = readTask();
    const task = tasks.find((t) => t.id === id);
    if(!task){
        console.log(`task not found with ID: ${id}`);
        return;
    }

    task.description = newDescription;
    task.updatedAt = new Date().toISOString();

    writeTask(tasks);

    console.log(`Task updated successfully (ID: ${id})`);
}

export function deleteTask(id:number): void {
    if(isNaN(id)){
        console.log(`Invalid task ID: ${id}`);
        return;
    }
    const tasks = readTask();

    const task = tasks.find((t) => t.id === id);
    if(!task){
        console.log(`task does not exist with ID: ${id}`);
        return;
    }

    const restTasks = tasks.filter((t) => t.id !== id);
    writeTask(restTasks);

    console.log(`Task deleted successfully (ID: ${id})`);
}

export function markTodo(id: number) {
    setStatus(id, "todo");
}

export function markInProgress(id: number) {
    setStatus(id, "in-progress");
}

export function markDone(id: number) {
    setStatus(id, "done");
}

export function setStatus(id:number, newStatus: Task["status"]): void {
    if (isNaN(id)) {
        console.log(`Invalid task ID: ${id}`);
        return;
    }

    const tasks = readTask();
    const task = tasks.find((t) => t.id === id);
    if (!task) {
        console.log(`task does not exist with task ID: ${id}`);
        return;
    }
    task.status = newStatus;
    task.updatedAt = new Date().toISOString();

    writeTask(tasks);
    console.log(`task marked as ${newStatus} (ID: ${id})`);
    
}

export function listTasks(statusFilter?: string): void{
    const tasks = readTask();

    const filtered = statusFilter
        ? tasks.filter((t) => t.status === statusFilter)
        : tasks;

    if(filtered.length === 0){
        console.log("No tasks found.");
        return;
    }

    for(const task of filtered){
        console.log(
            `[${task.id}] (${task.status}) ${task.description}\n` +
            `(created: ${task.createdAt}, updated: ${task.updatedAt})\n`
        );
    }
}