import { BUS_ROUTES } from "../data/BusRoutes";
import { BUS_STOP_ARRAY, BUS_STOPS } from "../data/BusStops";
import { Geo } from "../geometry/Area";
import { getDistance } from "../geometry/distance";
import { Point } from "../geometry/shapes/Point";
import { BusRoute } from "../types/BusRoute";

type connection = { to: string, weight: number, route: string }
type degree = { in: number, out: number }

/*
    [Key: BusStop.number]
    graph: grpah connections
    pairs: to get upper-bound/lower-bound
    degrees: to calcuate in-out degrees
    vertices: vertex by group(expanded pairs), used in geo methods
*/

export const graph: { [key: string]: connection[] } = {}
export const pairs: { [key: string]: string } = {}
export const degrees: { [key: string]: degree } = Object.fromEntries(BUS_STOP_ARRAY.map(stop => [stop.number, { in: 0, out: 0}]))
export const vertices: { [key: string]: Point } = {}

const AVERAGE_BUS_SPEED = 15 / 3.6;
const AVERAGE_STOP_TIME = 20;
const AVERAGE_WALKING_SPEED = 4.8 / 3.6;

export function graphizeRoute(route: BusRoute) {
    let prev = route.list[0]
    for (const stop of route.list.slice(1)) {
        const [from, to] = [prev, stop].map(id => BUS_STOPS[id])
        if (from && to) {
            graph[`${from.number}`]?.push({ to: `${to.number}`, weight: getDistance(from, to) / AVERAGE_BUS_SPEED + AVERAGE_STOP_TIME, route: route.number })
            degrees[`${from.number}`].out++
            degrees[`${to.number}`].in++
        }
        prev = stop;
    }
}

export function graphize() {

    for (const stop of BUS_STOP_ARRAY) if (!graph[`${stop.number}`]) graph[`${stop.number}`] = []
    for (const route of BUS_ROUTES) graphizeRoute(route)

    // Upside-downside transfer
    for (const from of BUS_STOP_ARRAY) {
        const in50 = BUS_STOP_ARRAY.filter(stop => from.number !== stop.number && getDistance(from, stop) <= 50)
        const in200 = BUS_STOP_ARRAY.filter(stop => from.number !== stop.number && from.name === stop.name && getDistance(from, stop) <= 200)
        // 50m 내 정류장은 도보로 반드시 잇고, 200m 안이면서 이름이 동일하면 동일정류장 간주
        // 몇몇 정류장은 큰 도로 인근이라 간격이 넓음. 이어주지 않으면 고립
        const isolatedPair: { [key: string]: string } = { "40117": "40106", "40644": "40647" }
        const toArray = (isolatedPair[from.number] ? [BUS_STOPS[isolatedPair[from.number]]] : (in50.length ? in50 : in200)).sort((a, b) => getDistance(a, from) - getDistance(b, from));
        if (!from.number) return;

        // 상하행 짝으로 등록
        if (toArray[0]) pairs[from.number] = toArray[0].number;
        
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

export function graphizeTriangulation() {
    const map: { [key: string]: string[] } = {}
    for (const key in vertices) {
        if (!map[vertices[key].id]) map[vertices[key].id] = []
        map[vertices[key].id].push(key)
    }
    
    for (const triangle of Geo.triangles) {
        for (const edge of triangle.edges) {
            const from = BUS_STOPS[map[edge.from.id][0]]
            const to = BUS_STOPS[map[edge.to.id][0]]
            if (!graph[from.number]?.find(connection => connection.to === to.number)) graph[`${from.number}`]?.push({ to: `${to.number}`, weight: getDistance(from, to) / AVERAGE_BUS_SPEED + AVERAGE_STOP_TIME, route: "delaunay" })
            if (!graph[to.number]?.find(connection => connection.to === from.number)) graph[`${to.number}`]?.push({ to: `${from.number}`, weight: getDistance(from, to) / AVERAGE_BUS_SPEED + AVERAGE_STOP_TIME, route: "delaunay" })
        }
    }
}