import { Router } from "express";
import { findUserById, getNextId, readDatabase, writeDatabase, findUserByUsername } from "../dataStore.js";
import { hashPassword, verifyPassword } from "../auth/password.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../auth/jwt.js";
import { createSession, deleteSession } from "../auth/session.js";

const router = Router();

router.post("/register", (req, res) => {
    const data = readDatabase();

    const username = req.body.username;
    const password = req.body.password;

    if (!username) {
        res.status(400).json({ "error": "username is required" });
        return;
    }

    if (!password) {
        res.status(400).json({ "error": "password is required" });
        return;
    }

    const idx = data.users.findIndex(u => u.username === username);
    if (idx !== -1) {
        res.status(409).json({ "message": "username already exists. Please try a different username." })
        return;
    }

    const hashedPassword = hashPassword(password);
    const id = getNextId(data.users)

    const user = {
        id,
        username,
        password: hashedPassword,
    }

    data.users.push(user);

    writeDatabase(data);

    res.status(201).json({ id, username, "message": "user created successfully" })
})

router.post("/login", (req, res) => {
    const { username, password } = req.body;

    if(!username || !password){
        res.status(400).json({
            error: "username and password are required",
        });
        return;
    }

    const user = findUserByUsername(username);

    if(!user){
        res.status(401).json({
            error: "Invalid username or password",
        });
        return;
    }

    const passwordValid = verifyPassword(password, user.password); 

    if(!passwordValid){
        res.status(401).json({
            error: "Invalid username or password",
        });
        return;
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    const isProduction = process.env.NODE_ENV === "production";

    const cookie = [
        `refreshToken=${refreshToken}`,
        "HttpOnly",
        "SameSite=Lax",
        "Max-Age=604800",
        ...(isProduction ? ["Secure"] : [])
    ].join("; ");

    res.setHeader("Set-Cookie", cookie);


    res.json({
        accessToken,
    });
})

router.post("/refresh", (req, res) => {
    const cookieHeader = req.headers.cookie;

    if(!cookieHeader){
        res.status(401).json({
            error: "Refresh token required",
        });
        return;
    }

    const cookies = cookieHeader.split(";");

    let refreshToken: string | undefined;

    for(const cookie of cookies){
        const [name, value] = cookie.trim().split("=");

        if(name === "refreshToken"){
            refreshToken = value;
            break;
        }
    }

    if(!refreshToken){
        res.status(401).json({
            error: "Refresh token not found",
        });
        return;
    }

    try {
        const payload = verifyRefreshToken(refreshToken);

        if(typeof payload !== 'object' || payload === null || typeof payload.userId !== 'number'){
            res.status(401).json({
                error: "Invalid refresh token",
            });
            return;
        }

        const user = findUserById(payload.userId);

        if(!user){
            res.status(401).json({
                error: "user no longer exists",
            });
            return;
        }

        const accessToken = generateAccessToken(user);

        res.json({
            accessToken,
        })

    } catch (error) {
        
    }
})

router.post("/logout", (req, res) => {
    res.setHeader(
        "Set-Cookie",
        [
            "refreshToken=",
            "HttpOnly",
            "SameSite=Lax",
            "Max-Age=0",
        ].join("; ")
    );

    res.json({
        message: "Logout successful",
    })
})

router.post("/session/login", (req, res) => {
    const { username, password } = req.body;

    if(!username || !password){
        res.status(400).json({
            error: "username and password are required.",
        });
        return;
    }

    const user = findUserByUsername(username);

    if(!user){
        res.status(401).json({
            error: "Invalid username or password",
        });
        return;
    }

    const passwordValid = verifyPassword(password, user.password);

    if(!passwordValid){
        res.status(401).json({
            error: "Invalid username or password",
        });
        return;
    }

    const session = createSession(user.id);

    // res.cookie("sessionId", session.id); // TODO: cookie-parser is required for this

    const isProduction = process.env.NODE_ENV === "production";

    const cookie = [
        `sessionId=${session.id}`,
        "HttpOnly",
        "SameSite=Lax",
        "Max-Age=604800",
        ...(isProduction ? ["Secure"] : [])
    ].join("; ");


    res.setHeader(
        "Set-Cookie",
        cookie
    )

    res.json({
        message: "Login successful",
    });

})

router.post("/session/logout", (req, res) => {
    const cookieHeader = req.headers.cookie;

    if(cookieHeader){
        const cookies = cookieHeader.split(";");

        for(const cookie of cookies){
            const [name, value] = cookie.trim().split("=");

            if(name === "sessionId" && value) {
                deleteSession(value);
                break;
            }
        }
    }

    res.setHeader(
        "Set-Cookie",
        "sessionId=; HttpOnly; SameSite=Lax; Max-Age=0"
    );

    res.json({
        message: "Logout successful"
    });
})

export default router;