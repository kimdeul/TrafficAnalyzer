import { Point } from "../shapes/Point";

export function CCW(a: Point, b: Point, c: Point) {
  return (a.x*b.y + b.x*c.y + c.x*a.y) - (a.y*b.x + b.y*c.x + c.y*a.x);
}