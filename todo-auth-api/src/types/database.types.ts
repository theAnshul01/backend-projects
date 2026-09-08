import type { Todo } from "./todo.types.js";
import type { User } from "./user.types.js";

export interface Session {
    id: string;
    userId: number;
    expiresAt: string;
}

export interface Database {
    users: User[],
    todos: Todo[],
    sessions: unknown[],
}