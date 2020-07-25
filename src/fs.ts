import { promises as fs, exists as fsExists } from "fs";
import { promisify } from "util";

export const exists = (path: string) => {
  return promisify(fsExists)(path);
};

export const readFile = (path: string) => {
  return fs.readFile(path, "utf8");
};

export const writeFile = (path: string, content: string) => {
  return fs.writeFile(path, content, { encoding: "utf8" });
};

export const mkdir = (dir: string) => {
  return fs.mkdir(dir, { recursive: true });
};
