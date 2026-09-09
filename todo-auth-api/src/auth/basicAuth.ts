import type { Request, Response, NextFunction } from "express";
import { findUserByUsername } from "../dataStore.js";
import { verifyPassword } from "./password.js";

export function basicAuth(req: Request, res: Response, next: NextFunction){
    const authHeader = req.headers.authorization;

    if(!authHeader){
        res.setHeader("WWW-Authenticate", "Basic");
        res.status(401).json({
            error: "Authentication required"
        });
        return;
    }

    const [scheme, encodedCredentials] = authHeader.split(" ");

    if(scheme !== "Basic" || !encodedCredentials) {
        res.setHeader("WWW-Authenticate", "Basic");
        res.status(401).json({
            error: "Invalid authentication format"
        });
        return;
    }

    const decodedCredentials = Buffer.from(encodedCredentials, "base64").toString("utf-8");

    const seperatorIndex = decodedCredentials.indexOf(":");

    if(seperatorIndex === -1){
        res.setHeader("WWW-Authenticate", "Basic");
        res.status(401).json({
            error: "Invalid authentication credentials"
        });
        return;
    }

    const username = decodedCredentials.slice(0, seperatorIndex);
    const password = decodedCredentials.slice(seperatorIndex+1);

    const user = findUserByUsername(username);

    if(!user){
        res.setHeader("WWW-Authenticate", "Basic");
        res.status(401).json({
            error: "Invalid username or password"
        });
        return;
    }

    const passwordValid = verifyPassword(password, user.password);

    if (!passwordValid) {
        res.setHeader("WWW-Authenticate", "Basic");
        res.status(401).json({
            error: "Invalid username or password"
        });
        return;
    }

    req.user = user;

    next();

}