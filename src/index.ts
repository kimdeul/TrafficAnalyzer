import { BUS_STOPS } from "./data/BusStops";
import { getDistance } from "./geometry/distance";
import { mst } from "./graph/mst";
import { Renderer } from "./render/render";

const get = document.getElementById.bind(document);
const canvas = get("graph")
const renderer = new Renderer((canvas as HTMLCanvasElement).getContext("2d")!!)

renderer.renderWithBackground(() => {
    renderer.renderGraph()
    // renderer.renderUsers()
    // renderer.renderDistance(idx["40224"])
    mst().map(bs => renderer.renderBusStop(bs, "#fff", 16))
    console.log(BUS_STOPS["40393"], BUS_STOPS["40456"])
    console.log(getDistance(BUS_STOPS["40393"], BUS_STOPS["40456"]))
})