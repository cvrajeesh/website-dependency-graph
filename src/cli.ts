#!/usr/bin/env node
import yargs from "yargs";
import fs from "fs";
import path from "path";
import ora from "ora";
import { Website } from "./Website";
import { htmlReporter } from "./reporters";

const spinner = ora();

yargs
  .scriptName("wdg")
  .command(
    "$0 <source>",
    "Generate asset graph from static website files",
    (yargs) => {
      yargs
        .positional("source", {
          describe: "Source directory",
          demandOption: "True",
          type: "string",
        })
        .check((argv) => {
          const sourceDir = path.resolve(argv.source);
          if (!fs.existsSync(sourceDir)) {
            throw new Error(
              `Source directory ${sourceDir} not found or invalid`
            );
          }
          return true;
        });
    },
    async (argv: { source: string }) => {
      spinner.start("Analyzing website files...");
      const sourceDir = path.resolve(argv.source);
      const website = new Website(sourceDir);
      const dependencyGraph = await website.process();
      const resultPath = await htmlReporter(dependencyGraph);
      spinner.succeed(`Analysis completed.`);
      console.log(`Visualization saved to temp directory ${resultPath}`);
    }
  )
  .strict()
  .demandCommand()
  .alias("h", "help")
  .fail((message, _error, _argv) => {
    if (spinner.isSpinning) {
      spinner.fail(message);
    }
  }).argv;
