import Heap from "heap-js";
import { BUS_STOP_ARRAY } from "../data/BusStops";
import { graph, idx } from "./graphize";

export function dijkstra(start: number) {

  const distances = new Array(BUS_STOP_ARRAY.length).fill(0).map(_ => Infinity)
  const heap = new Heap<[number, number]>((a, b) => a[1] - b[1])
  heap.init([[start, 0]])

  while (heap.size()) {
      const [nowp, noww] = heap.pop() as [number, number]
      if (distances[nowp] < noww) continue;
      for (const bs of graph[`${BUS_STOP_ARRAY[nowp].number}`] ?? []) {
          const [nextp, nextw] = [idx[bs.to], noww + bs.weight]
          const route = bs.route
          if (nextw < distances[nextp]) {
              distances[nextp] = nextw;
              heap.push([nextp, nextw])
          }
      }
  }

  return distances;
}