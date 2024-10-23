import Heap from "heap-js";
import { BUS_STOP_ARRAY, BUS_STOPS } from "../data/BusStops";
import { graph } from "./graphize";

type connection = { node: string, weight: number }

export function dijkstra(start: string) {

  const distances = Object.fromEntries(BUS_STOP_ARRAY.map(stop => [stop.number, Infinity]))
  const heap = new Heap<connection>((a, b) => a.weight - b.weight)
  heap.init([{ node: start, weight: 0 }])

  while (heap.size()) {
      const now = heap.pop()
      if (!now) continue;
      if (distances[now.node] < now.weight) continue;
      for (const to of graph[`${BUS_STOPS[now.node].number}`] ?? []) {
          const next: connection = { node: `${to.to}`, weight: now.weight + to.weight }
          if (next.weight < distances[next.node]) {
              distances[next.node] = next.weight;
              heap.push(next)
          }
      }
  }

  return distances;
}
