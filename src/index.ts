import { proposeWithMst } from "./graph/mst";
import { Renderer } from "./render/render";

const get = document.getElementById.bind(document);
const canvas = get("graph")
const renderer = new Renderer((canvas as HTMLCanvasElement).getContext("2d")!!)

renderer.renderWithBackground(() => {
    renderer.renderGraph()
    // renderer.renderUsers()
    // renderer.renderDistance(idx["40224"])
    console.log(proposeWithMst(10))
    renderer.renderBusRoute(proposeWithMst(10))
})