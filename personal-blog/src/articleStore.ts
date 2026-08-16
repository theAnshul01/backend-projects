import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import type { Article } from "./types/article.types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATADIR = path.join(__dirname, "..", "data");
const DATAFILE = path.join(DATADIR, "articles.json");

function ensureDataFile(): void {
    if(!fs.existsSync(DATADIR)){
        fs.mkdirSync(DATADIR, {recursive: true});
    }
    if(!fs.existsSync(DATAFILE)){
        fs.writeFileSync(DATAFILE, "[]", "utf-8");
    }
}

export function readArticles(): Article[] {
    ensureDataFile();

    const data = fs.readFileSync(DATAFILE, "utf-8");

    try {
        return JSON.parse(data) as Article[];
    } catch (error) {
        console.error("Warning: articles.json was invalid JSON, treating it as empty");
        return [];
    }
}

export function writeArticles(articles: Article[]): void {
    ensureDataFile();
    fs.writeFileSync(DATAFILE, JSON.stringify(articles, null, 2), "utf-8");
}

export function getNextId(articles: Article[]): number {
    if(articles.length == 0) return 1;
    return Math.max(...articles.map((a) => a.id)) + 1;
}