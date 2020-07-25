import parser, { Tree, NodeTag, Node } from "posthtml-parser";
import { EventEmitter } from "events";
import { PostCssParser } from "./PostCssParser";
import { BabelJsParser } from "./BabelJsParser";
import { ParserEventEmitter, IParser } from "../types";

const ATTRS: Record<string, string[]> = {
  src: [
    "script",
    "img",
    "audio",
    "video",
    "source",
    "track",
    "iframe",
    "embed",
  ],
  href: ["link", "a", "use", "script"],
  srcset: ["img", "source"],
  poster: ["video"],
  "xlink:href": ["use", "image", "script"],
  content: ["meta"],
  data: ["object"],
};

// const META: Record<string, string[]> = {
//   property: [
//     "og:image",
//     "og:image:url",
//     "og:image:secure_url",
//     "og:audio",
//     "og:audio:secure_url",
//     "og:video",
//     "og:video:secure_url",
//   ],
//   name: [
//     "twitter:image",
//     "msapplication-square150x150logo",
//     "msapplication-square310x310logo",
//     "msapplication-square70x70logo",
//     "msapplication-wide310x150logo",
//     "msapplication-TileImage",
//     "msapplication-config",
//   ],
//   itemprop: [
//     "image",
//     "logo",
//     "screenshot",
//     "thumbnailUrl",
//     "contentUrl",
//     "downloadUrl",
//   ],
// };

export class PostHtmlParser
  extends (EventEmitter as { new (): ParserEventEmitter })
  implements IParser {
  private readonly postCssProcessor: PostCssParser;
  private readonly babelJsProcessor: BabelJsParser;
  constructor() {
    super();
    this.postCssProcessor = new PostCssParser();
    this.babelJsProcessor = new BabelJsParser();

    this.postCssProcessor.on("dependency", (url) =>
      this.emit("dependency", url)
    );
    this.babelJsProcessor.on("dependency", (url) =>
      this.emit("dependency", url)
    );
  }

  private hasChildren(node: Node): node is NodeTag {
    return (node as NodeTag).content !== undefined;
  }

  private isTextNode(node: Node): node is string {
    return typeof node === "string";
  }

  private processSrcSetAttr(value: string) {
    value
      .split(",")
      .map((src) => src.trim().split(" "))
      .filter((pair) => pair.length > 0)
      .forEach((pair) => this.emit("dependency", pair[0]));
  }

  private isManifestNode(node: NodeTag) {
    return (
      node.tag === "link" && node.attrs?.rel === "manifest" && node.attrs?.href
    );
  }

  private isMetaNode(node: NodeTag) {
    return node.tag === "meta";
  }

  private isStyleNode(node: NodeTag) {
    return node.tag === "style" && node.content;
  }

  private isScriptNode(node: NodeTag) {
    return node.tag === "script" && node.content;
  }

  private findDependencies(node: Node) {
    if (this.isTextNode(node)) {
      return;
    }

    if (this.isStyleNode(node)) {
      this.postCssProcessor.parse(node.content!.join("").trim());
    } else if (this.isScriptNode(node)) {
      this.babelJsProcessor.parse(node.content!.join("").trim());
    }

    if (!node.attrs) {
      return;
    }

    if (this.isMetaNode(node)) {
      // TODO
    } else if (this.isManifestNode(node)) {
      this.emit("dependency", node.attrs.href);
    } else {
      Object.keys(node.attrs)
        .filter((attr) => !!node.attrs![attr])
        .filter((attr) => ATTRS[attr]?.includes(node.tag))
        .forEach((attr) => {
          if (attr === "srcset") {
            this.processSrcSetAttr(node.attrs![attr]);
          } else {
            this.emit("dependency", node.attrs![attr]);
          }
        });

      // Process inline style
      if (node.attrs!["style"]) {
        this.postCssProcessor.parse(node.attrs!["style"]);
      }
    }
  }

  private traverseNode(node: Node) {
    this.findDependencies(node);
    if (this.hasChildren(node)) {
      this.traverseAst(node.content);
    }
  }

  private traverseAst(tree?: Tree) {
    if (Array.isArray(tree)) {
      for (let i = 0; i < tree.length; i++) {
        this.traverseNode(tree[i]);
      }
    }
  }

  parse(content: string) {
    const ast = parser(content, {
      lowerCaseTags: true,
      lowerCaseAttributeNames: true,
    });

    this.traverseAst(ast);
  }
}
