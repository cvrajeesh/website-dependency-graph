import { EventEmitter } from "events";
import { File } from "@babel/types";
import { parse as babelJsParser } from "@babel/parser";
import traverse from "@babel/traverse";
import { IParser, ParserEventEmitter } from "../types";

export class BabelJsParser
  extends (EventEmitter as { new (): ParserEventEmitter })
  implements IParser {
  private traverseAst(ast: File) {
    traverse(ast, {
      ImportDeclaration: ({ node }) => {
        this.emit("dependency", node.source.value);
      },
    });
  }

  parse(content: string) {
    const ast = babelJsParser(content, { sourceType: "module" });
    this.traverseAst(ast);
  }
}
