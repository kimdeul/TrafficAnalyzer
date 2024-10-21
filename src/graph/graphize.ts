import { BUS_ROUTES } from "../data/BusRoutes";
import { BUS_STOP_ARRAY, BUS_STOPS } from "../data/BusStops";
import { getDistance } from "../geometry/distance";
import { Discrits } from "../types/BusStop";

type connection = { to: number, weight: number, route: string }

export const graph: { [key: string]: connection[] } = {}
export const idx: { [key: string]: number } = {};
for (let i=0; i<BUS_STOP_ARRAY.length; i++) idx[`${BUS_STOP_ARRAY[i].number}`] = i;

export function graphize() {
    for (const route of BUS_ROUTES) {
        let prev = route.list[0]
        for (const stop of route.list.slice(1)) {
            if (!graph[`${stop}`] && BUS_STOPS[`${stop}`]?.discrit === Discrits.BUPYEONG) graph[`${stop}`] = []
            const [from, to] = [prev, stop].map(id => BUS_STOPS[id])
            if (from && to && from.number && to.number) graph[`${from.number}`]?.push({ to: to.number, weight: getDistance(from, to), route: route.number })
            prev = stop;
        }
    }

    // Remove out-scope

    // Upside-downside transfer
    for (const from of BUS_STOP_ARRAY) {
        const to = BUS_STOP_ARRAY.find(stop => stop.number === BUS_STOP_ARRAY.filter(to => to.name === from.name && getDistance(from, to) <= 0.1)?.[0]?.number)
        if (!to || !to.number || !from.number) return;
        graph[`${to.number}`]?.push({ to: from.number, weight: getDistance(from, to), route: "transfer"})
        graph[`${from.number}`]?.push({ to: to.number, weight: getDistance(from, to), route: "transfer"})
    }

    console.log("Graphize completed.")

}