#!/usr/bin/env node
import { Command } from "commander";
import { loadExpenses, getNextId, saveExpenses } from "./storage";
import { Expense } from "./types";

const program = new Command();

program
    .name("expense-tracker")
    .description("A simple CLI to track your expenses")
    .version("1.0.0")

program
    .command("add")
    .description("Add a new expense")
    .requiredOption("-d, --description <description>", "description of the expense")
    .requiredOption("-a, --amount <amount>", "amount spent")
    .option("-c, --category <category>", "category")
    .action((options) => {
        const description: string = options.description.trim();
        const amount: number = Number(options.amount)
        const category: string = options.category.trim();

        if(description.length === 0){
            console.error("Error: description cannot be empty")
            process.exitCode = 1;
            return;
        }
        if(Number.isNaN(amount) || amount <= 0){
            console.error("Error: amount must be a positive number.")
            process.exitCode = 1;
            return;
        }

        const expenses = loadExpenses();

        const newExpense: Expense = {
            id: getNextId(expenses),
            date: new Date().toISOString().slice(0,10),
            description,
            amount,
            category
        };

        expenses.push(newExpense);
        saveExpenses(expenses);

        console.log(`Expense added successfully (ID: ${newExpense.id})`);

    })

program
    .command("list")
    .description("List all expenses")
    .option("-f, --filter <filter>", "filter expenses by category")
    .action((options) => {
        const expenses = loadExpenses();

        if (expenses.length === 0) {
            console.log("No expense found.");
            return;
        }
        let filteredExpenses: Expense[] = []
        if(options.filter){
            filteredExpenses = expenses.filter((e) => e.category === options.filter)
        } else {
            filteredExpenses = expenses
        }


        const idWidth = 5;
        const dateWidth = 12;
        const descWidth = Math.max(11, ...filteredExpenses.map((e) => e.description.length)) + 2;
        const amountWidth = Math.max(6, ...filteredExpenses.map((e) => `${e.amount}`.length)) + 2;

        console.log(
            "ID".padEnd(idWidth) + 
            "Date".padEnd(dateWidth) + 
            "Description".padEnd(descWidth) +
            "Amount".padEnd(amountWidth) +
            "Category"
        )

        for (const expense of filteredExpenses) {
            console.log(
                String(expense.id).padEnd(idWidth) +
                expense.date.padEnd(dateWidth) +
                expense.description.padEnd(descWidth) + 
                `${expense.amount}`.padEnd(amountWidth) +
                `${expense.category ? expense.category : "-"}`
            )
        }

    })

program
    .command("delete")
    .description("Delete an expense")
    .requiredOption("-i, --id <id>", "ID of the expense to delete")
    .action((options) => {
        const id: number = Number(options.id);

        if(!Number.isInteger(id) || id <= 0){
            console.error("Error: id must be a positive integer.");
            process.exitCode = 1;
            return;
        }

        const expenses = loadExpenses()
        const index = expenses.findIndex((e) => e.id === id);

        if(index === -1){
            console.error(`Error: expense with ID ${id} not found.`);
            process.exitCode = 1;
            return;
        }

        expenses.splice(index, 1);
        saveExpenses(expenses);

        console.log(`Expense deleted successfully (ID: ${id})`);

    });

program
    .command("update")
    .description("Update an existing expense")
    .requiredOption("-i, --id <id>", "ID of the expense to update")
    .option("-d, --description <description>", "new description")
    .option("-a, --amount <amount>", "new amount")
    .action((options) => {
        const id: number = Number(options.id)

        if(!Number.isInteger(id) || id < 0){
            console.error("Error: id must be a positive integer");
            process.exitCode = 1;
            return;
        }

        if(options.description === undefined && options.amount === undefined){
            console.error(
                "Error: provide at least one of --description or --amount to update."
            );
            process.exitCode = 1;
            return;
        }

        const expenses = loadExpenses()
        const expense = expenses.find((e) => e.id === id);

        if(!expense){
            console.error(`Error: expense with ID ${id} not found.`);
            process.exitCode = 1;
            return;
        }

        if (options.description !== undefined){
            const description: string = options.description.trim()
            if(description.length === 0){
                console.error("Error: description cannot be empty.");
                process.exitCode = 1;
                return;
            }
            expense.description = description;
        }

        if (options.amount !== undefined) {
            const amount: number = Number(options.amount);
            if (Number.isNaN(amount) || amount <= 0) {
                console.error("Error: amount must be a positive number.");
                process.exitCode = 1;
                return;
            }
            expense.amount = amount;
        }

        saveExpenses(expenses);
        console.log("Expense updated succefully.");

    });

program
    .command("summary")
    .description("View a summary of expense")
    .option("-m --month <month>", "filter by month (1-12) of the current year")
    .action((options) => {
        const expenses = loadExpenses();

        if(options.month === undefined) {
            const total = expenses.reduce((sum, e) => sum + e.amount, 0);
            console.log(`Total expenses: $${total}`);
            return;
        }

        const month: number = Number(options.month)

        if(!Number.isInteger(month) || month < 1 || month > 12){
            console.error("Error: month must be an integer between 1 and 12");
            process.exitCode = 1;
            return;
        }

        const currentYear = new Date().getFullYear();

        const filtered = expenses.filter((e) => {
            const [year, expenseMonth] = e.date.split("-").map(Number);
            return year === currentYear && expenseMonth === month;
        });

        const total = filtered.reduce((sum, e) => sum + e.amount, 0);
        const monthName = new Date(currentYear, month-1).toLocaleString("default", { month: "long" });

        console.log(`Total expenses for ${monthName} : $${total}`);

    });

program.parse(process.argv);