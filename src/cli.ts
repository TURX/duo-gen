#!/usr/bin/env node

import yargs from "yargs";
import {hideBin} from "yargs/helpers";
import Op from "./op";
import * as process from "process";
import Persist from "./persist";

async function main() {
    const argv = yargs(hideBin(process.argv))
        .command("set", "Set Duo activation link")
        .command("next", "Get next passcode")
        .command("prev", "Get previous passcode")
        .option("link", {
            type: "string",
            description: "Duo activation link (required for set command)",
        })
        .option("config", {
            type: "string",
            description: "Path to config file",
            default: "duo.json",
        })
        .demandCommand()
        .help()
        .argv;

    try {
        // @ts-ignore
        Persist.configPath = argv.config;
        Op.setup();
        // @ts-ignore
        switch (argv._[0]) {
            case "set":
                if ("link" in argv) {
                    await Op.set(argv.link);
                } else {
                    console.log("Missing link");
                }
                break;
            case "next":
                Op.next();
                break;
            case "prev":
                Op.prev();
                break;
            default:
                console.log("Unknown command");
                break;
        }
    } catch (e) {
        console.log("Error: " + e.message);
    }
}

main().then(() => {
    process.exit()
});
