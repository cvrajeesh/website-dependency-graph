import { Asset } from "./Asset";
import { PostCssParser } from "./parsers/PostCssParser";

export class CSSAsset extends Asset {
  constructor(protected rootDir: string, protected filePath: string) {
    super(rootDir, filePath, new PostCssParser());
  }
}
