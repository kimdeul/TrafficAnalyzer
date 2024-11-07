import { Geo } from "../../Area"
import { Segment } from "../../shapes/Segment"
import { delaunay } from "./delaunay"
import { demolish } from "./demolish"

export function insert(segment: Segment) {
  const { upper, lower } = demolish(segment)
  Geo.triangles.push(...delaunay(upper).filter(triangle => triangle.edges.every(edge => Geo.triangles.every(tri2 => tri2.edges.every(e2 => !e2.crossWith(edge))))))
  Geo.triangles.push(...delaunay(lower).filter(triangle => triangle.edges.every(edge => Geo.triangles.every(tri2 => tri2.edges.every(e2 => !e2.crossWith(edge))))))
}