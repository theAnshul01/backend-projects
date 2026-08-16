import { Router } from "express";
import { readArticles, writeArticles, getNextId } from "../articleStore.js";

const router = Router()

router.get("/articles", (req, res) => {
    const data = readArticles();
    res.render("articles", {articles: data});
})

router.get("/articles/add", (req, res) => {
    res.render("addForm");
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

router.post("/articles", (req, res) => {
    const data = readArticles();
    const newArticle = {
        id: getNextId(data),
        date: new Date().toISOString(),
        title: req.body.title,
        content: req.body.content,
    }

    data.push(newArticle);
    writeArticles(data);
    res.redirect("/articles")
})

router.get("/articles/:id/edit", (req, res) => {
    const id = Number(req.params.id);
    const data = readArticles();
    const article = data.find((article) => article.id === id);
    if(!article){
        res.status(404).json({"error" : "article not found."});
        return
    }
    res.render("editForm", { article });
})

router.post("/articles/:id/edit", (req, res) => {
    const id = Number(req.params.id);
    const data = readArticles();
    const article = data.find((article) => article.id === id);
    if(!article){
        res.status(400).json({"error" : "article not found."});
        return
    }
    article.title = req.body.title;
    article.content = req.body.content;

    writeArticles(data);
    res.redirect("/articles");
})

router.post("/articles/:id/delete", (req, res) => {
    const id = Number(req.params.id);
    const data = readArticles();
    const idx = data.findIndex((d) => d.id === id);
    if(idx === -1){
        res.status(404).json({"error" : "article not found."});
        return
    }
    data.splice(idx, 1);
    writeArticles(data);
    res.redirect("/articles");
})


export default router