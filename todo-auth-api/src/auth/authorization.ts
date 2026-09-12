import type { Todo } from "../types/todo.types.js";

export function isTodoOwner(todo: Todo, userId: number) : boolean {
    return todo.userId === userId;
}