import { Command } from "commander";
import { convertLength, lengthUnits } from "./convertors/length.js";
import { convertTemperature, temperatureUnits } from "./convertors/temperature.js";
import { convertWeight, weightUnits } from "./convertors/weight.js";

const program = new Command();

program
    .name("unit-convertor")
    .description("Convert b/w units of measurement (length, weight, temperature)")
    .version("1.0.0");


program
    .command("length")
    .description("convert length units")
    .requiredOption("-v, --value <value>", "value to convert", parseFloat)
    .requiredOption("-f, --from <unit>", "unit to convert from")
    .requiredOption("-t, --to <unit>", "unit to convert to")
    .action((options) => {
        if(!lengthUnits.includes(options.from) || !lengthUnits.includes(options.to)){
            console.error(`Invalid unit. Valid units: ${lengthUnits.join(", ")}`);
            process.exitCode = 1;
            return;
        }
        const result = convertLength(
            options.value,
            options.from,
            options.to,
        );
        console.log(`${options.value} ${options.from} = ${result} ${options.to}`);
    })
program
    .command("weight")
    .description("convert weight units")
    .requiredOption("-v, --value <value>", "value to convert", parseFloat)
    .requiredOption("-f, --from <unit>", "unit to convert from")
    .requiredOption("-t, --to <unit>", "unit to convert to")
    .action((options) => {
        if(!weightUnits.includes(options.from) || !weightUnits.includes(options.to)){
            console.error(`Invalid unit.  Valid units: ${weightUnits.join(",")}`);
            process.exitCode = 1;
            return;
        }
        const result = convertWeight(
            options.value,
            options.from,
            options.to,
        );
        console.log(`${options.value} ${options.from} = ${result} ${options.to}`);
    })
program
    .command("temperature")
    .description("convert temperature units")
    .requiredOption("-v, --value <value>", "value to convert", parseFloat)
    .requiredOption("-f, --from <unit>", "unit to convert from")
    .requiredOption("-t, --to <unit>", "unit to convert to")
    .action((options) => {
        if (!temperatureUnits.includes(options.from) || !temperatureUnits.includes(options.to)) {
            console.error(`Invalid unit.  Valid units: ${temperatureUnits.join(",")}`);
            process.exitCode = 1;
            return;
        }
        const result = convertTemperature(
            options.value,
            options.from,
            options.to,
        );
        console.log(`${options.value} ${options.from} = ${result} ${options.to}`);
    })

program.parse();