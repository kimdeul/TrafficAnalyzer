import Heap from "heap-js";
import { BUS_STOP_ARRAY } from "../data/BusStops";
import { getDistance } from "../geometry/distance";
import { BusRoute, BusRouteColors } from "../types/BusRoute";
import { BusStop } from "../types/BusStop";


type connection = { node: number, weight: number }

function mst(size: number, edges: connection[][], start: number) {
  const result: { route: number[], length: number } = { route: [], length: 0 }
  const visited = new Array<boolean>(size).fill(false)
  const heap = new Heap<connection>((a, b) => a.weight - b.weight)
  heap.push({ node: start, weight: 0 })
  while (!heap.isEmpty()) {
    const now = heap.pop(); if (!now) continue
    if (visited[now.node]) continue;
    visited[now.node] = true;
    result.route.push(now.node)
    result.length += now.weight;
    for (const next of edges[now.node]) {
      if (visited[next.node]) continue;
      heap.push(next)
    }
  }
  return result;
}

export function proposeWithMST(size: number, compare: (a: BusStop, b: BusStop) => number) {

  const selected = BUS_STOP_ARRAY.sort(compare).slice(0, size)
  
  const edges: connection[][] = []
  for (let i=0; i<size; i++) {
    edges.push([])
    for (let j=0; j<size; j++) {
      if (i == j) continue
      edges[i].push({ node: j, weight: getDistance(selected[i], selected[j]) })
    }
  }

  const stops = new Array(size).fill(0)
    .map((_, index) => mst(size, edges, index))
    .reduce((prev, curr) => prev.length < curr.length ? prev : curr, { route: [], length: Infinity })
  
  const route: BusRoute = {
    number: "",
    id: "",
    list: stops.route.map(stop => selected[stop].number),
    color: BusRouteColors.BRANCH
  }

  return route;
}
