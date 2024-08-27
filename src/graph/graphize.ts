import { BUS_ROUTES } from "../data/BusRoutes";
import { BUS_STOPS } from "../data/BusStops";

type vertex = { to: number, weight: number }

export const graph: Map<string, vertex[]> = new Map()

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
    console.log("Graphize completed.")
}