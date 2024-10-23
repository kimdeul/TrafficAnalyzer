import { BUS_ROUTES } from "./data/BusRoutes";
import { BUS_STOP_ARRAY, BUS_STOPS } from "./data/BusStops";
import { graph, graphize } from "./graph/graphize";
import { naiveFloydWashall } from "./graph/shortest";
import { Renderer } from "./render/render";

export const $ = document.getElementById.bind(document);
const canvas = $("graph")

graphize()
const START_NUMBER = "40224"
const distances = naiveFloydWashall(START_NUMBER)
const renderer = new Renderer((canvas as HTMLCanvasElement).getContext("2d")!!)

renderer.renderWithBackground(() => {
    renderer.renderGraph()
    // renderer.renderUsers()
    renderer.renderDistance(distances, START_NUMBER)
    console.log(graph)
    const isolated = BUS_STOP_ARRAY.filter(stop => distances[stop.number] === Infinity && graph[stop.number].length === 0)
    isolated.map(stop => renderer.renderBusStop(stop, "#fff", 20))
    for (const stop of BUS_ROUTES.find(route => route.number === "24-1")?.list ?? []) console.log(BUS_STOPS[stop]?.name)
    // renderer.renderBusRoute(proposeWithMst(8, (a, b) => graph[`${b.number}`]?.length - graph[`${a.number}`]?.length))
})