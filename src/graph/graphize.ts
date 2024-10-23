import { BUS_ROUTES } from "../data/BusRoutes";
import { BUS_STOP_ARRAY, BUS_STOPS } from "../data/BusStops";
import { getDistance } from "../geometry/distance";

type connection = { to: string, weight: number, route: string }

export const graph: { [key: string]: connection[] } = {}

const AVERAGE_BUS_SPEED = 15 / 3.6;
const AVERAGE_STOP_TIME = 20;
const AVERAGE_WALKING_SPEED = 4.8 / 3.6;

export function graphize() {

    for (const stop of BUS_STOP_ARRAY) if (!graph[`${stop.number}`]) graph[`${stop.number}`] = []

    for (const route of BUS_ROUTES) {
        let prev = route.list[0]
        for (const stop of route.list.slice(1)) {
            const [from, to] = [prev, stop].map(id => BUS_STOPS[id])
            if (from && to && from.number && to.number) graph[`${from.number}`]?.push({ to: `${to.number}`, weight: getDistance(from, to) / AVERAGE_BUS_SPEED + AVERAGE_STOP_TIME, route: route.number })
            prev = stop;
        }
    }

    // Remove out-scope

    // Upside-downside transfer
    for (const from of BUS_STOP_ARRAY) {
        const in50 = BUS_STOP_ARRAY.filter(stop => from.number !== stop.number && getDistance(from, stop) <= 50)
        const in200 = BUS_STOP_ARRAY.filter(stop => from.number !== stop.number && from.name === stop.name && getDistance(from, stop) <= 200)
        // 50m 내 정류장은 도보로 반드시 잇고, 200m 안이면서 이름이 동일하면 동일정류장 간주. 예외적으로 일신동 40117 - 40106번 정류장은 고속도로 인근이라 간격이 넓음. 이어주지 않으면 고립
        const toArray = from.number === "40117" ? [BUS_STOPS["40106"]] : (in50.length ? in50 : in200);
        if (!from.number) return;
        for (const to of toArray) {
            if (!to.number) continue;
            if (!graph[`${to.number}`]?.find(connection => connection.to === `${from.number}`)) 
                graph[`${to.number}`]?.push({ to: `${from.number}`, weight: getDistance(from, to) / AVERAGE_WALKING_SPEED, route: "transfer" })
            if (!graph[`${from.number}`]?.find(connection => connection.to === `${to.number}`))     
                graph[`${from.number}`]?.push({ to: `${to.number}`, weight: getDistance(from, to) / AVERAGE_WALKING_SPEED, route: "transfer" })
        }
    }

    console.log("Graphize completed.")

}