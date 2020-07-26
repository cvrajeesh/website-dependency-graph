type VertexData = Record<string, any>;
export class Vertex {
  private inDegree: number = 0;
  private outDegree: number = 0;

  constructor(public readonly id: string, public data: VertexData = {}) {}

  /**
   * Get InDegree
   */
  public get in(): number {
    return this.inDegree;
  }

  /**
   * Get OutDegree
   */
  public get out(): number {
    return this.outDegree;
  }

  incInDegree() {
    this.inDegree++;
  }

  incOutDegree() {
    this.outDegree++;
  }
}

export type Edge = { from: string; to: string };

export default class Graph {
  private adjList: Map<string, Set<string>>;
  private vertices: Map<string, Vertex>;

  constructor() {
    this.adjList = new Map<string, Set<string>>();
    this.vertices = new Map<string, Vertex>();
  }

  getVertex(id: string): Vertex | null {
    const vertex = this.vertices.get(id);
    return vertex ?? null;
  }

  addVertex(id: string, data?: VertexData) {
    if (!this.adjList.has(id)) {
      this.adjList.set(id, new Set<string>());
    }

    if (!this.vertices.has(id)) {
      this.vertices.set(id, new Vertex(id, data));
    }
  }

  addEdge(from: string, to: string) {
    this.addVertex(from);
    this.addVertex(to);

    this.getVertex(from)?.incOutDegree();
    this.getVertex(to)?.incInDegree();

    this.adjList.get(from)?.add(to);
  }

  *edgeIterator() {
    for (const [from, neighbors] of this.adjList.entries()) {
      for (const to of neighbors) {
        yield <Edge>{ from, to };
      }
    }
  }

  *vertexIterator() {
    for (const entry of this.vertices.entries()) {
      yield entry[1];
    }
  }
}
