import path from "path";
import mime from "mime-types";
import Url from "url";
import * as fs from "./fs";
import { EventEmitter } from "events";
import { isAssetUrl } from "./utils";
import { IParser, AssetEventEmitter } from "./types";

export abstract class Asset extends (EventEmitter as {
  new (): AssetEventEmitter;
}) {
  private content: string;
  constructor(
    protected rootDir: string,
    protected filePath: string,
    private parser: IParser
  ) {
    super();

    if (!path.isAbsolute(filePath)) {
      this.filePath = path.join(this.rootDir, this.filePath);
    }
  }

  public get type(): string {
    return mime.lookup(this.filePath) || "application/octet-stream";
  }

  protected async getContent() {
    if (this.content === undefined) {
      this.content = await fs.readFile(this.filePath);
    }
    return this.content;
  }

  protected processDependency(url: string) {
    if (isAssetUrl(url)) {
      const parsed = Url.parse(url);
      const fileName = parsed.pathname;
      if (!fileName) {
        return;
      }

      let dependencyPath: string;
      if (fileName[0] === "/") {
        dependencyPath = fileName.slice(1);
      } else {
        dependencyPath = path.relative(
          this.rootDir,
          path.join(path.dirname(this.filePath), fileName)
        );
      }

      const contentType = mime.lookup(fileName) || "application/octet-stream";
      this.emit("dependency", contentType, dependencyPath);
    }
  }

  async process() {
    const content = await this.getContent();
    this.parser.on("dependency", (url) => this.processDependency(url));
    this.parser.parse(content);
  }
}
