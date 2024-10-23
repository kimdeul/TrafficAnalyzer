import { graphize } from "./graph/graphize";
import { dijkstra } from "./graph/shortest";
import { Renderer } from "./render/render";

export const $ = document.getElementById.bind(document);
const canvas = $("graph")

graphize()
const distances = dijkstra("40224")
const renderer = new Renderer((canvas as HTMLCanvasElement).getContext("2d")!!)

renderer.renderWithBackground(() => {
    renderer.renderGraph()
    // renderer.renderUsers()
    renderer.renderDistance(distances, "40224")
    // renderer.renderBusRoute(proposeWithMst(8, (a, b) => graph[`${b.number}`]?.length - graph[`${a.number}`]?.length))
})
