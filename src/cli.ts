#!/usr/bin/env node
import yargs from "yargs";
import fs from "fs";
import path from "path";
import ora from "ora";
import { Website } from "./Website";
import { report } from "./reporters";

const spinner = ora();

yargs
  .scriptName("wdg")
  .command(
    "$0 <source> [--output]",
    "Generate asset graph from static website files",
    (yargs) => {
      yargs
        .positional("source", {
          describe: "Source directory",
          demandOption: "True",
          type: "string",
        })
        .option("output", {
          describe: "Output format. Support HTML and Graphviz dot format",
          alias: "o",
          default: "html",
          choices: ["html", "dot"],
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
    async (argv: { source: string; output: "html" | "dot" }) => {
      spinner.start("Analyzing website files...");
      const sourceDir = path.resolve(argv.source);
      const website = new Website(sourceDir);
      const dependencyGraph = await website.process();
      spinner.succeed("Analysis completed.");
      spinner.start("Generating report...");
      await report(dependencyGraph, argv.output);
      spinner.succeed("Report generated");
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
