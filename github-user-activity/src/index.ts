#!/usr/bin/env node

import { fetchActivity } from "./api.js";
import { GitHubError } from "./api.js";
import { display } from "./display.js";

async function main(): Promise<void> {
    const username = process.argv[2];

    if(!username) {
        console.error("Usage: github-activity <username>");
        process.exitCode = 1;
        return;
    }

    try {
        const events = await fetchActivity(username);
        display(events, username);
    } catch (error) {
        if(error instanceof GitHubError){
            console.error(error.message);
        } else if (error instanceof Error) {
            console.error(`Could not reach GitHub: ${error.message}`);
        } else {
            console.error("An unexpected error occurred.")
        }
        process.exitCode = 1;
    }
}

main()