import { Router } from "express";
import { getNextId, readDatabase, writeDatabase } from "../dataStore.js";
// import { jwtAuth } from "../auth/jwtAuth.js";
import { sessionAuth } from "../auth/sessionAuth.js";

const router = Router();

router.use(sessionAuth);

router.get("/", (req, res) => {
    const data = readDatabase();

    const todos = data.todos.filter(todo => todo.userId === req.user!.id);

    if(todos.length === 0){
        res.status(200).json({
            message: "No todo item found."
        });
        return;
    }

    res.json({
        todos,
    })
})

router.post("/", (req, res) => {
    const data = readDatabase();

    const todo = {
        id: getNextId(data.todos),
        title: req.body.title,
        description: req.body.description,
        completed: false,
        userId: req.user!.id,
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
        res.status(404).json({ "error": "todo item not found" });
        return;
    }

    if(todo.userId !== req.user!.id){
        res.status(403).json({
            error: "You are not allowed to modify this todo"
        });
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
        res.status(404).json({ "error": "todo item not found" })
        return;
    }

    const todo = data.todos[idx];
    if (todo!.userId !== req.user!.id) {
        res.status(403).json({
            error: "You are not allowed to delete this todo"
        });
        return;
    }

    data.todos.splice(idx, 1);
    writeDatabase(data)
    res.json({
        "message": "todo item deleted."
    })
})

export default router;