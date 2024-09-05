import Heap from "heap-js";
import { BUS_ROUTES } from "../data/BusRoutes";
import { BUS_STOPS } from "../data/BusStops";

type vertex = { to: number, weight: number }

export const graph: Map<string, vertex[]> = new Map()
export const idx: { [key: string]: number } = {};
for (let i=0; i<BUS_STOPS.length; i++) idx[`${BUS_STOPS[i].number}`] = i;

function dist(from: typeof BUS_STOPS[number], to: typeof BUS_STOPS[number]) {
    return Math.sqrt((from.x - to.x) ** 2 + (from.y - to.y) ** 2)
}

export function graphize() {
    BUS_ROUTES.map(route => {
        let prev = route.list[0]
        for (const stop of route.list.slice(1)) {
            if (!graph.has(`${stop}`)) graph.set(`${stop}`, [])
            const [from, to] = [prev, stop].map(id => BUS_STOPS.find(s => s.number === id))
            if (from && to && to.number) graph.get(`${from.number}`)?.push({ to: to.number, weight: dist(from, to)})
            prev = stop;
        }
    })

    // BUS_STOPS.map(from => {
    //     const to = BUS_STOPS.find(stop => stop.number === BUS_STOPS.filter(to => to.name === from.name)?.[0].number)
    //     if (!to || !to.number || !from.number) return;
    //     graph.get(`${to.number}`)?.push({ to: from.number, weight: dist(from, to)})
    //     graph.get(`${from.number}`)?.push({ to: to.number, weight: dist(from, to)})
    // })

    // import sys
    // from math import inf

    // N = int(input())
    // M = int(input())

    // graph = [[inf] * N for _ in range(N)]
    // for _ in range(M):
    //     a, b, weight = map(int, sys.stdin.readline().split())
    //     graph[a-1][b-1] = min(weight, graph[a-1][b-1])

    // for transitP in range(N):
    //     for fromP in range(N):
    //         for toP in range(N):
    //             if fromP == toP: continue
    //             graph[fromP][toP] = min(graph[fromP][toP], graph[fromP][transitP]+graph[transitP][toP])

    // for i in graph:
    //     print(' '.join(map(str, i)).replace('inf', '0'))

    console.log("Graphize completed.")

}

export function dijkstra(start: number) {

    const distances = new Array(BUS_STOPS.length).fill(0).map(_ => Infinity)
    const heap = new Heap<[number, number]>((a, b) => a[1] - b[1])
    heap.init([[start, 0]])

    while (heap.size()) {
        const [nowp, noww] = heap.pop() as [number, number]
        if (distances[nowp] < noww) continue;
        for (const bs of graph.get(`${BUS_STOPS[nowp].number}`) ?? []) {
            const [nextp, nextw] = [idx[bs.to], noww + bs.weight]
            if (nextw < distances[nextp]) {
                distances[nextp] = nextw;
                heap.push([nextp, nextw])
            }
        }
    }

    return distances;
}