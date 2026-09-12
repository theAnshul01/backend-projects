import { Router } from "express";
import { getNextId, readDatabase, writeDatabase } from "../dataStore.js";
import { hashPassword, verifyPassword } from "../auth/password.js";
import { generateToken } from "../auth/jwt.js";
import { findUserByUsername } from "../dataStore.js";

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

    const token = generateToken(user);

    res.json({
        token,
    });
})

export default router;