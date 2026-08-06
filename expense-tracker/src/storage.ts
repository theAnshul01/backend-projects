import fs from "fs";
import path from "path";

import type { Expense, Budget } from "./types"

const DATA_DIR = path.join(__dirname, "..", "data");
const DATA_FILE = path.join(DATA_DIR, "expense.json");
const BUDGET_FILE = path.join(DATA_DIR, "budget.json");


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

function ensureBudgetFile() { 
    if(!fs.existsSync(DATA_DIR)){
        fs.mkdirSync(DATA_DIR, {recursive: true});
    }
    if(!fs.existsSync(BUDGET_FILE)){
        fs.writeFileSync(BUDGET_FILE, "[]", "utf-8");
    }
}

export function loadBudget(): Budget[] {
    ensureBudgetFile()

    const raw = fs.readFileSync(BUDGET_FILE, "utf-8");

    try {
        return JSON.parse(raw) as Budget[]
    } catch (error) {
        console.error("Warning: budget.json was invalid JSON. Treating it as empty")
        return []
    }
}

export function saveBudget(budget: Budget[]): void {
    ensureBudgetFile()

    fs.writeFileSync(BUDGET_FILE, JSON.stringify(budget, null, 2), "utf-8");
}