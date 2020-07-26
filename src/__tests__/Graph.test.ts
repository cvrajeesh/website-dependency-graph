import Graph from "../Graph";

describe("Graph", () => {
  let graph: Graph;

  beforeEach(() => {
    graph = new Graph();
  });

  it("can get vertex", () => {
    graph.addVertex("1", { label: "one" });
    const vertex = graph.getVertex("1");

    expect(vertex).not.toBeNull();
    expect(vertex?.id).toBe("1");
    expect(vertex?.data).toMatchObject({ label: "one" });
    expect(vertex?.in).toBe(0);
    expect(vertex?.out).toBe(0);
  });

  it("can create graph with two vertices", () => {
    graph.addEdge("1", "2");

    const firstVertex = graph.getVertex("1");
    const secondVertex = graph.getVertex("2");
    const edges = Array.from(graph.edgeIterator());

    expect(firstVertex?.out).toBe(1);
    expect(secondVertex?.in).toBe(1);

    expect(edges).toMatchObject([{ from: "1", to: "2" }]);
  });

  it("can create a cyclic graph", () => {
    graph.addEdge("1", "2");
    graph.addEdge("2", "3");
    graph.addEdge("3", "1");

    const firstVertex = graph.getVertex("1");
    const secondVertex = graph.getVertex("2");
    const thirdVertex = graph.getVertex("3");

    const edges = Array.from(graph.edgeIterator());

    expect(firstVertex?.in).toBe(1);
    expect(firstVertex?.out).toBe(1);
    expect(secondVertex?.in).toBe(1);
    expect(secondVertex?.out).toBe(1);
    expect(thirdVertex?.in).toBe(1);
    expect(thirdVertex?.out).toBe(1);

    expect(edges).toMatchObject([
      { from: "1", to: "2" },
      { from: "2", to: "3" },
      { from: "3", to: "1" },
    ]);
  });
});
