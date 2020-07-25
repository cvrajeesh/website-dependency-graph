import { Asset } from "./Asset";
import { PostHtmlParser } from "./parsers/PostHtmlParser";

export class HtmlAsset extends Asset {
  constructor(protected rootDir: string, protected filePath: string) {
    super(rootDir, filePath, new PostHtmlParser());
  }
}
