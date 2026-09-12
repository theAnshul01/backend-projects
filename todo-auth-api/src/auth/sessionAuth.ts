import type { Request, Response, NextFunction } from "express";
import { findSession } from "./session.js";
import { findUserById } from "../dataStore.js";

export function sessionAuth(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const cookieHeader = req.headers.cookie;

    if(!cookieHeader) {
        res.status(401).json({
            error: "Authentication required",
        });
        return;
    }

    const cookies = cookieHeader.split(";");

    let sessionId: string | undefined;

    for(const cookie of cookies) {
        const [name, value] = cookie.trim().split("=");

        if(name === "sessionId"){
            sessionId = value;
            break;
        }
    }

    if(!sessionId){
        res.status(401).json({
            error: "Session cookie not found",
        });
        return;
    }


    const session = findSession(sessionId);

    if(!session) {
        res.status(401).json({
            error: "Invalid session",
        });
        return;
    }

    const user = findUserById(session.userId);

    if(!user){
        res.status(401).json({
            error: "User not found",
        });
        return;
    }

    req.user = user;

    next();
}