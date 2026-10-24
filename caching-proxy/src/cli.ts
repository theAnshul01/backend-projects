import { Command, InvalidArgumentError } from "commander";
import { startServer } from "./server.js";

const program = new Command();

function parsePort(value: string): number {
    const port = Number(value);

    if(!Number.isInteger(port) || port < 1 || port > 65535) {
        throw new InvalidArgumentError("Port must be an integer between 1 and 65535.");
    }

    return port;
}

function parseOrigin(value: string) : string {
    let url: URL;

    try {
        url = new URL(value);
    } catch {
        throw new InvalidArgumentError("Origin must be a valid URL, such as http://localhost:5000.");
    }

    if(!["http:", "https:"].includes(url.protocol) ||
        url.username ||
        url.password ||
        url.pathname !== "/" ||
        url.search ||
        url.hash
    ){
        throw new InvalidArgumentError(
            "Origin must be an HTTP(s) base URL without credentials, a path, query, or fragment."
        );
    }

    return url.origin;
}

program
    .command("start")
    .description("Start the caching proxy server")
    .requiredOption(
        "-o, --origin <url>",
        "Origin server URL",
        parseOrigin
    )
    .option("-p, --port <port>",
        "Port on which the proxy listens",
        parsePort,
        3000
    )
    .action(
        async(options: {origin: string; port: number}) => {
            console.log(`Configured origin: ${options.origin}`);
            startServer(options.port, options.origin);
        }
    )

await program.parseAsync(process.argv);