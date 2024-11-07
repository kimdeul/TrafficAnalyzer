import { Point } from "../shapes/Point";
import { CCW } from "./vector";

export function composeConvexHull(source: Point[]) {
  
  const points = [...source]
  const size = points.length;
  if (size < 3) return;

  points.sort((a, b) => (a.y !== b.y) ? (a.y - b.y) : (a.x - b.x))
  const first = points.shift() as Point
  points.sort((a, b) => {
    const ccw = CCW(first, a, b)
    return ccw ? -ccw : ((a.y !== b.y) ? (a.y - b.y) : (a.x - b.x));
  })
  points.unshift(first)

  const convex: number[] = []
  convex.push(0)
  convex.push(1)

  for (let i=2; i<size; i++) {
    while (convex.length >= 2) {
      const indexB = convex.pop() as number
      const indexA = convex[convex.length - 1]
      if (CCW(points[indexA], points[indexB], points[i]) > 0) {
        convex.push(indexB)
        break
      }
    }
    convex.push(i)
  }

  return convex.map(index => points[index])

}