import type { BaseEvent, GitHubEvent } from "./types.js";

export function display(events: GitHubEvent[], username: string): void {
    if(events.length === 0){
        console.log(`No recent public activity found for the user: ${username}`);
        return;
    }

    console.log(`\nRecent activity for ${username}:\n`);
    for (const event of events){
        console.log(`- ${formatEvent(event)}`);
    }
    console.log();
}

function formatEvent(event: GitHubEvent): string {
    const repo = event.repo.name;

    switch(event.type) {
        case "PushEvent": {
            const n = event.payload.size;
            return `Pushed ${n} ${plural(n, "commit")} to ${repo}`;
        }
        case "WatchEvent":
            return `Starred ${repo}`;

        case "IssuesEvent":
            return `${capitalize(event.payload.action)} issue #${event.payload.issue.number} in ${repo}`
        
        case "IssueCommentEvent":
            return `Commented on issue #${event.payload.issue.number} in ${repo}`;

        case "PullRequestEvent": {
            const { action, pull_request } = event.payload;
            // "closed" + merged: true is a merge — GitHub has no separate merge action.
            const verb = action === "closed" && pull_request.merged ? "Merged" : capitalize(action);
            return `${verb} pull request #${pull_request.number} in ${repo}`;
        }

        case "PullRequestReviewCommentEvent":
            return `Reviewed pull request #${event.payload.pull_request.number} in ${repo}`;

        case "CreateEvent": {
            const { ref_type, ref } = event.payload;
            return ref_type === "repository"
                ? `Created repository ${repo}`
                : `Created ${ref_type} '${ref}' in ${repo}`;
        }

        case "DeleteEvent":
            return `Deleted ${event.payload.ref_type} '${event.payload.ref}' in ${repo}`;

        case "ForkEvent":
            return `Forked ${repo} to ${event.payload.forkee.full_name}`;

        case "ReleaseEvent":
            return `Published release ${event.payload.release.tag_name} in ${repo}`;

        case "PublicEvent":
            return `Made ${repo} public`;

        default: {
            // Unknown event type — GitHub adds new ones without warning.
            const unknown = event as BaseEvent;
            return `${unknown.type.replace(/Event$/, "")} in ${unknown.repo.name}`;
        }
    }
}

function plural(count: number, word:string): string {
    return count === 1 ? word : `${word}s`;
}

function capitalize(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
}