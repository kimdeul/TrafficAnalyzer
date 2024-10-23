import Heap from "heap-js";
import { BUS_STOP_ARRAY, BUS_STOPS } from "../data/BusStops";
import { graph } from "./graphize";

type connection = { node: string, weight: number }

export function naiveDijkstra(start: string) {

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

export function naiveFloydWashall(start: string) {
    const distances = Object.fromEntries(BUS_STOP_ARRAY.map(stop => [
        stop.number, Object.fromEntries(BUS_STOP_ARRAY.map(stop2 => [
            stop2.number, 
            stop2.number === stop.number ? 0 : (graph[stop.number].find(connection => connection.to === stop2.number)?.weight ?? Infinity)
        ])
    )]))

    const BUS_STOP_NUMBERS = BUS_STOP_ARRAY.map(stop => stop.number)
    for (const k of BUS_STOP_NUMBERS) {
        for (const i of BUS_STOP_NUMBERS) {
            for (const j of BUS_STOP_NUMBERS) {
                if (distances[i][k] + distances[k][j] < distances[i][j]) distances[i][j] = distances[i][k] + distances[k][j]
            }
        }
    }

    return Object.fromEntries(BUS_STOP_NUMBERS.map(stop => [stop, distances[stop][start]]))
}