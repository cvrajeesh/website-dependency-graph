import path from "path";
import * as fs from "./fs";
import Graph from "./Graph";
import open from "open";
import os from "os";

export class Visualizer {
  constructor(private graph: Graph) {}

  async showVisJs() {
    const adjacencyList = this.graph.toAdjacencyList();
    const nodes = this.graph.getNodes().map((node) => ({
      id: node.id,
      label: node.id,
      value: node.neighbors,
      group: node.attributes?.type ?? "Unknown",
    }));

    const nodeData = JSON.stringify(nodes);
    const edgeData = JSON.stringify(
      Object.keys(adjacencyList)
        .map((from) => adjacencyList[from].map((to) => ({ from, to })))
        .flat()
    );

    const content = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Dependency Visualization</title>
        <script
          type="text/javascript"
          src="https://unpkg.com/vis-network/standalone/umd/vis-network.min.js"
        ></script>
    
        <style type="text/css">
          html,
          body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
          }
          #viz {
            width: 100vw;
            height: 100vh;
            border: 50px solid lightgray;
            box-sizing: border-box;
          }
        </style>
      </head>
      <body>
        <div id="viz"></div>
        <script type="text/javascript">
          const nodeData = ${nodeData};
          const edgeData = ${edgeData};
          var nodes = new vis.DataSet(nodeData);
          var edges = new vis.DataSet(edgeData);
    
          // create a network
          var container = document.getElementById("viz");
    
          // provide the data in the vis format
          var data = {
            nodes: nodes,
            edges: edges,
          };
          var options = {
            nodes: {
              shape: "box",
              scaling: {
                label: {
                  enabled: true,
                  min:5,
                  max:50,
                }
              }
            },
            edges: {
              color: {
                opacity: 0.5,
                inherit: "to"
              }
            },
            physics: {
              enabled: false
            },
          };
    
          // initialize your network!
          new vis.Network(container, data, options);
        </script>
      </body>
    </html>
    `;

    const outDir = path.join(os.tmpdir(), "wag");
    const outDirExists = await fs.exists(outDir);
    if (!outDirExists) {
      await fs.mkdir(outDir);
    }

    const filePath = path.join(outDir, `vis-${+new Date()}.html`);
    await fs.writeFile(filePath, content);

    await open(filePath);
    return filePath;
  }
}
