import fg from "fast-glob";
import path from "path";
import { TaskQueue } from "./utils";
import { Asset } from "./Asset";
import { HtmlAsset } from "./HtmlAsset";
import { CSSAsset } from "./CSSAsset";
import { JSAsset } from "./JSAsset";
import Graph from "./Graph";
import { Visualizer } from "./Visualizer";

export class Website {
  constructor(private directory: string) {}

  async process() {
    const files = await fg("**/*.{css,js,html}", {
      cwd: this.directory,
      absolute: true,
    });

    const graph = new Graph();
    const taskQueue = new TaskQueue(50);

    const assetBuilder: Record<string, (file: string) => Asset> = {
      html: (file: string): Asset => new HtmlAsset(this.directory, file),
      css: (file: string): Asset => new CSSAsset(this.directory, file),
      js: (file: string): Asset => new JSAsset(this.directory, file),
    };

    files.forEach((file) => {
      taskQueue.push(async () => {
        const relFileName = path.isAbsolute(file)
          ? path.relative(this.directory, file)
          : file;

        const ext = path.extname(file).slice(1).toLowerCase();

        if (!Object.keys(assetBuilder).includes(ext)) {
          // Asset which we don't support
          return;
        }

        const asset = assetBuilder[ext](file);

        graph.addVertex(relFileName, { type: asset.type });
        asset.on("dependency", (type, filePath) => {
          graph.addVertex(filePath, { type });
          graph.addEdge(relFileName, filePath);
        });
        await asset.process();
      });
    });

    await taskQueue.run();

    return graph;
  }
}

export const processAndShowDependencyGraph = async (sourceDir: string) => {
  const website = new Website(sourceDir);
  const dependencyGraph = await website.process();
  const visualizer = new Visualizer(dependencyGraph);
  return visualizer.showVisJs();
};
