import fs from "fs";
import path from "path";

import { Expense } from "./types"

const DATA_DIR = path.join(__dirname, "..", "data");
const DATA_FILE = path.join(DATA_DIR, "expense.json");


function ensureDataFile(): void {
    if(!fs.existsSync(DATA_DIR)){
        fs.mkdirSync(DATA_DIR, {recursive: true});
    }
    if(!fs.existsSync(DATA_FILE)){
        fs.writeFileSync(DATA_FILE, "[]", "utf-8");
    }
}

export function loadExpenses(): Expense[] {
    ensureDataFile();

    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    
    try {
        return JSON.parse(raw) as Expense[];
    } catch (error) {
        console.error("Warning: expense.json was invalid JSON. Treating as empty.");
        return [];
    }
}

export function saveExpenses(expenses: Expense[]): void {
    ensureDataFile();

    fs.writeFileSync(DATA_FILE, JSON.stringify(expenses, null, 2), "utf-8");
}

export function getNextId(expenses: Expense[]): number {
    if(expenses.length === 0) return 1;
    return Math.max(...expenses.map((item) => item.id)) + 1;
}