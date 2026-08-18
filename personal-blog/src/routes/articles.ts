import { Router } from "express";
import { readArticles } from "../articleStore.js";

const router = Router()

router.get("/articles", (req, res) => {
    const data = readArticles();
    res.render("articles", {articles: data});
})

router.get("/article/:id", (req, res) => {
    const id = Number(req.params.id);
    const data = readArticles();
    const article = data.find((d) => d.id === id);
    if(!article){
        res.status(404).json({"error" : "article not found"});
        return;
    }
    res.render("article", {article})
})


export default router
