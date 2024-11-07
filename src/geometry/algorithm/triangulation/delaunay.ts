import { Area } from "../../Area";
import { Point } from "../../shapes/Point";
import { Segment } from "../../shapes/Segment";
import { Triangle } from "../../shapes/Triangle";

class SuperPoint extends Point {}

function setSuperTriangle(source: Point[]) {
  const arrX = source.map(point => point.x), arrY = source.map(point => point.y)
  const 
    minX = Math.min(...arrX), maxX = Math.max(...arrX),
    minY = Math.min(...arrY), maxY = Math.max(...arrY)
  const dX = maxX - minX, dY = maxY - minY;
  const dM = Math.max(dX, dY)

  return new Triangle([
    new SuperPoint({ x: minX + dX/2, y: minY - dM * 3}),
    new SuperPoint({ x: minX - dM*3, y: maxY + dM }),
    new SuperPoint({ x: maxX + dM*3, y: maxY + dM })
  ])

}

export function delaunay(source: Point[]) {

  // Cannot make DT.
  if (source.length < 3) {
    return [];
  }

  const Local: Area = {
    points: [],
    segments: [],
    triangles: []
  }

  Local.points.push(...source)
  Local.triangles.push(setSuperTriangle(source))
  Local.points.push(...Local.triangles[0].vertices)

  for (let i=0; i<source.length; i++) {
    const point = Local.points[i]
    const filtered: Segment[] = []

    for (const triangle of Local.triangles) {
      if (triangle.deleted) continue;
      if (triangle.inCircumcircle(point)) {
        triangle.delete()
        filtered.push(...triangle.edges)
      }
    }

    const edges: Segment[] = []
    for (const segment of filtered) {
      const found = edges.find(seg => !seg.deleted && seg.is(segment))
      if (!found) edges.push(segment)
      else {
        found.delete()
        segment.delete()
      }
    }

    for (const segment of edges) {
      if (segment.deleted) continue;
      Local.triangles.push(new Triangle([segment.from, segment.to, point]))
    }

  }

  Local.triangles = Local.triangles.filter(triangle => !triangle.deleted)
  Local.triangles = Local.triangles.filter(triangle => !triangle.vertices.some(point => point instanceof SuperPoint))
  return Local.triangles;
}