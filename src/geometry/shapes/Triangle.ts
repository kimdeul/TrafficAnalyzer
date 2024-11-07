import { CCW } from "../algorithm/vector";
import { Point } from "./Point";
import { Segment } from "./Segment";
import { Shape } from "./Shape";

export class Triangle extends Shape {

  readonly vertices: [Point, Point, Point]
  readonly edges: [Segment, Segment, Segment]

  constructor(vertices: [Point, Point, Point]) {
    super()
    this.vertices = vertices;
    this.edges = [
      new Segment(this.A, this.B),
      new Segment(this.B, this.C),
      new Segment(this.C, this.A)
    ]
  }

  get A() {
    return this.vertices[0]
  }

  get B() {
    return this.vertices[1]
  }

  get C() {
    return this.vertices[2]
  }

  inCircumcircle(point: Point) {
    if (this.vertices.some(vertex => vertex.id === point.id)) return false;

    const ccw = CCW(this.A, this.B, this.C)
    const circumcenter = new Point({
      x: (
        (this.A.x**2 + this.A.y**2) * (this.B.y - this.C.y) + 
        (this.B.x**2 + this.B.y**2) * (this.C.y - this.A.y) + 
        (this.C.x**2 + this.C.y**2) * (this.A.y - this.B.y)
      ) / (2 * ccw),
      y: (
        (this.A.x**2 + this.A.y**2) * (this.C.x - this.B.x) + 
        (this.B.x**2 + this.B.y**2) * (this.A.x - this.C.x) + 
        (this.C.x**2 + this.C.y**2) * (this.B.x - this.A.x)
      ) / (2 * ccw)
    })
    const radius = new Segment(this.A, circumcenter).distance()
    const distance = new Segment(point, circumcenter).distance()

    return distance < radius
  }

}