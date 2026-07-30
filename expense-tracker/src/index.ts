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
    .requiredOption("-a, --amount <amount", "amount spent")
    .action((options) => {
        const description: string = options.description.trim();
        const amount: number = Number(options.amount)

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
        };

        expenses.push(newExpense);
        saveExpenses(expenses);

        console.log(`Expense added successfully (ID: ${newExpense.id})`);

    })

program
    .command("list")
    .description("List all expenses")
    .action(() => {
        const expenses = loadExpenses();

        if (expenses.length === 0) {
            console.log("No expense found.");
            return;
        }

        const idWidth = 5;
        const dateWidth = 12;
        const descWidth = Math.max(11, ...expenses.map((e) => e.description.length)) + 2;

        console.log(
            "ID".padEnd(idWidth) + 
            "Date".padEnd(dateWidth) + 
            "Description".padEnd(descWidth) +
            "Amount"
        )

        for (const expense of expenses) {
            console.log(
                String(expense.id).padEnd(idWidth) +
                expense.date.padEnd(dateWidth) +
                expense.description.padEnd(descWidth) + 
                `${expense.amount}`
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
    .description("Update an expense")
    .action(() => {
        console.log("TODO: implement update");
    });

program
    .command("summary")
    .description("View expense summary")
    .action(() => {
        console.log("TODO: implement summary");
    });

program.parse(process.argv);