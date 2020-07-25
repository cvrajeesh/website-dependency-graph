import { EventEmitter } from "events";
import safeParser from "postcss-safe-parser";
import { parse as postCssValueParser, ChildNode } from "postcss-values-parser";
import type { Root } from "postcss";
import { IParser, ParserEventEmitter } from "../types";

export class PostCssParser
  extends (EventEmitter as { new (): ParserEventEmitter })
  implements IParser {
  processValueQuotedNode(node: ChildNode) {
    if (node.type === "quoted") {
      this.emit("dependency", node.value.slice(1, -1));
    }
  }

  processValue(value: string) {
    const valueAst = postCssValueParser(value);
    const node = valueAst.nodes[0];

    if (node.type === "func" && node.name === "url") {
      if (node.nodes) {
        this.processValueQuotedNode(node.nodes[0]);
      }
    } else {
      this.processValueQuotedNode(node);
    }
  }

  traverseAst(root: Root) {
    root.walkAtRules("import", (rule) => {
      const valueAst = postCssValueParser(rule.params);
      const node = valueAst.nodes[0];

      if (node.type === "func" && node.name === "url") {
        if (node.nodes) {
          this.processValueQuotedNode(node.nodes[0]);
        }
      } else {
        this.processValueQuotedNode(node);
      }
    });

    root.walkDecls((decl) => {
      const valueAst = postCssValueParser(decl.value);
      const node = valueAst.nodes[0];

      if (node.type === "func" && node.name === "url") {
        if (node.nodes) {
          this.processValueQuotedNode(node.nodes[0]);
        }
      }
    });
  }

  parse(content: string) {
    const ast = safeParser(content);

    this.traverseAst(ast);
  }
}
