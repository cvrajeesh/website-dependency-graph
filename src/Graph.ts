type NodeAttribute = Record<string, any>;

export default class Graph {
  private adjList: Map<string, string[]>;
  private attributes: Map<string, NodeAttribute>;

  constructor() {
    this.adjList = new Map<string, string[]>();
    this.attributes = new Map<string, Record<string, any>>();
  }

  addVertex(vertex: string, attribute?: NodeAttribute) {
    if (!this.adjList.has(vertex)) {
      this.adjList.set(vertex, []);
    }

    if (!this.attributes.has(vertex)) {
      this.attributes.set(vertex, attribute ?? {});
    }
  }

  addEdge(from: string, to: string) {
    this.addVertex(from);
    this.addVertex(to);

    this.adjList.get(from)?.push(to);
  }

  toAdjacencyList() {
    const data: Record<string, string[]> = {};
    for (const [key, value] of this.adjList.entries()) {
      data[key] = value;
    }

    return data;
  }

  getNodes() {
    const nodes: {
      id: string;
      neighbors: number;
      attributes?: NodeAttribute;
    }[] = [];
    this.adjList.forEach((_value, key) => {
      nodes.push({
        id: key,
        neighbors: this.adjList.get(key)?.length ?? 0,
        attributes: this.attributes.get(key),
      });
    });

    return nodes;
  }
}
