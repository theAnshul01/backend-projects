import express from "express";
import type { Request, Response } from "express";

export function createApp(origin: string) {
    const app = express();

    app.use(express.json());

    app.use(async (req: Request, res: Response) => {
        try {
            const targetUrl = new URL(req.originalUrl, origin);
            const method = req.method;
            const headers = new Headers();

            for (const [name, value] of Object.entries(req.headers)) {
                if (
                    name.toLowerCase() !== "host" &&
                    name.toLowerCase() !== "connection"
                ) {
                    if (typeof value === "string") {
                        headers.set(name, value);
                    } else if (Array.isArray(value)) {
                        headers.set(name, value.join(", "));
                    }
                }
            }

            const requestBody = (method !== "GET" && method !== "HEAD" && req.body !== undefined ? JSON.stringify(req.body) : undefined);

            const upstreamResponse = await fetch(targetUrl, {
                method,
                headers,
                ...(requestBody !== undefined ? { body: requestBody } : {}),
                redirect: "manual"
            });

            res.status(upstreamResponse.status);

            upstreamResponse.headers.forEach((value, name) => {
                if (
                    !["connection", "transfer-encoding", "content-length", "content-encoding"].includes(name.toLowerCase())
                ) {
                    res.setHeader(name, value);
                }
            });

            const body = Buffer.from(
                await upstreamResponse.arrayBuffer()
            );
            res.end(body);
        } catch (error) {
            console.error("Proxy request failed:", error);

            if (!res.headersSent) {
                res.status(502).send("Bad Gateway");
            } else {
                res.destroy();
            }
        }
    })

    return app;
}

export function startServer(port: number, origin: string) {
    const app = createApp(origin);

    return app.listen(port, () => {
        console.log(`Proxy listening on http://localhost:${port}`);
        console.log(`Forwarding requests to ${origin}`);
    });
}