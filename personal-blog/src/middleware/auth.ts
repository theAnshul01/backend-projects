import type { Request, Response, NextFunction } from "express";

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "supersecret"; //! hardcoded for now, to be used from the env variables

export function basicAuth(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Basic ")){
        res.set("WWW-Authenticate", 'Basic realm="Admin Area"');
        return res.status(401).send("Authentication required");
    }

    const base64Credentials = authHeader.slice("Basic ".length);
    const decoded = Buffer.from(base64Credentials, "base64").toString("utf-8");

    const separatorIndex = decoded.indexOf(":");
    const username = decoded.slice(0, separatorIndex);
    const password = decoded.slice(separatorIndex + 1);

    if (username === ADMIN_USERNAME && password == ADMIN_PASSWORD){
        return next();
    }

    res.set("WWW-Authenticate", 'Basic realm="Admin Area"');
    return res.status(401).send("Invalid credentials");

}