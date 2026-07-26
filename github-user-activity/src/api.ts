import type {GitHubEvent} from "./types.js"

export class GitHubError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "GitHubError";
    }
}

export async function fetchActivity(username: string) : Promise<GitHubEvent[]>{
    const url = `https://api.github.com/users/${username}/events`;

    const response = await fetch(url, {
        "headers": {
            "User-Agent": "github-activity-cli",
        }
    })

    if(!response.ok){
        throw new GitHubError(describeFailure(response, username));
    }

    const data = await response.json();

    return data as GitHubEvent[];
}

function describeFailure(response: Response, username: string) : string {
    switch(response.status) {
        case 404:
            return `User ${username} not found.`;

        case 403:
        case 429: {
            const remaining = response.headers.get("x-ratelimit-remaining");
            if(remaining === "0"){
                const reset = response.headers.get("x-ratelimit-reset");
                const when = reset
                    ? new Date(Number(reset) * 1000).toLocaleTimeString()
                    : "later";
                return `Github API rate limit exceeded. Try again after ${when}.`;
            }
            return `Access forbidden (403). Check your request headers.`
        }

        default:
            return `Github API request failed: ${response.status} ${response.statusText}`;
    }
}