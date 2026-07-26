export interface BaseEvent {
    id: string;
    type: string;
    actor: Actor;
    repo: Repo;
    payload: unknown;
    public: boolean;
    created_at: string;
}

interface Actor {
    id: number;
    login: string;
    display_login: string;
    gravater_id: string;
    url: string;
    avatar_url: string;
}

interface Repo {
    id: number;
    name: string;
    url: string;
}


export interface PushEvent extends BaseEvent {
    type: "PushEvent";
    payload: {
        push_id: number;
        size: number;
        distinct_size: number;
        ref: string;
        head: string;
        before: string;
        commits: Array<{
            sha: string;
            author: { email: string; name: string };
            message: string;
            distinct: string;
            url: string;
        }>
    }
}

export interface CreateEvent extends BaseEvent {
    type: "CreateEvent";
    payload: {
        /** null when ref_type is "repository" */
        ref: string | null;
        ref_type: "repository" | "branch" | "tag";
        master_branch: string;
        description: string | null;
    };
}

export interface DeleteEvent extends BaseEvent {
    type: "DeleteEvent";
    payload: {
        ref: string;
        ref_type: "branch" | "tag";
    };
}

/** This is a *star*, not a watch. GitHub never renamed it. */
export interface WatchEvent extends BaseEvent {
    type: "WatchEvent";
    payload: { action: "started" };
}

export interface ForkEvent extends BaseEvent {
    type: "ForkEvent";
    payload: {
        forkee: { full_name: string; html_url: string };
    };
}

export interface IssuesEvent extends BaseEvent {
    type: "IssuesEvent";
    payload: {
        action: "opened" | "closed" | "reopened" | "assigned" | "unassigned" | "labeled" | "unlabeled";
        issue: { number: number; title: string; html_url: string; state: "open" | "closed" };
    };
}

export interface IssueCommentEvent extends BaseEvent {
    type: "IssueCommentEvent";
    payload: {
        action: "created" | "edited" | "deleted";
        issue: { number: number; title: string; html_url: string };
        comment: { body: string; html_url: string };
    };
}

export interface PullRequestEvent extends BaseEvent {
    type: "PullRequestEvent";
    payload: {
        action: "opened" | "closed" | "reopened" | "synchronize" | "edited";
        number: number;
        pull_request: {
            number: number;
            title: string;
            html_url: string;
            /** Distinguishes a merge from a plain close when action is "closed". */
            merged: boolean;
        };
    };
}

export interface PullRequestReviewCommentEvent extends BaseEvent {
    type: "PullRequestReviewCommentEvent";
    payload: {
        action: "created";
        pull_request: { number: number; title: string; html_url: string };
        comment: { body: string; html_url: string };
    };
}

export interface ReleaseEvent extends BaseEvent {
    type: "ReleaseEvent";
    payload: {
        action: "published";
        release: { tag_name: string; name: string | null; html_url: string };
    };
}

/** Fired when a private repo is made public. Payload is genuinely empty. */
export interface PublicEvent extends BaseEvent {
    type: "PublicEvent";
    payload: Record<string, never>;
}

export type GitHubEvent =
    | PushEvent
    | CreateEvent
    | DeleteEvent
    | WatchEvent
    | ForkEvent
    | IssuesEvent
    | IssueCommentEvent
    | PullRequestEvent
    | PullRequestReviewCommentEvent
    | ReleaseEvent
    | PublicEvent;