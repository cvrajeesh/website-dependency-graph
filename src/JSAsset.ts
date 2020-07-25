import { Asset } from "./Asset";
import { BabelJsParser } from "./parsers/BabelJsParser";

export class JSAsset extends Asset {
  constructor(protected rootDir: string, protected filePath: string) {
    super(rootDir, filePath, new BabelJsParser());
  }
}
