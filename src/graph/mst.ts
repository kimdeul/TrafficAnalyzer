import Heap from "heap-js";
import { BUS_STOP_ARRAY } from "../data/BusStops";
import { getDistance } from "../geometry/distance";
import { BusRoute, BusRouteColors } from "../types/BusRoute";


type connection = { node: number, weight: number }

function mst(size: number, edges: connection[][], start: number) {
  const route = []
  const visited = new Array<boolean>(size).fill(false)
  const heap = new Heap<connection>((a, b) => a.weight - b.weight)
  heap.push({ node: 0, weight: 0 })
  while (!heap.isEmpty()) {
    const now = heap.pop(); if (!now) continue
    if (visited[now.node]) continue;
    visited[now.node] = true;
    route.push(now)
    for (const next of edges[now.node]) {
      if (visited[next.node]) continue;
      heap.push(next)
    }
  }
  return route;
}

export function proposeWithMst(size: number) {

  const selected = BUS_STOP_ARRAY.sort((a, b) => b.users.average - a.users.average).slice(0, size)
  
  const edges: connection[][] = []
  for (let i=0; i<size; i++) {
    edges.push([])
    for (let j=0; j<size; j++) {
      if (i == j) continue
      edges[i].push({ node: j, weight: getDistance(selected[i], selected[j]) })
    }
  }

  const stops = mst(size, edges, 1).map(index => selected[index.node])
  const route: BusRoute = {
    number: "",
    id: "",
    list: stops.map(stop => stop.number),
    color: BusRouteColors.BRANCH
  }
  return route;
}
