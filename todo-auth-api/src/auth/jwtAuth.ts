import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "./jwt.js";
import { findUserById, findUserByUsername } from "../dataStore.js";

export function jwtAuth(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const authHeader = req.headers.authorization;

    if(!authHeader){
        res.status(401).json({
            error: "Authentication required"
        });
        return;
    }

    const [scheme, token] = authHeader.split(" ");

    if(scheme !== "Bearer" || !token){
        res.status(401).json({
            error: "Invalid authentication format",
        });
        return;
    }


    try {
        
        const payload = verifyAccessToken(token);

        if(typeof payload !== "object" || payload == null || typeof payload.userId !== "number"){
            res.status(401).json({
                error: "Invalid token",
            });
            return;
        }

        const user = findUserById(payload.userId);
        console.log('user: ', user)

        if(!user){
            res.status(401).json({
                error: "User no longer exists",
            })
            return;
        }

        req.user = user;

        next();

    } catch (error) {
        res.status(401).json({
            error: "Invalid or expired token",
        })
    }

}