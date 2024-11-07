import Heap from "heap-js";
import { BUS_STOP_ARRAY, BUS_STOPS } from "../data/BusStops";
import { Geo } from "../geometry/Area";
import { Point } from "../geometry/shapes/Point";
import { BusRoute } from "../types/BusRoute";
import { graph, vertices } from "./graphize";

const visited: { [key: string]: number } = {}
let groupId = 1;

function bfs(start: string) {
  const queue = new Heap<string>()
  const grouped = [start]
  queue.push(start)
  visited[start] = groupId++;
  while (!queue.isEmpty()) {
    const now = queue.pop()!
    for (const { to, route } of graph[now]) {
      if (visited[to]) continue;
      if (route !== "transfer") continue;
      queue.push(to)
      grouped.push(to)
      visited[to] = groupId;
    }
  }
  return grouped;
}

// nearby bus stops form a group
export function grouping() {
  for (const stop of BUS_STOP_ARRAY) {
    if (visited[stop.number]) continue;
    if (!graph[stop.number]?.length) continue;
    const grouped = bfs(stop.number)
    const point = new Point({
      x: grouped.reduce<number>((p, c) => p + BUS_STOPS[c].x, 0) / grouped.length,
      y: grouped.reduce<number>((p, c) => p + BUS_STOPS[c].y, 0) / grouped.length
    }, groupId)
    Geo.points.push(point)
    vertices[stop.number] = point;
  }
}

export function setConstrainedRoute(route: BusRoute) {
  let prev = route.list[0]
  const every = []
  for (const stop of route.list.slice(1)) {
    const [from, to] = [prev, stop].map(id => BUS_STOPS[id])
    if (from && to) {
      const point = { from: vertices[from.number], to: vertices[to.number] }
      if (!point.from || !point.to) continue;
      if (point.from.is(point.to)) continue;
      const segment = point.from.lineTo(point.to)
      every.push(segment)
      // if (segment.distance() >= 500) continue;
      const crosses = Geo.segments.filter(edge => edge.crossWith(segment))
      if (crosses.length) {
        if (crosses.every(edge => edge.distance() < segment.distance())) continue;
        else for (const edge of crosses) edge.delete()
      }
      Geo.segments.push(point.from.lineTo(point.to))
    }
    prev = stop;
  }
  Geo.segments = Geo.segments.filter(segment => !segment.deleted)
  return every;
}