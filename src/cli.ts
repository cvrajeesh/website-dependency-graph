#!/usr/bin/env node
import yargs from "yargs";
import fs from "fs";
import path from "path";
import { processAndShowDependencyGraph } from "./Website";
import ora from "ora";

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
      const resultPath = await processAndShowDependencyGraph(sourceDir);
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
