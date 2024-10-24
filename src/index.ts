import { BUS_STOPS } from "./data/BusStops";
import { graphize } from "./graph/graphize";
import { naiveDijkstra } from "./graph/shortest";
import { proposeWithTSP } from "./graph/tsp";
import { Renderer } from "./render/render";
import { $, setTable } from "./render/tables";

export const Create = document.createElement.bind(document);
const canvas = $("graph")
const renderer = new Renderer((canvas as HTMLCanvasElement).getContext("2d")!!)
graphize()

const START_NUMBER = "40224"
const COMPLEXITY_VIEWPOINT = ["40049", "40785", "40451", "40533", "40631", "40683", "40853", "40790"]
const distances = naiveDijkstra(START_NUMBER)

renderer.renderWithBackground(() => {
    renderer.renderGraph()
    // renderer.renderUsers()
    COMPLEXITY_VIEWPOINT.map(number => renderer.renderBusStop(BUS_STOPS[number], "#fff", 12))
    renderer.renderDistance(distances, START_NUMBER)
    setTable(COMPLEXITY_VIEWPOINT, distances)

    renderer.renderBusRoute(proposeWithTSP(10, (a, b) => BUS_STOPS[`${b.number}`].users.average - BUS_STOPS[`${a.number}`].users.average))

    // renderer.renderBusRoute(proposeWithMst(10, (a, b) => BUS_STOPS[`${b.number}`].users.average - BUS_STOPS[`${a.number}`].users.average))

})