import { CCW } from "../algorithm/vector";
import { Point } from "./Point";
import { Shape } from "./Shape";

export class Segment extends Shape {

  readonly from: Point;
  readonly to: Point;
  
  constructor(from: Point, to: Point) {
    super()
    this.from = from;
    this.to = to;
  }

  is(segment: Segment) {
    if (this.from.is(segment.from) && this.to.is(segment.to)) return true;
    if (this.from.is(segment.to) && this.to.is(segment.from)) return true;
    return false;
  }

  distance() {
    return Math.sqrt((this.from.x - this.to.x) ** 2 + (this.from.y - this.to.y) ** 2)
  }

  crossWith(segment: Segment) {
    const [A, B, C, D] = [this.from, this.to, segment.from, segment.to]
    if ([A, B].some(point => point.is(C) || point.is(D))) return false;
    return CCW(A, B, C) * CCW(A, B, D) <= 0 && CCW(C, D, A) * CCW(C, D, B) <= 0
  }
  
}