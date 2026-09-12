import { randomBytes } from "node:crypto";
import { readDatabase, writeDatabase } from "../dataStore.js";
import type { Session } from "../types/database.types.js";

const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000;

export function createSession(userId: number): Session {
    const data = readDatabase();

    const session: Session = {
        id: randomBytes(32).toString("hex"),
        userId,
        expiresAt: new Date(
            Date.now() + SESSION_DURATION
        ).toISOString(),
    }

    data.sessions.push(session);
    writeDatabase(data);

    return session;
}

export function findSession(sessionId: string): Session | undefined {
    const data = readDatabase();

    return data.sessions.find(session => session.id === sessionId);
}

export function deleteSession(sessionId: string) : void {
    const data = readDatabase();

    data.sessions = data.sessions.filter(
        session => session.id !== sessionId
    );

    writeDatabase(data);
}