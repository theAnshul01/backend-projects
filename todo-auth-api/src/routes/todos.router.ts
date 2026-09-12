import { Router } from "express";
import { getNextId, readDatabase, writeDatabase } from "../dataStore.js";
import { jwtAuth } from "../auth/jwtAuth.js";

const router = Router();

router.use(jwtAuth);

router.get("/", (req, res) => {
    const data = readDatabase();

    res.json({
        todos: data.todos,
    })
})

router.post("/", (req, res) => {
    const data = readDatabase();

    const todo = {
        id: getNextId(data.todos),
        title: req.body.title,
        description: req.body.description,
        completed: false,
    }

    data.todos.push(todo);

    writeDatabase(data);

    res.status(201).json({
        message: "todo item added."
    })

})

router.patch("/:id", (req, res) => {
    const id = Number(req.params.id);
    const data = readDatabase();
    const todo = data.todos.find(t => t.id === id);
    if (!todo) {
        res.json({ "error": "todo item not found" });
        return;
    }

    todo.title = req.body.title;
    todo.description = req.body.description;
    todo.completed = req.body.completed;

    writeDatabase(data);

    res.json({ "message": "todo item updated" });
})

router.delete("/:id", (req, res) => {
    const id = Number(req.params.id);
    const data = readDatabase();
    const idx = data.todos.findIndex(d => d.id === id);
    if (idx === -1) {
        res.json({ "error": "todo item not found" })
        return;
    }
    data.todos.splice(idx, 1);
    writeDatabase(data)
    res.json({
        "message": "todo item deleted."
    })
})

export default router;