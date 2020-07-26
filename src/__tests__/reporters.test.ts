import Graph from "../Graph";
import { dotReporter } from "../reporters";

describe("dotReporter", () => {
  let graph: Graph;

  beforeEach(() => {
    graph = new Graph();
  });

  it("can generate a simple graph", () => {
    graph.addEdge("1", "2");
    graph.addEdge("2", "3");
    graph.addEdge("2", "4");

    const result = dotReporter(graph);

    const expectedDotGraph = `digraph G {
node [shape=box];
"1" -> "2";
"2" -> "3";
"2" -> "4";
}`;

    expect(result).toEqual(expectedDotGraph);
  });
});
